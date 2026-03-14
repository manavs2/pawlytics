import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DogProfileHeader } from "@/components/dogs/dog-profile-header";
import { PassportSection } from "@/components/passport/passport-section";

interface Props {
  params: Promise<{ dogId: string }>;
}

export default async function DogPassportPage({ params }: Props) {
  const { dogId } = await params;
  const session = await auth();

  const dog = await prisma.dog.findUnique({
    where: { id: dogId },
    include: {
      passportLinks: { where: { isActive: true } },
    },
  });

  if (!dog || dog.userId !== session?.user?.id) notFound();

  return (
    <div className="space-y-8">
      <DogProfileHeader dog={dog} />
      <PassportSection
        dogId={dog.id}
        dogName={dog.name}
        passportLinks={dog.passportLinks}
      />
    </div>
  );
}
