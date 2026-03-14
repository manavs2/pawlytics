import Link from "next/link";
import { Plus, PawPrint, CalendarCheck, Syringe, Weight, Pill, Pencil } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDogAge, formatRelativeDate } from "@/lib/utils";
import { getDogDisplayImage } from "@/lib/dog-images";

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name?.split(" ")[0] || "there";

  const dogs = await prisma.dog.findMany({
    where: { userId: session!.user!.id },
    include: {
      careEvents: {
        where: { completedAt: null },
        orderBy: { dueDate: "asc" },
        take: 4,
      },
      vaccinations: {
        orderBy: { dateAdministered: "desc" },
        take: 3,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const activeDog = dogs[0];
  const activeDogImage = activeDog
    ? getDogDisplayImage(activeDog.imageUrl, activeDog.breed)
    : null;
  const upcomingEvents = activeDog?.careEvents.slice(0, 3) || [];
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const urgentEvent = activeDog?.careEvents.find((e) => {
    const diff = Math.floor((new Date(e.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff <= 14;
  });

  const vaxStatus = activeDog?.vaccinations.length
    ? activeDog.vaccinations.every((v) => !v.expirationDate || new Date(v.expirationDate) > now)
      ? "up_to_date"
      : "needs_attention"
    : "none";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (dogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="mb-4 rounded-full bg-primary-50 p-5">
          <PawPrint className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mb-2 font-[family-name:var(--font-heading)] text-2xl font-bold text-text">
          {greeting}, {userName}
        </h1>
        <p className="mb-8 text-base text-muted">
          Add your first dog to get started.
        </p>
        <Link href="/dogs/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Your First Dog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Greeting row */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-bold leading-tight text-text sm:text-[32px]">
            {greeting}, {userName}
          </h1>
          <p className="mt-0.5 text-[15px] text-muted">
            Here&apos;s {activeDog.name}&apos;s health overview for today.
          </p>
        </div>
        <Link href="/dogs/new">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
            Add dog
          </Button>
        </Link>
      </div>

      {/* 2-column layout: left stacked, right upcoming */}
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">

        {/* Left — Action Required → Dog Profile → Health Status */}
        <div className="space-y-5">

          {/* Action Required */}
          {urgentEvent ? (
            <div className="rounded-[20px] bg-primary px-6 py-5 text-white shadow-[0_20px_40px_rgba(184,107,82,0.2)]">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-white/20 p-2">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[1px] text-white/70">
                    Action Required
                  </p>
                  <p className="mt-0.5 font-[family-name:var(--font-heading)] text-[20px] font-bold leading-tight">
                    {urgentEvent.title}
                  </p>
                  <p className="mt-0.5 text-[14px] text-white/70">
                    {formatRelativeDate(new Date(urgentEvent.dueDate))}
                  </p>
                </div>
              </div>
              <Link href={`/dogs/${activeDog.id}`}>
                <button className="mt-4 rounded-full bg-white px-5 py-2 text-[13px] font-bold uppercase tracking-[1px] text-primary hover:bg-primary-50">
                  Log Visit
                </button>
              </Link>
            </div>
          ) : (
            <Card className="bg-accent-50">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-accent p-2 text-white">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-heading)] text-[17px] font-bold text-text">
                    All caught up!
                  </p>
                  <p className="text-[14px] text-muted">No urgent care events right now.</p>
                </div>
              </div>
            </Card>
          )}

          {/* Dog Profile */}
          <Card className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-[110px] w-[110px] items-center justify-center rounded-full bg-primary-50 shadow-[0_4px_20px_rgba(184,107,82,0.12)]">
              <img
                src={activeDogImage || ""}
                alt={activeDog.name}
                className="h-[110px] w-[110px] rounded-full object-cover"
              />
            </div>
            <h2 className="font-[family-name:var(--font-heading)] text-[22px] font-bold text-text">
              {activeDog.name}
            </h2>
            <p className="mt-0.5 text-[15px] text-muted">
              {activeDog.breed} &bull; {formatDogAge(new Date(activeDog.dateOfBirth))}
            </p>

            <div className="mt-4 grid w-full grid-cols-2 gap-2">
              <div className="rounded-2xl bg-gray-50 px-3 py-2.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-muted">Weight</p>
                <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-text">
                  {activeDog.weight ? `${activeDog.weight} lbs` : "—"}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 px-3 py-2.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-muted">Sex</p>
                <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-text">
                  {activeDog.sex === "male" ? "Male" : "Female"}
                </p>
              </div>
            </div>

            <Link href={`/dogs/${activeDog.id}/edit`} className="mt-3 w-full">
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-border py-2.5 text-[14px] font-bold text-text transition-colors hover:border-primary hover:text-primary">
                <Pencil className="h-3.5 w-3.5" />
                Edit Profile
              </button>
            </Link>
          </Card>

          {/* Health Status */}
          <Card>
            <h3 className="mb-4 font-[family-name:var(--font-heading)] text-[17px] font-bold text-text">
              Health Status
            </h3>
            <div className="flex items-center justify-around">
              <HealthIcon
                icon={<Syringe className="h-5 w-5" />}
                label="Vaccines"
                status={vaxStatus === "up_to_date" ? "Up to date" : vaxStatus === "needs_attention" ? "1 Due Soon" : "No data"}
                variant={vaxStatus === "up_to_date" ? "success" : vaxStatus === "needs_attention" ? "danger" : "default"}
              />
              <HealthIcon
                icon={<Pill className="h-5 w-5" />}
                label="Meds"
                status="On track"
                variant="success"
              />
              <HealthIcon
                icon={<Weight className="h-5 w-5" />}
                label="Weight"
                status="Stable"
                variant="success"
              />
            </div>
          </Card>
        </div>

        {/* Right — Upcoming */}
        <Card className="lg:sticky lg:top-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-[family-name:var(--font-heading)] text-[17px] font-bold text-text">
              Upcoming
            </h3>
            <Link
              href={`/dogs/${activeDog.id}`}
              className="text-[13px] font-bold uppercase tracking-[1px] text-primary hover:text-primary-700"
            >
              View All
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">No upcoming events</p>
          ) : (
            <div className="space-y-2.5">
              {upcomingEvents.map((event) => {
                const dueDate = new Date(event.dueDate);
                const isOverdue = dueDate < now;
                return (
                  <div
                    key={event.id}
                    className={`flex items-center gap-3 rounded-2xl p-2.5 ${isOverdue ? "bg-danger-50" : "bg-gray-50"}`}
                  >
                    <div className={`flex flex-col items-center rounded-xl px-2.5 py-1.5 ${isOverdue ? "bg-danger-600 text-white" : "bg-surface text-primary"}`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {monthNames[dueDate.getMonth()]}
                      </span>
                      <span className="font-[family-name:var(--font-heading)] text-[18px] font-bold leading-tight">
                        {dueDate.getDate().toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-text">{event.title}</p>
                      <p className="truncate text-[13px] text-muted">
                        {event.description || formatRelativeDate(dueDate)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Link href={`/dogs/${activeDog.id}`}>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-2.5 text-[13px] font-bold uppercase tracking-[1px] text-muted transition-colors hover:border-primary hover:text-primary">
              <CalendarCheck className="h-4 w-4" />
              Add Event
            </button>
          </Link>
        </Card>
      </div>
    </>
  );
}

function HealthIcon({
  icon,
  label,
  status,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  status: string;
  variant: "success" | "danger" | "default";
}) {
  const ring = {
    success: "border-accent text-accent",
    danger: "border-danger text-danger",
    default: "border-gray-300 text-muted",
  };
  const statusColor = {
    success: "text-accent",
    danger: "text-danger-600",
    default: "text-muted",
  };
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${ring[variant]}`}>
        {icon}
      </div>
      <p className="text-[13px] font-semibold text-text">{label}</p>
      <p className={`text-[11px] font-bold ${statusColor[variant]}`}>{status}</p>
    </div>
  );
}
