import type { SizeCategory } from "./breeds";

export type Predicate =
  | { kind: "all" }
  | { kind: "breeds"; breeds: string[] }
  | { kind: "size"; sizes: SizeCategory[] }
  | { kind: "trait"; trait: string };

export interface CareRule {
  type: string;
  title: string;
  description: string;
  recurrence: string;
  applicableTo: Predicate;
  startAgeMonths?: number;
}

export const CARE_RULES: CareRule[] = [
  {
    type: "vet_visit",
    title: "Annual Vet Visit",
    description: "Comprehensive annual wellness exam",
    recurrence: "EVERY_12_MONTHS",
    applicableTo: { kind: "all" },
  },
  {
    type: "dental_check",
    title: "Dental Check",
    description: "Professional dental examination and cleaning assessment",
    recurrence: "EVERY_6_MONTHS",
    applicableTo: { kind: "all" },
  },
  {
    type: "heartworm_prevention",
    title: "Heartworm Prevention",
    description: "Monthly heartworm prevention medication",
    recurrence: "EVERY_1_MONTH",
    applicableTo: { kind: "all" },
  },
  {
    type: "flea_tick_prevention",
    title: "Flea & Tick Prevention",
    description: "Monthly flea and tick prevention treatment",
    recurrence: "EVERY_1_MONTH",
    applicableTo: { kind: "all" },
  },
  {
    type: "nail_trim",
    title: "Nail Trim",
    description: "Regular nail trimming to maintain healthy paw posture",
    recurrence: "EVERY_1_MONTH",
    applicableTo: { kind: "all" },
  },
  {
    type: "weigh_in",
    title: "Weight Check",
    description: "Regular weigh-in to monitor healthy weight",
    recurrence: "EVERY_3_MONTHS",
    applicableTo: { kind: "all" },
  },
  {
    type: "ear_check",
    title: "Ear Check",
    description: "Inspect and clean ears to prevent infections common in floppy-eared breeds",
    recurrence: "EVERY_1_MONTH",
    applicableTo: { kind: "trait", trait: "floppy_ears" },
  },
  {
    type: "respiratory_check",
    title: "Respiratory Check",
    description: "Monitor breathing and airway health for brachycephalic breeds",
    recurrence: "EVERY_6_MONTHS",
    applicableTo: { kind: "trait", trait: "brachycephalic" },
  },
  {
    type: "joint_screening",
    title: "Joint & Hip Screening",
    description: "Screening for hip dysplasia and joint issues common in large breeds",
    recurrence: "EVERY_12_MONTHS",
    applicableTo: { kind: "size", sizes: ["large", "giant"] },
    startAgeMonths: 12,
  },
  {
    type: "grooming",
    title: "Professional Grooming",
    description: "Full grooming session for coat maintenance",
    recurrence: "EVERY_2_MONTHS",
    applicableTo: { kind: "trait", trait: "long_coat" },
  },
  {
    type: "deshedding",
    title: "De-shedding Treatment",
    description: "Professional de-shedding to manage undercoat",
    recurrence: "EVERY_3_MONTHS",
    applicableTo: { kind: "trait", trait: "double_coat" },
  },
];
