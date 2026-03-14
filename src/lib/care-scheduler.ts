import { addMonths, differenceInMonths, isBefore, startOfDay } from "date-fns";
import type { Dog } from "@/generated/prisma/client";
import { getBreedInfo } from "./breeds";
import { CARE_RULES, type Predicate } from "./care-rules";

interface CareEventCreateInput {
  dogId: string;
  type: string;
  title: string;
  description: string | null;
  dueDate: Date;
  recurrenceRule: string | null;
}

function matchesPredicate(
  predicate: Predicate,
  breed: string,
  size: string,
  traits: string[]
): boolean {
  switch (predicate.kind) {
    case "all":
      return true;
    case "breeds":
      return predicate.breeds.includes(breed);
    case "size":
      return predicate.sizes.includes(size as "small" | "medium" | "large" | "giant");
    case "trait":
      return traits.includes(predicate.trait);
  }
}

function recurrenceToMonths(recurrence: string): number {
  const map: Record<string, number> = {
    EVERY_1_MONTH: 1,
    EVERY_2_MONTHS: 2,
    EVERY_3_MONTHS: 3,
    EVERY_6_MONTHS: 6,
    EVERY_12_MONTHS: 12,
  };
  return map[recurrence] ?? 1;
}

export function computeNextDueDate(
  completedAt: Date,
  recurrenceRule: string
): Date {
  const months = recurrenceToMonths(recurrenceRule);
  return addMonths(completedAt, months);
}

export function generateCareEventsForDog(dog: Dog): CareEventCreateInput[] {
  const breedInfo = getBreedInfo(dog.breed);
  const today = startOfDay(new Date());
  const ageMonths = differenceInMonths(today, new Date(dog.dateOfBirth));
  const events: CareEventCreateInput[] = [];

  for (const rule of CARE_RULES) {
    if (!matchesPredicate(rule.applicableTo, dog.breed, breedInfo.size, breedInfo.traits)) {
      continue;
    }

    if (rule.startAgeMonths && ageMonths < rule.startAgeMonths) {
      const dueDate = addMonths(new Date(dog.dateOfBirth), rule.startAgeMonths);
      events.push({
        dogId: dog.id,
        type: rule.type,
        title: rule.title,
        description: rule.description,
        dueDate,
        recurrenceRule: rule.recurrence,
      });
      continue;
    }

    let dueDate = today;

    if (rule.startAgeMonths) {
      dueDate = addMonths(new Date(dog.dateOfBirth), rule.startAgeMonths);
      const months = recurrenceToMonths(rule.recurrence);
      while (isBefore(dueDate, today)) {
        dueDate = addMonths(dueDate, months);
      }
    }

    events.push({
      dogId: dog.id,
      type: rule.type,
      title: rule.title,
      description: rule.description,
      dueDate,
      recurrenceRule: rule.recurrence,
    });
  }

  return events;
}
