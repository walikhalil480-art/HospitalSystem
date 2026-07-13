import { LaboratoryOrderPriority, LaboratoryOrderStatus, LaboratoryResultStatus } from "@prisma/client";
import { z } from "zod";

export const createLaboratoryCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional().or(z.literal("")),
});

export const createLaboratoryTestSchema = z.object({
  name: z.string().min(2).max(150),
  laboratoryCategoryId: z.string().uuid("Invalid category ID"),
  description: z.string().max(500).optional().or(z.literal("")),
  referenceRange: z.string().max(200).optional().or(z.literal("")),
});

export const createLaboratoryOrderSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID"),
  doctorId: z.string().uuid("Invalid doctor ID"),
  appointmentId: z.string().uuid("Invalid appointment ID"),
  medicalRecordId: z.string().uuid("Invalid medical record ID"),
  laboratoryCategoryId: z.string().uuid("Invalid category ID"),
  laboratoryTestId: z.string().uuid("Invalid test ID"),
  priority: z.nativeEnum(LaboratoryOrderPriority).optional(),
  status: z.nativeEnum(LaboratoryOrderStatus).optional(),
  clinicalNotes: z.string().max(1000).optional().or(z.literal("")),
});

export const updateLaboratoryOrderSchema = createLaboratoryOrderSchema.partial().extend({
  priority: z.nativeEnum(LaboratoryOrderPriority).optional(),
  status: z.nativeEnum(LaboratoryOrderStatus).optional(),
  collectedDate: z.string().optional(),
  completedDate: z.string().optional(),
});

export const createLaboratoryResultSchema = z.object({
  resultValue: z.string().max(500).optional().or(z.literal("")),
  referenceRange: z.string().max(200).optional().or(z.literal("")),
  interpretation: z.string().max(500).optional().or(z.literal("")),
  technicianNotes: z.string().max(1000).optional().or(z.literal("")),
  attachment: z.string().max(500).optional().or(z.literal("")),
  status: z.nativeEnum(LaboratoryResultStatus).optional(),
});

export type CreateLaboratoryCategoryInput = z.infer<typeof createLaboratoryCategorySchema>;
export type CreateLaboratoryTestInput = z.infer<typeof createLaboratoryTestSchema>;
export type CreateLaboratoryOrderInput = z.infer<typeof createLaboratoryOrderSchema>;
export type UpdateLaboratoryOrderInput = z.infer<typeof updateLaboratoryOrderSchema>;
export type CreateLaboratoryResultInput = z.infer<typeof createLaboratoryResultSchema>;
