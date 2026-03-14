import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ dogId: string }>;
}

export default async function VaccinationsRedirect({ params }: Props) {
  const { dogId } = await params;
  redirect(`/dogs/${dogId}/health-records`);
}
