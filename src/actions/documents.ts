"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteObject } from "@/lib/s3";

export async function createDocumentRecord(
  dogId: string,
  data: {
    name: string;
    type: string;
    s3Key: string;
    fileSize?: number;
    mimeType?: string;
  }
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const dog = await prisma.dog.findUnique({ where: { id: dogId } });
  if (!dog || dog.userId !== session.user.id) {
    return { error: "Dog not found." };
  }

  await prisma.document.create({
    data: {
      dogId,
      name: data.name,
      type: data.type,
      s3Key: data.s3Key,
      fileSize: data.fileSize || null,
      mimeType: data.mimeType || null,
    },
  });

  revalidatePath(`/dogs/${dogId}`);
  return { success: true };
}

export async function deleteDocument(documentId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { dog: true },
  });

  if (!document || document.dog.userId !== session.user.id) {
    return { error: "Document not found." };
  }

  try {
    await deleteObject(document.s3Key);
  } catch {
    // S3 deletion failure is non-critical
  }

  await prisma.document.delete({ where: { id: documentId } });
  revalidatePath(`/dogs/${document.dogId}`);
  return { success: true };
}
