import Link from "next/link";
import {
  PawPrint,
  CalendarCheck,
  FileText,
  Share2,
  ArrowRight,
  Heart,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-bg">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <PawPrint className="h-7 w-7 text-primary" />
            <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-text">
              Pawlytics
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-[13px] font-bold uppercase tracking-[1px] text-primary">
                <Heart className="h-4 w-4" />
                Preventative care made simple
              </div>
              <h1 className="font-[family-name:var(--font-heading)] text-[40px] font-bold leading-tight text-text sm:text-[52px] lg:text-[60px]">
                Your dog&apos;s complete{" "}
                <span className="text-primary">health passport</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted">
                Track vaccinations, organize medical records, and stay on top of
                preventative care — all in one place. Share a digital health
                passport with vets, boarding facilities, or anyone who cares for
                your dog.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="pb-24 pt-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-bold text-text">
                Everything your dog&apos;s health needs
              </h2>
              <p className="mt-4 text-lg text-muted">
                From vaccination tracking to shareable health passports,
                Pawlytics keeps every detail organized and accessible.
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<CalendarCheck className="h-6 w-6" />}
                title="Smart Care Plans"
                description="Get a personalized preventative care schedule based on your dog's breed, age, and health needs."
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Vaccination Tracking"
                description="Log vaccinations, track booster dates, and never miss an important shot."
              />
              <FeatureCard
                icon={<FileText className="h-6 w-6" />}
                title="Medical Records"
                description="Upload and organize vaccine certificates, lab reports, prescriptions, and imaging."
              />
              <FeatureCard
                icon={<Share2 className="h-6 w-6" />}
                title="Shareable Passport"
                description="Generate a secure read-only link to share your dog's health summary with anyone."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-[32px] mx-6 lg:mx-auto lg:max-w-7xl bg-primary px-8 py-16">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-bold text-white">
              Start tracking your dog&apos;s health today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Create your free account and set up your dog&apos;s health profile
              in minutes.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-primary-50"
                >
                  Get Started For Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted lg:px-8">
          &copy; {new Date().getFullYear()} Pawlytics. Built with care for dog
          owners everywhere.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[20px] bg-surface p-6 shadow-[0_8px_30px_rgba(58,46,42,0.06)] transition-shadow duration-200 hover:shadow-[0_20px_40px_rgba(184,107,82,0.12)]">
      <div className="mb-4 inline-flex rounded-2xl bg-primary-50 p-3 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 font-[family-name:var(--font-heading)] text-lg font-bold text-text">
        {title}
      </h3>
      <p className="text-[15px] leading-relaxed text-muted">{description}</p>
    </div>
  );
}
