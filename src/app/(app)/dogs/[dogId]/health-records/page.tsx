import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DogProfileHeader } from "@/components/dogs/dog-profile-header";
import { VaccinationSection } from "@/components/vaccinations/vaccination-section";

interface Props {
  params: Promise<{ dogId: string }>;
}

export default async function DogHealthRecordsPage({ params }: Props) {
  const { dogId } = await params;
  const session = await auth();

  const dog = await prisma.dog.findUnique({
    where: { id: dogId },
    include: {
      vaccinations: {
        orderBy: { dateAdministered: "desc" },
        include: { proofDocument: true },
      },
    },
  });

  if (!dog || dog.userId !== session?.user?.id) notFound();

  return (
    <div className="space-y-8">
      <DogProfileHeader dog={dog} />
      <VaccinationSection dogId={dog.id} vaccinations={dog.vaccinations} />
    </div>
  );
}
