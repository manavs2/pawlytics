import { PageHeader } from "@/components/layout/page-header";
import { DogForm } from "@/components/dogs/dog-form";
import { createDog } from "@/actions/dogs";

export default function NewDogPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Add a New Dog"
        description="Create a health profile for your dog"
      />
      <DogForm action={createDog} submitLabel="Create dog profile" />
    </div>
  );
}
