import Link from "next/link";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDogAge, formatRelativeDate } from "@/lib/utils";
import { getDogDisplayImage } from "@/lib/dog-images";
import type { Dog, CareEvent } from "@/generated/prisma/client";

interface DogCardProps {
  dog: Dog & { careEvents: CareEvent[] };
}

export function DogCard({ dog }: DogCardProps) {
  const dogImage = getDogDisplayImage(dog.imageUrl, dog.breed);
  const nextEvent = dog.careEvents
    .filter((e) => !e.completedAt)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )[0];

  const isOverdue = nextEvent && new Date(nextEvent.dueDate) < new Date();

  return (
    <Link href={`/dogs/${dog.id}`}>
      <Card hover className="group">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
            <img
              src={dogImage}
              alt={dog.name}
              className="h-14 w-14 rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-text">
              {dog.name}
            </h3>
            <p className="text-sm text-muted">
              {dog.breed} &bull; {formatDogAge(new Date(dog.dateOfBirth))}
            </p>
          </div>
        </div>

        {nextEvent && (
          <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
            <Calendar className="h-4 w-4 text-muted" />
            <span className="text-sm text-muted">{nextEvent.title}</span>
            <Badge variant={isOverdue ? "danger" : "info"}>
              {formatRelativeDate(new Date(nextEvent.dueDate))}
            </Badge>
          </div>
        )}
      </Card>
    </Link>
  );
}
