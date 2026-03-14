"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createVaccination(
  dogId: string,
  data: {
    name: string;
    dateAdministered: string;
    expirationDate?: string;
    boosterDueDate?: string;
    veterinarian?: string;
    lotNumber?: string;
    notes?: string;
    proof?: { s3Key: string; name: string; fileSize?: number; mimeType?: string };
  }
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const dog = await prisma.dog.findUnique({ where: { id: dogId } });
  if (!dog || dog.userId !== session.user.id) {
    return { error: "Dog not found." };
  }

  if (!data.name || !data.dateAdministered) {
    return { error: "Vaccine name and date are required." };
  }

  let proofDocumentId: string | null = null;
  if (data.proof?.s3Key && data.proof?.name) {
    const doc = await prisma.document.create({
      data: {
        dogId,
        name: data.proof.name,
        type: "vaccine_certificate",
        s3Key: data.proof.s3Key,
        fileSize: data.proof.fileSize ?? null,
        mimeType: data.proof.mimeType ?? null,
      },
    });
    proofDocumentId = doc.id;
  }

  await prisma.vaccination.create({
    data: {
      dogId,
      name: data.name,
      dateAdministered: new Date(data.dateAdministered),
      expirationDate: data.expirationDate
        ? new Date(data.expirationDate)
        : null,
      boosterDueDate: data.boosterDueDate
        ? new Date(data.boosterDueDate)
        : null,
      veterinarian: data.veterinarian || null,
      lotNumber: data.lotNumber || null,
      notes: data.notes || null,
      proofDocumentId,
    },
  });

  revalidatePath(`/dogs/${dogId}`);
  return { success: true };
}

export async function updateVaccination(
  vaccinationId: string,
  data: {
    name?: string;
    dateAdministered?: string;
    expirationDate?: string;
    boosterDueDate?: string;
    veterinarian?: string;
    lotNumber?: string;
    notes?: string;
  }
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const vaccination = await prisma.vaccination.findUnique({
    where: { id: vaccinationId },
    include: { dog: true },
  });

  if (!vaccination || vaccination.dog.userId !== session.user.id) {
    return { error: "Vaccination not found." };
  }

  await prisma.vaccination.update({
    where: { id: vaccinationId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.dateAdministered && {
        dateAdministered: new Date(data.dateAdministered),
      }),
      ...(data.expirationDate !== undefined && {
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate)
          : null,
      }),
      ...(data.boosterDueDate !== undefined && {
        boosterDueDate: data.boosterDueDate
          ? new Date(data.boosterDueDate)
          : null,
      }),
      ...(data.veterinarian !== undefined && {
        veterinarian: data.veterinarian || null,
      }),
      ...(data.lotNumber !== undefined && {
        lotNumber: data.lotNumber || null,
      }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });

  revalidatePath(`/dogs/${vaccination.dogId}`);
  return { success: true };
}

export async function deleteVaccination(vaccinationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const vaccination = await prisma.vaccination.findUnique({
    where: { id: vaccinationId },
    include: { dog: true },
  });

  if (!vaccination || vaccination.dog.userId !== session.user.id) {
    return { error: "Vaccination not found." };
  }

  await prisma.vaccination.delete({ where: { id: vaccinationId } });
  revalidatePath(`/dogs/${vaccination.dogId}`);
  return { success: true };
}
