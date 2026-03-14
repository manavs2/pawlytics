import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { DogForm } from "@/components/dogs/dog-form";
import { updateDog } from "@/actions/dogs";

interface EditDogPageProps {
  params: Promise<{ dogId: string }>;
}

export default async function EditDogPage({ params }: EditDogPageProps) {
  const { dogId } = await params;
  const session = await auth();

  const dog = await prisma.dog.findUnique({
    where: { id: dogId },
  });

  if (!dog || dog.userId !== session?.user?.id) {
    notFound();
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    return updateDog(dogId, formData);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title={`Edit ${dog.name}`}
        description="Update your dog's profile information"
      />
      <DogForm dog={dog} action={handleUpdate} submitLabel="Save changes" />
    </div>
  );
}
