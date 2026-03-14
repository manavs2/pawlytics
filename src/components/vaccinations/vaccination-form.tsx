"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createVaccination } from "@/actions/vaccinations";
import {
  COMMON_VACCINATIONS,
  COMMON_FLEA_TICK,
  COMMON_HEARTWORM,
} from "@/types";

const OTHER_OPTIONS = ["Other Vaccine", "Other Flea & Tick", "Other Heartworm"];

type HealthRecordCategory = "all" | "vaccines" | "flea_tick" | "heartworm";

interface VaccinationFormProps {
  dogId: string;
  activeCategory: HealthRecordCategory;
  onClose: () => void;
}

export function VaccinationForm({
  dogId,
  activeCategory,
  onClose,
}: VaccinationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState("");
  const [customName, setCustomName] = useState("");

  const isOtherSelected = OTHER_OPTIONS.includes(selectedRecord);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const recordName = isOtherSelected
      ? customName.trim()
      : (formData.get("recordType") as string) || selectedRecord;

    if (!recordName) {
      setError("Please enter the record name.");
      setLoading(false);
      return;
    }

    const result = await createVaccination(dogId, {
      name: recordName,
      dateAdministered: formData.get("dateAdministered") as string,
      expirationDate: (formData.get("expirationDate") as string) || undefined,
      boosterDueDate: (formData.get("boosterDueDate") as string) || undefined,
      veterinarian: (formData.get("veterinarian") as string) || undefined,
      lotNumber: (formData.get("lotNumber") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      onClose();
    }
  }

  const options =
    activeCategory === "flea_tick"
      ? COMMON_FLEA_TICK
      : activeCategory === "heartworm"
        ? COMMON_HEARTWORM
        : activeCategory === "vaccines"
          ? COMMON_VACCINATIONS
          : [
              ...COMMON_VACCINATIONS.filter((v) => v !== "Other Vaccine"),
              ...COMMON_FLEA_TICK.filter((v) => v !== "Other Flea & Tick"),
              ...COMMON_HEARTWORM.filter((v) => v !== "Other Heartworm"),
              "Other Vaccine",
              "Other Flea & Tick",
              "Other Heartworm",
            ];
  const selectOptions = options.map((v) => ({ value: v, label: v }));
  const selectLabel =
    activeCategory === "flea_tick"
      ? "Flea & Tick Preventative"
      : activeCategory === "heartworm"
        ? "Heartworm Preventative"
        : activeCategory === "vaccines"
          ? "Vaccine"
          : "Record Type";
  const placeholder =
    activeCategory === "flea_tick"
      ? "Select flea & tick"
      : activeCategory === "heartworm"
        ? "Select heartworm"
        : activeCategory === "vaccines"
          ? "Select vaccine"
          : "Select record type";
  const otherInputLabel =
    activeCategory === "flea_tick"
      ? "Specify flea & tick preventative"
      : activeCategory === "heartworm"
        ? "Specify heartworm preventative"
        : activeCategory === "vaccines"
          ? "Specify vaccine"
          : "Specify vaccine or record";
  const otherPlaceholder =
    activeCategory === "all"
      ? "e.g. Custom record name"
      : activeCategory === "flea_tick"
        ? "e.g. Custom flea & tick"
        : activeCategory === "heartworm"
          ? "e.g. Custom heartworm"
          : "e.g. Custom vaccine name";

  return (
    <Card className="border-2 border-primary/10 bg-primary-50/30">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Select
              label={selectLabel}
              name="recordType"
              options={selectOptions}
              placeholder={placeholder}
              value={selectedRecord}
              onChange={(e) => setSelectedRecord(e.target.value)}
              required={!isOtherSelected}
            />
            {isOtherSelected && (
              <div className="mt-3">
                <Input
                  label={otherInputLabel}
                  name="customName"
                  placeholder={otherPlaceholder}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required={isOtherSelected}
                />
              </div>
            )}
          </div>
          <Input
            label="Date Administered"
            name="dateAdministered"
            type="date"
            required
          />
          <Input label="Expiration Date" name="expirationDate" type="date" />
          <Input label="Booster Due Date" name="boosterDueDate" type="date" />
          <Input
            label="Veterinarian"
            name="veterinarian"
            placeholder="Dr. Smith"
          />
          <Input
            label="Lot Number"
            name="lotNumber"
            placeholder="Optional"
          />
        </div>
        <Textarea label="Notes" name="notes" placeholder="Any additional notes..." />

        {error && (
          <div className="rounded-2xl bg-danger-50 p-3 text-sm font-semibold text-danger-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Record
          </Button>
        </div>
      </form>
    </Card>
  );
}
