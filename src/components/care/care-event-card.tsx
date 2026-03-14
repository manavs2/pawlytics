"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Stethoscope,
  Scissors,
  Heart,
  Eye,
  Wind,
  Activity,
  Sparkles,
  Scale,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import { completeCareEvent } from "@/actions/care-events";
import type { CareEvent } from "@/generated/prisma/client";
import type { CareEventStatus } from "@/types";

const typeIcons: Record<string, React.ReactNode> = {
  vet_visit: <Stethoscope className="h-5 w-5" />,
  dental_check: <Sparkles className="h-5 w-5" />,
  ear_check: <Eye className="h-5 w-5" />,
  grooming: <Scissors className="h-5 w-5" />,
  nail_trim: <Scissors className="h-5 w-5" />,
  heartworm_prevention: <Heart className="h-5 w-5" />,
  flea_tick_prevention: <Activity className="h-5 w-5" />,
  weigh_in: <Scale className="h-5 w-5" />,
  respiratory_check: <Wind className="h-5 w-5" />,
  joint_screening: <Activity className="h-5 w-5" />,
  deshedding: <Sparkles className="h-5 w-5" />,
};

interface CareEventCardProps {
  event: CareEvent;
  status: CareEventStatus;
}

export function CareEventCard({ event, status }: CareEventCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const icon = typeIcons[event.type] || <Clock className="h-5 w-5" />;
  const statusConfig = {
    overdue: {
      badge: <Badge variant="danger">Overdue</Badge>,
      iconColor: "text-danger-600 bg-danger-50",
    },
    upcoming: {
      badge: <Badge variant="info">{formatRelativeDate(new Date(event.dueDate))}</Badge>,
      iconColor: "text-primary bg-primary-50",
    },
    completed: {
      badge: <Badge variant="success">Completed</Badge>,
      iconColor: "text-accent bg-accent-50",
    },
  };

  async function handleComplete() {
    setLoading(true);
    await completeCareEvent(event.id);
    router.refresh();
    setLoading(false);
  }

  return (
    <Card padding="sm" className="flex items-center gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${statusConfig[status].iconColor}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-text">{event.title}</p>
          {statusConfig[status].badge}
        </div>
        {event.description && (
          <p className="mt-0.5 truncate text-sm text-muted">
            {event.description}
          </p>
        )}
        <p className="mt-0.5 text-xs text-muted">
          {status === "completed" && event.completedAt
            ? `Completed ${formatDate(new Date(event.completedAt))}`
            : `Due ${formatDate(new Date(event.dueDate))}`}
        </p>
      </div>
      {status !== "completed" && (
        <Button
          variant="outline"
          size="sm"
          loading={loading}
          onClick={handleComplete}
        >
          <CheckCircle2 className="h-4 w-4" />
          Done
        </Button>
      )}
    </Card>
  );
}
