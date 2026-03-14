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

  const firstDog = await prisma.dog.findFirst({
    where: { userId: session.user.id! },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  return (
    <div className="min-h-screen bg-bg">
      <Navbar
        userName={session.user.name || session.user.email}
        activeDogId={firstDog?.id ?? null}
      />
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}
