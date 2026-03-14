import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div className="mb-4 rounded-full bg-gray-100 p-5">
        <PawPrint className="h-8 w-8 text-muted" />
      </div>
      <h2 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold text-text">
        Page not found
      </h2>
      <p className="mb-6 text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
