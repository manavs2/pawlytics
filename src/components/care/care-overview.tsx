"use client";

import { CareEventCard } from "./care-event-card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import type { CareEvent } from "@/generated/prisma/client";

interface CareOverviewProps {
  dogId: string;
  careEvents: CareEvent[];
}

export function CareOverview({ dogId, careEvents }: CareOverviewProps) {
  const now = new Date();

  const overdue = careEvents.filter(
    (e) => !e.completedAt && new Date(e.dueDate) < now
  );
  const upcoming = careEvents.filter(
    (e) => !e.completedAt && new Date(e.dueDate) >= now
  );
  const completed = careEvents
    .filter((e) => e.completedAt)
    .sort(
      (a, b) =>
        new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
    );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Overdue"
          value={overdue.length}
          variant="danger"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Upcoming"
          value={upcoming.length}
          variant="info"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Completed"
          value={completed.length}
          variant="success"
        />
      </div>

      {overdue.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-bold text-text">
            <Badge variant="danger">Overdue</Badge>
          </h3>
          <div className="space-y-3">
            {overdue.map((event) => (
              <CareEventCard key={event.id} event={event} status="overdue" />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-bold text-text">
            <Badge variant="info">Upcoming</Badge>
          </h3>
          <div className="space-y-3">
            {upcoming.map((event) => (
              <CareEventCard key={event.id} event={event} status="upcoming" />
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-bold text-text">
            <Badge variant="success">Completed</Badge>
          </h3>
          <div className="space-y-3">
            {completed.slice(0, 10).map((event) => (
              <CareEventCard key={event.id} event={event} status="completed" />
            ))}
          </div>
        </section>
      )}

      {careEvents.length === 0 && (
        <div className="py-16 text-center text-sm text-muted">
          No care events yet. They&apos;ll appear here once your dog&apos;s care
          plan is generated.
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  variant: "danger" | "info" | "success";
}) {
  const styles = {
    danger: "bg-danger-50 text-danger-600",
    info: "bg-primary-50 text-primary",
    success: "bg-accent-50 text-accent",
  };

  return (
    <div className={`flex items-center gap-4 rounded-[20px] ${styles[variant]} p-5`}>
      {icon}
      <div>
        <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-text">
          {value}
        </p>
        <p className="text-sm font-semibold">{label}</p>
      </div>
    </div>
  );
}
