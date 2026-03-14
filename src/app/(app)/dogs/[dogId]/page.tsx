import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DogProfileHeader } from "@/components/dogs/dog-profile-header";
import { CareOverview } from "@/components/care/care-overview";

interface DogDetailPageProps {
  params: Promise<{ dogId: string }>;
}

export default async function DogDetailPage({ params }: DogDetailPageProps) {
  const { dogId } = await params;
  const session = await auth();

  const dog = await prisma.dog.findUnique({
    where: { id: dogId },
    include: {
      careEvents: { orderBy: { dueDate: "asc" } },
    },
  });

  if (!dog || dog.userId !== session?.user?.id) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <DogProfileHeader dog={dog} />
      <CareOverview dogId={dog.id} careEvents={dog.careEvents} />
    </div>
  );
}
