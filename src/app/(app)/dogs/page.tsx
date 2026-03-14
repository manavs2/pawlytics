import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { DogCard } from "@/components/dogs/dog-card";
import { PawPrint, Plus } from "lucide-react";

export default async function MyDogsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const dogs = await prisma.dog.findMany({
    where: { userId: session.user.id },
    include: {
      careEvents: {
        where: { completedAt: null },
        orderBy: { dueDate: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[32px] font-bold text-text">
            My Dogs
          </h1>
          <p className="mt-1 text-base text-muted">
            {dogs.length === 0
              ? "Add your first dog to get started."
              : `${dogs.length} dog${dogs.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link href="/dogs/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add dog
          </Button>
        </Link>
      </div>

      {dogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface py-16">
          <div className="mb-4 rounded-full bg-primary-50 p-5">
            <PawPrint className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold text-text">
            No dogs yet
          </h2>
          <p className="mb-6 max-w-sm text-center text-muted">
            Add your first dog to track health records, vaccinations, and care plans.
          </p>
          <Link href="/dogs/new">
            <Button>
              <Plus className="h-4 w-4" />
              Add Your First Dog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  );
}
