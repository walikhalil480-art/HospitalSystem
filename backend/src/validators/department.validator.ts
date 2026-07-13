import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  code: z.string().min(1).max(20).optional().or(z.literal("")),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const assignDoctorSchema = z.object({
  doctorId: z.string().uuid("Invalid doctor ID"),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type AssignDoctorInput = z.infer<typeof assignDoctorSchema>;
