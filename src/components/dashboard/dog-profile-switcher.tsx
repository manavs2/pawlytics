"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDogDisplayImage } from "@/lib/dog-images";

interface Dog {
  id: string;
  name: string;
  imageUrl: string | null;
  breed: string;
}

interface DogProfileSwitcherProps {
  dogs: Dog[];
  activeDogId: string;
}

export function DogProfileSwitcher({ dogs, activeDogId }: DogProfileSwitcherProps) {
  if (dogs.length <= 1) return null;

  return (
    <div className="mb-6">
      <p className="mb-3 text-[13px] font-semibold text-muted">
        Switch profile
      </p>
      <div className="flex flex-wrap gap-2">
        {dogs.map((dog) => {
          const img = getDogDisplayImage(dog.imageUrl, dog.breed);
          const isActive = dog.id === activeDogId;
          return (
            <Link
              key={dog.id}
              href={`/dashboard?dog=${dog.id}`}
              className={cn(
                "flex items-center gap-2 rounded-full border-2 px-4 py-2 transition-all",
                isActive
                  ? "border-primary bg-primary-50 shadow-[0_2px_8px_rgba(184,107,82,0.15)]"
                  : "border-border bg-surface hover:border-primary/50 hover:bg-primary-50/50"
              )}
            >
              <img
                src={img}
                alt={dog.name}
                className="h-8 w-8 rounded-full object-cover"
              />
              <span
                className={cn(
                  "text-sm font-semibold",
                  isActive ? "text-primary" : "text-text"
                )}
              >
                {dog.name}
              </span>
            </Link>
          );
        })}
        <Link
          href="/dogs"
          className="flex items-center gap-2 rounded-full border-2 border-dashed border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-primary hover:bg-primary-50/50 hover:text-primary"
        >
          <Users className="h-4 w-4" />
          View all
        </Link>
      </div>
    </div>
  );
}
