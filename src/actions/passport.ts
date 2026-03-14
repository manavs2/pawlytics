"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function generatePassportLink(
  dogId: string,
  expiresInDays?: number
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const dog = await prisma.dog.findUnique({ where: { id: dogId } });
  if (!dog || dog.userId !== session.user.id) {
    return { error: "Dog not found." };
  }

  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const link = await prisma.passportLink.create({
    data: {
      dogId,
      expiresAt,
    },
  });

  revalidatePath(`/dogs/${dogId}`);
  return { success: true, token: link.token };
}

export async function revokePassportLink(linkId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const link = await prisma.passportLink.findUnique({
    where: { id: linkId },
    include: { dog: true },
  });

  if (!link || link.dog.userId !== session.user.id) {
    return { error: "Link not found." };
  }

  await prisma.passportLink.update({
    where: { id: linkId },
    data: { isActive: false },
  });

  revalidatePath(`/dogs/${link.dogId}`);
  return { success: true };
}
