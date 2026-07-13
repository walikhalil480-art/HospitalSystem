import { z } from "zod";
import { Gender } from "@prisma/client";

export const createPatientSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime({ message: "Invalid date format, expected ISO 8601" }),
  gender: z.nativeEnum(Gender, { errorMap: () => ({ message: "Gender must be MALE, FEMALE, or OTHER" }) }),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  allergies: z.string().optional(),
  insuranceDetails: z.string().optional(),
  medicalNotes: z.string().optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
