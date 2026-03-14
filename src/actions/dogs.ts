"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCareEventsForDog } from "@/lib/care-scheduler";
import { dogSchema } from "@/lib/validations";
import {
  DOG_IMAGE_ALLOWED_TYPES,
  DOG_IMAGE_MAX_BYTES,
  fileToDataUrl,
  isGeneratedBreedFallback,
} from "@/lib/dog-images";

export async function createDog(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const imageFile = formData.get("image");

  const raw = {
    name: formData.get("name") as string,
    breed: formData.get("breed") as string,
    dateOfBirth: formData.get("dateOfBirth") as string,
    sex: formData.get("sex") as string,
    weight: formData.get("weight") as string,
    color: formData.get("color") as string,
    microchipId: formData.get("microchipId") as string,
  };

  const parsed = dogSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input." };
  }

  const { name, breed, dateOfBirth, sex, weight, color, microchipId } =
    parsed.data;

  // Only store user-uploaded images; breed fallback is computed at display time.
  let imageUrl: string | null = null;
  if (imageFile instanceof File && imageFile.size > 0) {
    if (!DOG_IMAGE_ALLOWED_TYPES.includes(imageFile.type as (typeof DOG_IMAGE_ALLOWED_TYPES)[number])) {
      return { error: "Dog photo must be a JPG, PNG, or WebP image." };
    }
    if (imageFile.size > DOG_IMAGE_MAX_BYTES) {
      return { error: "Dog photo must be under 2MB." };
    }
    imageUrl = await fileToDataUrl(imageFile);
  }

  const dog = await prisma.dog.create({
    data: {
      userId: session.user.id,
      name,
      breed,
      dateOfBirth: new Date(dateOfBirth),
      sex,
      weight,
      color,
      microchipId,
      imageUrl,
    },
  });

  const careEvents = generateCareEventsForDog(dog);
  if (careEvents.length > 0) {
    await prisma.careEvent.createMany({ data: careEvents });
  }

  redirect(`/dogs/${dog.id}`);
}

export async function updateDog(dogId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const imageFile = formData.get("image");

  const dog = await prisma.dog.findUnique({ where: { id: dogId } });
  if (!dog || dog.userId !== session.user.id) {
    return { error: "Dog not found." };
  }

  const raw = {
    name: formData.get("name") as string,
    breed: formData.get("breed") as string,
    dateOfBirth: formData.get("dateOfBirth") as string,
    sex: formData.get("sex") as string,
    weight: formData.get("weight") as string,
    color: formData.get("color") as string,
    microchipId: formData.get("microchipId") as string,
  };

  const parsed = dogSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input." };
  }

  const { name, breed, dateOfBirth, sex, weight, color, microchipId } =
    parsed.data;

  const breedChanged = dog.breed !== breed;

  // Determine new imageUrl:
  // - New upload → convert to data URL
  // - Old SVG monogram fallback → clear it (breed avatar handled at display time)
  // - Existing user photo → keep it (even if breed changed)
  let imageUrl: string | null = dog.imageUrl;

  if (imageFile instanceof File && imageFile.size > 0) {
    if (!DOG_IMAGE_ALLOWED_TYPES.includes(imageFile.type as (typeof DOG_IMAGE_ALLOWED_TYPES)[number])) {
      return { error: "Dog photo must be a JPG, PNG, or WebP image." };
    }
    if (imageFile.size > DOG_IMAGE_MAX_BYTES) {
      return { error: "Dog photo must be under 2MB." };
    }
    imageUrl = await fileToDataUrl(imageFile);
  } else if (isGeneratedBreedFallback(dog.imageUrl)) {
    // Migrate old SVG or stale API route URL → null so breed avatar kicks in fresh
    imageUrl = null;
  }

  await prisma.dog.update({
    where: { id: dogId },
    data: {
      name,
      breed,
      dateOfBirth: new Date(dateOfBirth),
      sex,
      weight,
      color,
      microchipId,
      imageUrl,
    },
  });

  if (breedChanged) {
    await prisma.careEvent.deleteMany({
      where: { dogId, completedAt: null },
    });
    const updatedDog = await prisma.dog.findUniqueOrThrow({
      where: { id: dogId },
    });
    const careEvents = generateCareEventsForDog(updatedDog);
    if (careEvents.length > 0) {
      await prisma.careEvent.createMany({ data: careEvents });
    }
  }

  revalidatePath(`/dogs/${dogId}`);
  redirect(`/dogs/${dogId}`);
}

export async function deleteDog(dogId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const dog = await prisma.dog.findUnique({ where: { id: dogId } });
  if (!dog || dog.userId !== session.user.id) {
    return { error: "Dog not found." };
  }

  await prisma.dog.delete({ where: { id: dogId } });
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
