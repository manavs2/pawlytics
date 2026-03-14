"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, Copy, Check, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { generatePassportLink, revokePassportLink } from "@/actions/passport";
import type { PassportLink } from "@/generated/prisma/client";

interface PassportSectionProps {
  dogId: string;
  dogName: string;
  passportLinks: PassportLink[];
}

export function PassportSection({
  dogId,
  dogName,
  passportLinks,
}: PassportSectionProps) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleGenerate() {
    setGenerating(true);
    await generatePassportLink(dogId);
    router.refresh();
    setGenerating(false);
  }

  async function handleRevoke(linkId: string) {
    if (!confirm("Revoke this passport link? It will no longer be accessible."))
      return;
    await revokePassportLink(linkId);
    router.refresh();
  }

  function getPassportUrl(token: string) {
    return `${window.location.origin}/passport/${token}`;
  }

  async function copyToClipboard(token: string) {
    await navigator.clipboard.writeText(getPassportUrl(token));
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-text">
            Health Passport
          </h3>
          <p className="text-sm text-muted">
            Generate a shareable read-only link to {dogName}&apos;s health summary.
          </p>
        </div>
        <Button size="sm" loading={generating} onClick={handleGenerate}>
          <Link2 className="h-4 w-4" />
          Generate Link
        </Button>
      </div>

      {passportLinks.length === 0 ? (
        <div className="flex flex-col items-center rounded-[20px] border-2 border-dashed border-border py-16">
          <Link2 className="mb-3 h-10 w-10 text-gray-300" />
          <p className="mb-1 font-[family-name:var(--font-heading)] text-lg font-bold text-text">
            No passport links
          </p>
          <p className="text-sm text-muted">
            Generate a link to share {dogName}&apos;s health passport with vets or caregivers.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {passportLinks.map((link) => (
            <Card key={link.id} padding="sm">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-mono text-sm text-muted">
                      /passport/{link.token}
                    </p>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Created {formatDate(new Date(link.createdAt))}
                    {link.expiresAt &&
                      ` · Expires ${formatDate(new Date(link.expiresAt))}`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="rounded-xl p-2 text-muted transition-colors hover:bg-gray-100 hover:text-text"
                    onClick={() => copyToClipboard(link.token)}
                  >
                    {copied === link.token ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    className="rounded-xl p-2 text-muted transition-colors hover:bg-gray-100 hover:text-text"
                    onClick={() => window.open(getPassportUrl(link.token), "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-xl p-2 text-muted transition-colors hover:bg-danger-50 hover:text-danger-600"
                    onClick={() => handleRevoke(link.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
