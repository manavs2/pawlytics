"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BREED_NAMES } from "@/lib/breeds";
import {
  DOG_IMAGE_ALLOWED_TYPES,
  DOG_IMAGE_MAX_BYTES,
  getDogDisplayImage,
  isGeneratedBreedFallback,
} from "@/lib/dog-images";
import type { Dog } from "@/generated/prisma/client";

interface DogFormProps {
  dog?: Dog;
  action: (formData: FormData) => Promise<{ error?: string }>;
  submitLabel: string;
}

export function DogForm({ dog, action, submitLabel }: DogFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [breed, setBreed] = useState(dog?.breed || "");
  const [objectPreviewUrl, setObjectPreviewUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState(
    getDogDisplayImage(dog?.imageUrl, dog?.breed || "")
  );

  useEffect(() => {
    if (!objectPreviewUrl) {
      if (!dog?.imageUrl || isGeneratedBreedFallback(dog.imageUrl)) {
        setPreviewUrl(getDogDisplayImage(null, breed));
      } else {
        setPreviewUrl(dog.imageUrl);
      }
    }
  }, [breed, dog?.imageUrl, objectPreviewUrl]);

  useEffect(() => {
    return () => {
      if (objectPreviewUrl) {
        URL.revokeObjectURL(objectPreviewUrl);
      }
    };
  }, [objectPreviewUrl]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  const breedOptions = BREED_NAMES.map((b) => ({ value: b, label: b }));
  const acceptedFileTypes = DOG_IMAGE_ALLOWED_TYPES.join(",");

  return (
    <Card padding="lg" className="rounded-[32px]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-[28px] bg-primary-50/40 p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <img
              src={previewUrl}
              alt={breed ? `${breed} preview` : "Dog profile preview"}
              className="h-28 w-28 rounded-full object-cover shadow-[0_8px_24px_rgba(58,46,42,0.08)]"
            />
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-text">
                  Profile Photo
                </h3>
                <p className="text-sm text-muted">
                  Upload your dog&apos;s photo, or we&apos;ll use a breed-based fallback.
                </p>
              </div>
              <Input
                label="Dog Photo"
                name="image"
                type="file"
                accept={acceptedFileTypes}
                helperText={`Optional. JPG, PNG, or WebP up to ${DOG_IMAGE_MAX_BYTES / (1024 * 1024)}MB.`}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    if (objectPreviewUrl) {
                      URL.revokeObjectURL(objectPreviewUrl);
                      setObjectPreviewUrl(null);
                    }
                    if (!dog?.imageUrl || isGeneratedBreedFallback(dog.imageUrl)) {
                      setPreviewUrl(getDogDisplayImage(null, breed));
                    } else {
                      setPreviewUrl(dog.imageUrl);
                    }
                    return;
                  }
                  if (objectPreviewUrl) {
                    URL.revokeObjectURL(objectPreviewUrl);
                  }
                  const nextPreviewUrl = URL.createObjectURL(file);
                  setObjectPreviewUrl(nextPreviewUrl);
                  setPreviewUrl(nextPreviewUrl);
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Name"
            name="name"
            placeholder="e.g. Buddy"
            defaultValue={dog?.name}
            required
          />
          <Select
            label="Breed"
            name="breed"
            options={breedOptions}
            placeholder="Select a breed"
            defaultValue={dog?.breed}
            onChange={(e) => setBreed(e.target.value)}
            required
          />
          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            defaultValue={
              dog?.dateOfBirth
                ? new Date(dog.dateOfBirth).toISOString().split("T")[0]
                : undefined
            }
            required
          />
          <Select
            label="Sex"
            name="sex"
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            placeholder="Select sex"
            defaultValue={dog?.sex}
            required
          />
          <Input
            label="Weight (lbs)"
            name="weight"
            type="number"
            step="0.1"
            placeholder="e.g. 65"
            defaultValue={dog?.weight?.toString()}
          />
          <Input
            label="Color"
            name="color"
            placeholder="e.g. Golden"
            defaultValue={dog?.color || ""}
          />
          <Input
            label="Microchip ID"
            name="microchipId"
            placeholder="e.g. 985112345678901"
            defaultValue={dog?.microchipId || ""}
            className="sm:col-span-2"
          />
        </div>

        {error && (
          <div className="rounded-2xl bg-danger-50 p-3 text-sm font-semibold text-danger-600">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
