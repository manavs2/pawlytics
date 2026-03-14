import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DogProfileHeader } from "@/components/dogs/dog-profile-header";
import { DocumentSection } from "@/components/documents/document-section";

interface Props {
  params: Promise<{ dogId: string }>;
}

export default async function DogDocumentsPage({ params }: Props) {
  const { dogId } = await params;
  const session = await auth();

  const dog = await prisma.dog.findUnique({
    where: { id: dogId },
    include: {
      documents: { orderBy: { uploadedAt: "desc" } },
      vaccinations: {
        orderBy: { dateAdministered: "desc" },
        where: { proofDocumentId: null },
      },
    },
  });

  if (!dog || dog.userId !== session?.user?.id) notFound();

  return (
    <div className="space-y-8">
      <DogProfileHeader dog={dog} />
      <DocumentSection
        dogId={dog.id}
        documents={dog.documents}
        vaccinationsWithoutProof={dog.vaccinations}
      />
    </div>
  );
}
