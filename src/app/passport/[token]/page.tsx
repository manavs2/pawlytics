import { notFound } from "next/navigation";
import { PawPrint, Syringe, CalendarCheck, Shield, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDogAge } from "@/lib/utils";
import type { Metadata } from "next";

interface PassportPageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({
  params,
}: PassportPageProps): Promise<Metadata> {
  const { token } = await params;
  const link = await prisma.passportLink.findUnique({
    where: { token },
    include: { dog: true },
  });

  if (!link) return { title: "Passport Not Found" };

  return {
    title: `${link.dog.name}'s Health Passport — Pawlytics`,
    description: `Health passport for ${link.dog.name}, a ${link.dog.breed}.`,
  };
}

export default async function PassportPage({ params }: PassportPageProps) {
  const { token } = await params;

  const link = await prisma.passportLink.findUnique({
    where: { token },
    include: {
      dog: {
        include: {
          vaccinations: {
            orderBy: { dateAdministered: "desc" },
            include: { proofDocument: true },
          },
          careEvents: {
            where: { completedAt: { not: null } },
            orderBy: { completedAt: "desc" },
            take: 10,
          },
        },
      },
    },
  });

  if (!link || !link.isActive) notFound();
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) notFound();

  const dog = link.dog;

  function getVaxStatus(expirationDate: Date | null) {
    if (!expirationDate) return "current";
    const now = new Date();
    if (expirationDate < now) return "expired";
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (expirationDate < thirtyDays) return "expiring_soon";
    return "current";
  }

  const statusBadge = {
    current: <Badge variant="success">Valid</Badge>,
    expiring_soon: <Badge variant="warning">Expiring Soon</Badge>,
    expired: <Badge variant="danger">Expired</Badge>,
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-surface shadow-[0_2px_12px_rgba(58,46,42,0.04)]">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-primary" />
            <span className="font-[family-name:var(--font-heading)] text-sm font-bold text-text">
              Pawlytics
            </span>
          </div>
          <Badge variant="info">
            <Shield className="mr-1 h-3 w-3" />
            Verified Health Passport
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="space-y-6">
          <Card padding="lg" className="rounded-[32px]">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                <PawPrint className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-text">
                  {dog.name}
                </h1>
                <p className="text-muted">
                  {dog.breed} &bull; {formatDogAge(new Date(dog.dateOfBirth))} &bull;{" "}
                  {dog.sex === "male" ? "Male" : "Female"}
                </p>
                <div className="mt-1 flex gap-4 text-sm text-muted">
                  {dog.weight && <span>{dog.weight} lbs</span>}
                  {dog.color && <span>{dog.color}</span>}
                  {dog.microchipId && <span>Chip: {dog.microchipId}</span>}
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[32px]">
            <h2 className="mb-4 flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-bold text-text">
              <Syringe className="h-5 w-5 text-primary" />
              Vaccinations
            </h2>
            {dog.vaccinations.length === 0 ? (
              <p className="text-sm text-muted">No vaccination records available.</p>
            ) : (
              <div className="divide-y divide-border">
                {dog.vaccinations.map((vax) => (
                  <div key={vax.id} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-text">{vax.name}</p>
                        {vax.proofDocumentId && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-accent">
                            <ShieldCheck className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted">
                        {formatDate(new Date(vax.dateAdministered))}
                        {vax.veterinarian && ` · ${vax.veterinarian}`}
                      </p>
                    </div>
                    {statusBadge[getVaxStatus(vax.expirationDate)]}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {dog.careEvents.length > 0 && (
            <Card className="rounded-[32px]">
              <h2 className="mb-4 flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-bold text-text">
                <CalendarCheck className="h-5 w-5 text-primary" />
                Recent Care
              </h2>
              <div className="divide-y divide-border">
                {dog.careEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-semibold text-text">{event.title}</p>
                      {event.description && (
                        <p className="text-sm text-muted">{event.description}</p>
                      )}
                    </div>
                    <span className="text-sm text-muted">
                      {event.completedAt && formatDate(new Date(event.completedAt))}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <p className="text-center text-xs text-muted">
            This health passport was generated by Pawlytics. Information is
            provided by the dog owner and has not been independently verified.
          </p>
        </div>
      </main>
    </div>
  );
}
