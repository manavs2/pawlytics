import { Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDogAge, formatDate } from "@/lib/utils";
import { getDogDisplayImage } from "@/lib/dog-images";
import type { Dog } from "@/generated/prisma/client";

interface DogProfileHeaderProps {
  dog: Dog;
}

export function DogProfileHeader({ dog }: DogProfileHeaderProps) {
  const dogImage = getDogDisplayImage(dog.imageUrl, dog.breed);
  return (
    <div>
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 shadow-[0_4px_20px_rgba(184,107,82,0.15)]">
            <img
              src={dogImage}
              alt={dog.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-bold text-text">
              {dog.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span>{dog.breed}</span>
              <span>&bull;</span>
              <span>{formatDogAge(new Date(dog.dateOfBirth))}</span>
              <span>&bull;</span>
              <Badge>{dog.sex === "male" ? "Male" : "Female"}</Badge>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-muted">
              {dog.weight && <span>{dog.weight} lbs</span>}
              {dog.color && <span>{dog.color}</span>}
              {dog.microchipId && <span>Chip: {dog.microchipId}</span>}
              <span>Born {formatDate(new Date(dog.dateOfBirth))}</span>
            </div>
          </div>
        </div>

        <Link href={`/dogs/${dog.id}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
