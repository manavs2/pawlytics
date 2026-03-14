"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Syringe, Bug, Heart, FileText, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VaccinationForm } from "./vaccination-form";
import { formatDate } from "@/lib/utils";
import { deleteVaccination } from "@/actions/vaccinations";
import type { Vaccination } from "@/generated/prisma/client";

type Category = "all" | "vaccines" | "flea_tick" | "heartworm";

interface VaccinationSectionProps {
  dogId: string;
  vaccinations: Vaccination[];
}

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All Records", icon: <FileText className="h-4 w-4" /> },
  { id: "vaccines", label: "Vaccines", icon: <Syringe className="h-4 w-4" /> },
  { id: "flea_tick", label: "Flea & Tick", icon: <Bug className="h-4 w-4" /> },
  { id: "heartworm", label: "Heartworm", icon: <Heart className="h-4 w-4" /> },
];

export function VaccinationSection({
  dogId,
  vaccinations,
}: VaccinationSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const router = useRouter();

  function getStatus(vax: Vaccination) {
    if (!vax.expirationDate) return "valid";
    const now = new Date();
    const exp = new Date(vax.expirationDate);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (exp < now) return "overdue";
    if (exp < thirtyDaysFromNow) return "expiring_soon";
    return "valid";
  }

  function filterByCategory(vax: Vaccination) {
    if (activeCategory === "all") return true;
    const name = vax.name.toLowerCase();
    if (activeCategory === "vaccines") {
      return !name.includes("heartworm") && !name.includes("flea") && !name.includes("tick");
    }
    if (activeCategory === "flea_tick") return name.includes("flea") || name.includes("tick");
    if (activeCategory === "heartworm") return name.includes("heartworm");
    return true;
  }

  const filtered = vaccinations.filter(filterByCategory);

  const statusBadge = {
    valid: <Badge variant="success">Valid</Badge>,
    expiring_soon: <Badge variant="warning">Expiring Soon</Badge>,
    overdue: <Badge variant="danger">Overdue</Badge>,
  };

  async function handleDelete(id: string) {
    if (!confirm("Delete this vaccination record?")) return;
    await deleteVaccination(id);
    router.refresh();
  }

  return (
    <div className="flex gap-8">
      {/* Categories Sidebar */}
      <div className="hidden w-52 shrink-0 md:block">
        <h3 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-bold text-text">
          Categories
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-semibold transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary-50 text-primary"
                  : "text-muted hover:bg-gray-100 hover:text-text"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="min-w-0 flex-1 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-[28px] font-bold text-text">
              {CATEGORIES.find((c) => c.id === activeCategory)?.label || "Vaccines"}
            </h2>
            <p className="mt-1 text-base text-muted">
              Keep track of scheduled shots and boosters.
            </p>
          </div>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </div>

        {/* Mobile category pills */}
        <div className="flex gap-2 overflow-x-auto md:hidden">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold uppercase tracking-[0.5px] transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-muted"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {showForm && (
          <VaccinationForm
            dogId={dogId}
            activeCategory={activeCategory}
            onClose={() => {
              setShowForm(false);
              router.refresh();
            }}
          />
        )}

        {filtered.length === 0 && !showForm ? (
          <div className="flex flex-col items-center rounded-[20px] border-2 border-dashed border-border py-16">
            <Syringe className="mb-3 h-10 w-10 text-gray-300" />
            <p className="mb-1 font-[family-name:var(--font-heading)] text-lg font-bold text-text">
              No records yet
            </p>
            <p className="text-sm text-muted">
              Add your dog&apos;s vaccination history to keep track of boosters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((vax) => {
              const status = getStatus(vax);
              const isOverdue = status === "overdue";

              return (
                <Card
                  key={vax.id}
                  className={`relative overflow-hidden ${isOverdue ? "border-l-4 border-l-danger-600" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {isOverdue && (
                        <div className="absolute left-0 top-0 h-full w-1 rounded-l-[20px] bg-danger-600" />
                      )}
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-[family-name:var(--font-heading)] text-lg font-bold text-text">
                            {vax.name}
                          </h4>
                          {statusBadge[status]}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted">
                          <span className="flex items-center gap-1.5">
                            <span className="text-muted">Given:</span>{" "}
                            {formatDate(new Date(vax.dateAdministered))}
                          </span>
                          {vax.expirationDate && (
                            <span className="flex items-center gap-1.5">
                              {isOverdue ? (
                                <span className="font-semibold text-danger-600">
                                  Due since: {formatDate(new Date(vax.expirationDate))}
                                </span>
                              ) : (
                                <>
                                  <span className="text-muted">Valid until:</span>{" "}
                                  {formatDate(new Date(vax.expirationDate))}
                                </>
                              )}
                            </span>
                          )}
                        </div>
                        {vax.veterinarian && (
                          <p className="mt-1 text-sm text-muted">
                            by {vax.veterinarian}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOverdue ? (
                        <Button size="sm" variant="outline">
                          Log Dose
                        </Button>
                      ) : (
                        <button
                          className="flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-primary"
                          onClick={() => handleDelete(vax.id)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
