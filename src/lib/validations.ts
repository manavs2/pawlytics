import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const dogSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  breed: z.string().min(1, "Breed is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  sex: z.enum(["male", "female"], { message: "Sex is required" }),
  weight: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : null))
    .pipe(z.number().positive().max(300).nullable()),
  color: z
    .string()
    .optional()
    .transform((v) => v || null),
  microchipId: z
    .string()
    .optional()
    .transform((v) => v || null),
});

export const vaccinationSchema = z.object({
  name: z.string().min(1, "Vaccine name is required"),
  dateAdministered: z.string().min(1, "Date is required"),
  expirationDate: z.string().optional(),
  boosterDueDate: z.string().optional(),
  veterinarian: z.string().optional(),
  lotNumber: z.string().optional(),
  notes: z.string().optional(),
});

export const careEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  type: z.string().optional(),
  recurrenceRule: z.string().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type DogInput = z.infer<typeof dogSchema>;
export type VaccinationInput = z.infer<typeof vaccinationSchema>;
export type CareEventInput = z.infer<typeof careEventSchema>;
