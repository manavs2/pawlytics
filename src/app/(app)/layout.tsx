import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const dogs = await prisma.dog.findMany({
    where: { userId: session.user.id! },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });
  const firstDog = dogs[0];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar
        userName={session.user.name || session.user.email}
        activeDogId={firstDog?.id ?? null}
        dogs={dogs}
      />
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}
