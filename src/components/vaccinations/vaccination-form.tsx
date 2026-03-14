"use client";

import { useState, useEffect } from "react";
import { FileText, Upload } from "lucide-react";
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
  const [proofFile, setProofFile] = useState<File | null>(null);

  useEffect(() => {
    setSelectedRecord("");
    setCustomName("");
  }, [activeCategory]);

  const isOtherSelected = OTHER_OPTIONS.includes(selectedRecord);

  const ALLOWED_PROOF_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const MAX_PROOF_SIZE = 10 * 1024 * 1024; // 10MB

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

    let proof: { s3Key: string; name: string; fileSize: number; mimeType: string } | undefined;
    if (proofFile) {
      if (!ALLOWED_PROOF_TYPES.includes(proofFile.type)) {
        setError("Proof must be PDF, JPG, PNG, or WebP.");
        setLoading(false);
        return;
      }
      if (proofFile.size > MAX_PROOF_SIZE) {
        setError("Proof file must be under 10MB.");
        setLoading(false);
        return;
      }
      try {
        const urlRes = await fetch("/api/documents/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: proofFile.name,
            fileType: proofFile.type,
            dogId,
          }),
        });
        if (!urlRes.ok) {
          const d = await urlRes.json();
          setError(d.error || "Failed to upload proof.");
          setLoading(false);
          return;
        }
        const { uploadUrl, s3Key } = await urlRes.json();
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          body: proofFile,
          headers: { "Content-Type": proofFile.type },
        });
        if (!uploadRes.ok) {
          setError("Proof upload failed. Please try again.");
          setLoading(false);
          return;
        }
        proof = { s3Key, name: proofFile.name, fileSize: proofFile.size, mimeType: proofFile.type };
      } catch {
        setError("Something went wrong uploading proof.");
        setLoading(false);
        return;
      }
    }

    const result = await createVaccination(dogId, {
      name: recordName,
      dateAdministered: formData.get("dateAdministered") as string,
      expirationDate: (formData.get("expirationDate") as string) || undefined,
      boosterDueDate: (formData.get("boosterDueDate") as string) || undefined,
      veterinarian: (formData.get("veterinarian") as string) || undefined,
      lotNumber: (formData.get("lotNumber") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
      proof,
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
        <div>
          <label className="mb-1.5 block font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-[0.5px] text-muted">
            Add Proof (Optional)
          </label>
          <p className="mb-2 text-sm text-muted">
            Upload a photo or scan of the certificate. PDF, JPG, PNG, or WebP up to 10MB.
            You can always add proof later in the Documents section.
          </p>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-primary-50/30 px-4 py-3 transition-colors hover:border-primary hover:bg-primary-50/50">
              <Upload className="h-5 w-5 text-primary" />
              <span className="text-[15px] font-bold text-text">
                {proofFile ? "Change file" : "Choose file"}
              </span>
              <input
                name="proof"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                className="sr-only"
              />
            </label>
            {proofFile && (
              <span className="flex items-center gap-1.5 text-sm text-muted">
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate max-w-[180px]">{proofFile.name}</span>
              </span>
            )}
          </div>
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
