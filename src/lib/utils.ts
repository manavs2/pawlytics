import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInYears, differenceInMonths, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDogAge(dateOfBirth: Date): string {
  const now = new Date();
  const years = differenceInYears(now, dateOfBirth);
  if (years >= 1) {
    return `${years} ${years === 1 ? "year" : "years"} old`;
  }
  const months = differenceInMonths(now, dateOfBirth);
  return `${months} ${months === 1 ? "month" : "months"} old`;
}

export function formatDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffDays = Math.floor(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays === 1) return "1 day overdue";
    if (absDays < 30) return `${absDays} days overdue`;
    return `${Math.floor(absDays / 30)} months overdue`;
  }
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays < 7) return `Due in ${diffDays} days`;
  if (diffDays < 30) return `Due in ${Math.floor(diffDays / 7)} weeks`;
  return `Due in ${Math.floor(diffDays / 30)} months`;
}
