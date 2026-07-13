import { z } from "zod";

export const vitalSignsSchema = z.object({
  bloodPressure: z.string().optional(),
  heartRate: z.number().optional(),
  respiratoryRate: z.number().optional(),
  temperature: z.number().optional(),
  oxygenSaturation: z.number().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
  bmi: z.number().optional(),
});

export const createMedicalRecordSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID"),
  doctorId: z.string().uuid("Invalid doctor ID"),
  appointmentId: z.string().uuid("Invalid appointment ID"),
  visitDate: z.string().min(1, "Visit date is required"),
  chiefComplaint: z.string().max(500).optional(),
  symptoms: z.string().max(1000).optional(),
  vitalSigns: vitalSignsSchema.optional(),
  diagnosis: z.string().max(1000).optional(),
  differentialDiagnosis: z.string().max(1000).optional(),
  treatmentPlan: z.string().max(2000).optional(),
  prescriptions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  chronicConditions: z.array(z.string()).optional(),
  immunizations: z.array(z.string()).optional(),
  laboratoryRequests: z.array(z.string()).optional(),
  radiologyRequests: z.array(z.string()).optional(),
  clinicalNotes: z.string().max(4000).optional(),
  followUpDate: z.string().optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
});

export const updateMedicalRecordSchema = createMedicalRecordSchema.partial();

export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>;
export type UpdateMedicalRecordInput = z.infer<typeof updateMedicalRecordSchema>;
