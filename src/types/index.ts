export type DogSex = "male" | "female";

export type DocumentType =
  | "vaccine_certificate"
  | "lab_report"
  | "prescription"
  | "imaging"
  | "other";

export type RecurrenceRule =
  | "EVERY_1_MONTH"
  | "EVERY_2_MONTHS"
  | "EVERY_3_MONTHS"
  | "EVERY_6_MONTHS"
  | "EVERY_12_MONTHS";

export type CareEventType =
  | "vet_visit"
  | "dental_check"
  | "ear_check"
  | "grooming"
  | "nail_trim"
  | "heartworm_prevention"
  | "flea_tick_prevention"
  | "weigh_in"
  | "respiratory_check"
  | "joint_screening"
  | "deshedding"
  | "custom";

export type CareEventStatus = "upcoming" | "overdue" | "completed";

export const CARE_EVENT_LABELS: Record<CareEventType, string> = {
  vet_visit: "Vet Visit",
  dental_check: "Dental Check",
  ear_check: "Ear Check",
  grooming: "Grooming",
  nail_trim: "Nail Trim",
  heartworm_prevention: "Heartworm Prevention",
  flea_tick_prevention: "Flea & Tick Prevention",
  weigh_in: "Weigh-in",
  respiratory_check: "Respiratory Check",
  joint_screening: "Joint/Hip Screening",
  deshedding: "De-shedding",
  custom: "Custom",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  vaccine_certificate: "Vaccine Certificate",
  lab_report: "Lab Report",
  prescription: "Prescription",
  imaging: "Imaging",
  other: "Other",
};

export const COMMON_VACCINATIONS = [
  "Rabies",
  "DHPP (Distemper, Hepatitis, Parainfluenza, Parvovirus)",
  "Bordetella",
  "Leptospirosis",
  "Canine Influenza",
  "Lyme Disease",
  "Other Vaccine",
] as const;

export const COMMON_FLEA_TICK = [
  "NexGard",
  "Bravecto",
  "Simparica",
  "Frontline Plus",
  "Seresto Collar",
  "K9 Advantix II",
  "Credelio",
  "Other Flea & Tick",
] as const;

export const COMMON_HEARTWORM = [
  "Heartgard Plus",
  "Interceptor Plus",
  "Simparica Trio",
  "Tri-Heart Plus",
  "Sentinel",
  "Revolution",
  "ProHeart",
  "Other Heartworm",
] as const;
