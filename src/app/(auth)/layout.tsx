import Link from "next/link";
import { PawPrint } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <PawPrint className="h-8 w-8 text-primary" />
        <span className="font-[family-name:var(--font-heading)] text-2xl font-bold text-text">
          Pawlytics
        </span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
