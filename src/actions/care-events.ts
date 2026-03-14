"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeNextDueDate } from "@/lib/care-scheduler";

export async function completeCareEvent(eventId: string, notes?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const event = await prisma.careEvent.findUnique({
    where: { id: eventId },
    include: { dog: true },
  });

  if (!event || event.dog.userId !== session.user.id) {
    return { error: "Care event not found." };
  }

  const now = new Date();

  await prisma.careEvent.update({
    where: { id: eventId },
    data: {
      completedAt: now,
      notes: notes || null,
    },
  });

  if (event.recurrenceRule) {
    const nextDueDate = computeNextDueDate(now, event.recurrenceRule);
    await prisma.careEvent.create({
      data: {
        dogId: event.dogId,
        type: event.type,
        title: event.title,
        description: event.description,
        dueDate: nextDueDate,
        recurrenceRule: event.recurrenceRule,
      },
    });
  }

  revalidatePath(`/dogs/${event.dogId}`);
  return { success: true };
}

export async function skipCareEvent(eventId: string) {
  return completeCareEvent(eventId, "Skipped");
}

export async function createCustomCareEvent(
  dogId: string,
  data: {
    title: string;
    description?: string;
    dueDate: string;
    type?: string;
    recurrenceRule?: string;
  }
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const dog = await prisma.dog.findUnique({ where: { id: dogId } });
  if (!dog || dog.userId !== session.user.id) {
    return { error: "Dog not found." };
  }

  await prisma.careEvent.create({
    data: {
      dogId,
      type: data.type || "custom",
      title: data.title,
      description: data.description || null,
      dueDate: new Date(data.dueDate),
      recurrenceRule: data.recurrenceRule || null,
    },
  });

  revalidatePath(`/dogs/${dogId}`);
  return { success: true };
}
