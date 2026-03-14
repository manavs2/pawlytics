import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pawlytics — Dog Health Passport & Preventative Care",
  description:
    "Keep your dog's health records organized, stay on top of preventative care, and share a digital health passport with vets and caregivers.",
  openGraph: {
    title: "Pawlytics — Dog Health Passport & Preventative Care",
    description:
      "Track vaccinations, organize medical records, and stay on top of preventative care for your dog.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
