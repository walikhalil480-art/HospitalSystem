import { z } from "zod";

export const consultationTypeSchema = z.enum(["IN_PERSON", "ONLINE"]);
export const appointmentPrioritySchema = z.enum(["LOW", "NORMAL", "HIGH", "EMERGENCY"]);
export const appointmentStatusSchema = z.enum(["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]);

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID"),
  doctorId: z.string().uuid("Invalid doctor ID"),
  departmentId: z.string().uuid("Invalid department ID"),
  appointmentDate: z.string().min(1, "Appointment date is required"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format"),
  consultationType: consultationTypeSchema.optional(),
  priority: appointmentPrioritySchema.optional(),
  reasonForVisit: z.string().max(500).optional(),
  symptoms: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
});

export const updateAppointmentSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID").optional(),
  doctorId: z.string().uuid("Invalid doctor ID").optional(),
  departmentId: z.string().uuid("Invalid department ID").optional(),
  appointmentDate: z.string().min(1).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format").optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format").optional(),
  consultationType: consultationTypeSchema.optional(),
  priority: appointmentPrioritySchema.optional(),
  status: appointmentStatusSchema.optional(),
  reasonForVisit: z.string().max(500).nullable().optional(),
  symptoms: z.string().max(1000).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
