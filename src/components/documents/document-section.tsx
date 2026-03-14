"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Search,
  FileText,
  Image,
  Trash2,
  Download,
  MoreVertical,
  Grid3X3,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { createDocumentRecord, deleteDocument } from "@/actions/documents";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@/types";
import type { Document } from "@/generated/prisma/client";

type DocFilter = "all" | DocumentType;

interface DocumentSectionProps {
  dogId: string;
  documents: Document[];
}

const FILTER_PILLS: { id: DocFilter; label: string }[] = [
  { id: "all", label: "All Records" },
  { id: "lab_report", label: "Lab Results" },
  { id: "prescription", label: "Prescriptions" },
  { id: "vaccine_certificate", label: "Certificates" },
  { id: "imaging", label: "Imaging" },
  { id: "other", label: "Other" },
];

const FILE_ICON_COLORS: Record<string, string> = {
  "application/pdf": "bg-danger-50 text-danger-600",
  "image/jpeg": "bg-primary-50 text-primary",
  "image/jpg": "bg-primary-50 text-primary",
  "image/png": "bg-accent-50 text-accent",
  "image/webp": "bg-accent-50 text-accent",
};

export function DocumentSection({ dogId, documents }: DocumentSectionProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DocFilter>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  const filtered = documents.filter((doc) => {
    const matchesFilter = filter === "all" || doc.type === filter;
    const matchesSearch =
      !search || doc.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    const docType = formData.get("docType") as string;

    if (!file || !docType) {
      setError("Please select a file and document type.");
      setUploading(false);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.");
      setUploading(false);
      return;
    }

    try {
      const urlRes = await fetch("/api/documents/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          dogId,
        }),
      });

      if (!urlRes.ok) {
        const data = await urlRes.json();
        setError(data.error || "Failed to get upload URL.");
        setUploading(false);
        return;
      }

      const { uploadUrl, s3Key } = await urlRes.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) {
        setError("File upload failed. Please try again.");
        setUploading(false);
        return;
      }

      await createDocumentRecord(dogId, {
        name: file.name,
        type: docType,
        s3Key,
        fileSize: file.size,
        mimeType: file.type,
      });

      setShowUpload(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setUploading(false);
  }

  async function handleDownload(docId: string) {
    const res = await fetch(`/api/documents/${docId}/download-url`);
    if (res.ok) {
      const { downloadUrl } = await res.json();
      window.open(downloadUrl, "_blank");
    }
  }

  async function handleDelete(docId: string) {
    if (!confirm("Delete this document?")) return;
    await deleteDocument(docId);
    router.refresh();
  }

  const typeOptions = Object.entries(DOCUMENT_TYPE_LABELS).map(
    ([value, label]) => ({ value, label })
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-[family-name:var(--font-heading)] text-[28px] font-bold text-text">
          Documents
        </h2>
        <p className="mt-1 text-base text-muted">
          Keep track of your pet&apos;s health records and certifications.
        </p>
      </div>

      {/* Upload Dropzone */}
      {!showUpload ? (
        <button
          onClick={() => setShowUpload(true)}
          className="flex w-full flex-col items-center gap-3 rounded-[20px] border-2 border-dashed border-border bg-primary-50/30 py-10 transition-colors hover:border-primary"
        >
          <div className="rounded-2xl bg-primary-100 p-3 text-primary">
            <Upload className="h-6 w-6" />
          </div>
          <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-text">
            Upload New Documents
          </p>
          <p className="text-sm text-muted">
            Drag and drop your medical reports, lab results, or vaccination cards here
          </p>
          <span className="mt-1 rounded-full bg-primary px-5 py-2 text-[13px] font-bold uppercase tracking-[1px] text-white">
            Browse Files
          </span>
        </button>
      ) : (
        <Card className="border-2 border-primary/10 bg-primary-50/30">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Document Type"
                name="docType"
                options={typeOptions}
                placeholder="Select type"
                required
              />
              <Input
                label="File"
                name="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-danger-50 p-3 text-sm font-semibold text-danger-600">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowUpload(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={uploading}>
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search files, dates, or document types..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-border bg-surface py-3.5 pl-12 pr-4 text-base text-text placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Filter Pills + View Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilter(pill.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-bold uppercase tracking-[0.5px] transition-colors ${
                filter === pill.id
                  ? "bg-primary text-white"
                  : "bg-surface text-muted shadow-[0_2px_8px_rgba(58,46,42,0.06)] hover:text-text"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-xl p-2 ${viewMode === "grid" ? "bg-gray-100 text-text" : "text-muted"}`}
          >
            <Grid3X3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-xl p-2 ${viewMode === "list" ? "bg-gray-100 text-text" : "text-muted"}`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Document Count */}
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-text">
        Recent Documents
      </h3>

      {/* Documents Grid/List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-[20px] border-2 border-dashed border-border py-16">
          <FileText className="mb-3 h-10 w-10 text-gray-300" />
          <p className="mb-1 font-[family-name:var(--font-heading)] text-lg font-bold text-text">
            No documents found
          </p>
          <p className="text-sm text-muted">
            Upload medical records to keep everything organized.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => {
            const iconColor = FILE_ICON_COLORS[doc.mimeType || ""] || "bg-gray-100 text-muted";
            return (
              <Card key={doc.id} hover padding="sm" className="group relative">
                <div className="flex items-start gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
                    {doc.mimeType?.startsWith("image/") ? (
                      <Image className="h-5 w-5" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-text">
                      {doc.name}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {formatDate(new Date(doc.uploadedAt))}
                      {doc.fileSize && (
                        <> &bull; {doc.fileSize > 1024 * 1024 ? `${(doc.fileSize / (1024 * 1024)).toFixed(1)} MB` : `${(doc.fileSize / 1024).toFixed(0)} KB`}</>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleDownload(doc.id)}
                      className="rounded-lg p-1.5 text-muted hover:bg-gray-100 hover:text-text"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="rounded-lg p-1.5 text-muted hover:bg-danger-50 hover:text-danger-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((doc) => {
            const iconColor = FILE_ICON_COLORS[doc.mimeType || ""] || "bg-gray-100 text-muted";
            return (
              <Card key={doc.id} hover padding="sm" className="group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
                      {doc.mimeType?.startsWith("image/") ? (
                        <Image className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-text">{doc.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Badge>
                          {DOCUMENT_TYPE_LABELS[doc.type as DocumentType] || doc.type}
                        </Badge>
                        <span>{formatDate(new Date(doc.uploadedAt))}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleDownload(doc.id)}
                      className="rounded-lg p-2 text-muted hover:bg-gray-100 hover:text-text"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="rounded-lg p-2 text-muted hover:bg-danger-50 hover:text-danger-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
