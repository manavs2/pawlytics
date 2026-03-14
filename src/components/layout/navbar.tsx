"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PawPrint, Bell, Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DogOption {
  id: string;
  name: string;
}

interface NavbarProps {
  userName?: string | null;
  activeDogId?: string | null;
  dogs?: DogOption[];
}

const NAV_ITEMS = [
  { label: "Dashboard", slug: null },
  { label: "My Dogs", slug: "my-dogs" },     // special: /dogs
  { label: "Care Plan", slug: "" },          // /dogs/[id]
  { label: "Health Records", slug: "health-records" },
  { label: "Documents", slug: "documents" },
  { label: "Passport", slug: "passport" },
] as const;

/** Extracts the dogId segment from paths like /dogs/[dogId] or /dogs/[dogId]/... */
function getDogIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/dogs\/([^/]+)/);
  return match ? match[1] : null;
}

export function Navbar({ userName, activeDogId, dogs = [] }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dogSwitcherOpen, setDogSwitcherOpen] = useState(false);
  const dogSwitcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dogSwitcherRef.current && !dogSwitcherRef.current.contains(e.target as Node)) {
        setDogSwitcherOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If we're already on a dog page, use that dog's id so all nav links stay on the same dog.
  const urlDogId = getDogIdFromPath(pathname);
  const effectiveDogId = urlDogId || activeDogId;

  function getHref(item: (typeof NAV_ITEMS)[number]) {
    if (item.slug === null) return "/dashboard";
    if (item.slug === "my-dogs") return "/dogs";
    if (!effectiveDogId) return "/dashboard";
    return item.slug === "" ? `/dogs/${effectiveDogId}` : `/dogs/${effectiveDogId}/${item.slug}`;
  }

  function isActive(item: (typeof NAV_ITEMS)[number]) {
    if (item.slug === null) return pathname === "/dashboard";
    if (item.slug === "my-dogs") return pathname === "/dogs";
    if (!effectiveDogId) return false;
    const base = `/dogs/${effectiveDogId}`;
    if (item.slug === "") {
      return pathname === base;
    }
    return pathname === `${base}/${item.slug}`;
  }

  async function handleSignOut() {
    const { signOut } = await import("next-auth/react");
    await signOut({ redirectTo: "/" });
  }

  return (
    <header className="sticky top-0 z-50 bg-bg">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <PawPrint className="h-7 w-7 text-primary" />
          <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-text">
            Pawlytics
          </span>
        </Link>

        {dogs.length > 1 && (
          <div ref={dogSwitcherRef} className="relative hidden md:block">
            <button
              onClick={() => setDogSwitcherOpen(!dogSwitcherOpen)}
              className="flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-text transition-colors hover:bg-gray-50"
              aria-expanded={dogSwitcherOpen}
              aria-haspopup="listbox"
            >
              {dogs.find((d) => d.id === effectiveDogId)?.name ?? dogs[0]?.name ?? "Switch dog"}
              <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", dogSwitcherOpen && "rotate-180")} />
            </button>
            {dogSwitcherOpen && (
              <div
                className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-xl border border-border bg-surface py-1 shadow-lg"
                role="listbox"
              >
                {dogs.map((dog) => (
                  <Link
                    key={dog.id}
                    href={`/dogs/${dog.id}`}
                    onClick={() => setDogSwitcherOpen(false)}
                    className={cn(
                      "block px-3 py-2 text-sm font-medium transition-colors",
                      dog.id === effectiveDogId ? "bg-primary-50 text-primary" : "text-text hover:bg-gray-50"
                    )}
                    role="option"
                  >
                    {dog.name}
                  </Link>
                ))}
                <Link
                  href="/dogs"
                  onClick={() => setDogSwitcherOpen(false)}
                  className="block border-t border-border px-3 py-2 text-sm font-medium text-muted hover:bg-gray-50"
                >
                  View all dogs
                </Link>
              </div>
            )}
          </div>
        )}

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={getHref(item)}
              className={cn(
                "text-[15px] font-semibold transition-colors",
                isActive(item) ? "text-primary" : "text-muted hover:text-text"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button className="relative rounded-full p-2 text-muted transition-colors hover:bg-gray-100 hover:text-text">
            <Bell className="h-5 w-5" />
          </button>
          <button
            onClick={handleSignOut}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-[0_4px_12px_rgba(184,107,82,0.25)]"
            title={`Signed in as ${userName}`}
          >
            <PawPrint className="h-5 w-5 text-white" />
          </button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-text" />
          ) : (
            <Menu className="h-6 w-6 text-text" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface px-6 py-4 md:hidden">
          {dogs.length > 1 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Switch dog</p>
              <div className="flex flex-col gap-1">
                {dogs.map((dog) => (
                  <Link
                    key={dog.id}
                    href={`/dogs/${dog.id}`}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium",
                      dog.id === effectiveDogId ? "bg-primary-50 text-primary" : "text-text"
                    )}
                  >
                    {dog.name}
                  </Link>
                ))}
                <Link
                  href="/dogs"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted"
                >
                  View all dogs
                </Link>
              </div>
              <div className="my-4 border-t border-border" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={getHref(item)}
                className={cn(
                  "text-[15px] font-semibold",
                  isActive(item) ? "text-primary" : "text-muted"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border pt-4">
              <p className="mb-2 text-sm text-muted">{userName}</p>
              <button
                onClick={handleSignOut}
                className="text-sm font-semibold text-primary"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
