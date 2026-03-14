"use client";

import { Tabs } from "@/components/ui/tabs";
import { CareOverview } from "@/components/care/care-overview";
import { VaccinationSection } from "@/components/vaccinations/vaccination-section";
import { DocumentSection } from "@/components/documents/document-section";
import { PassportSection } from "@/components/passport/passport-section";
import type { Dog, CareEvent, Vaccination, Document, PassportLink } from "@/generated/prisma/client";

interface DogDetailTabsProps {
  dog: Dog & {
    careEvents: CareEvent[];
    vaccinations: Vaccination[];
    documents: Document[];
    passportLinks: PassportLink[];
  };
}

export function DogDetailTabs({ dog }: DogDetailTabsProps) {
  const tabs = [
    {
      id: "care",
      label: "Care Plan",
      content: <CareOverview dogId={dog.id} careEvents={dog.careEvents} />,
    },
    {
      id: "vaccinations",
      label: "Vaccinations",
      content: (
        <VaccinationSection
          dogId={dog.id}
          vaccinations={dog.vaccinations}
        />
      ),
    },
    {
      id: "documents",
      label: "Documents",
      content: (
        <DocumentSection dogId={dog.id} documents={dog.documents} />
      ),
    },
    {
      id: "passport",
      label: "Passport",
      content: (
        <PassportSection
          dogId={dog.id}
          dogName={dog.name}
          passportLinks={dog.passportLinks}
        />
      ),
    },
  ];

  return <Tabs tabs={tabs} defaultTab="care" />;
}
