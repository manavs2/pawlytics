"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mb-4 rounded-full bg-danger-50 p-5">
        <AlertTriangle className="h-8 w-8 text-danger-600" />
      </div>
      <h2 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold text-text">
        Something went wrong
      </h2>
      <p className="mb-6 max-w-md text-center text-sm text-muted">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
