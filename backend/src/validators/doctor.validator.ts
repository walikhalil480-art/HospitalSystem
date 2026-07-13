import { z } from "zod";

const employmentStatusSchema = z.enum(["ACTIVE", "ON_LEAVE", "INACTIVE", "SUSPENDED"]);
const availabilitySchema = z.enum(["AVAILABLE", "BUSY", "OFFLINE"]);

const emptyStringAsUndefined = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().uuid("Invalid department ID").optional()
);

export const createDoctorSchema = z.object({
  email: z.string().email("Invalid email format"),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().optional(),
  departmentId: emptyStringAsUndefined,
  specialization: z.string().optional(),
  qualifications: z.string().optional(),
  licenseNumber: z.string().optional(),
  schedule: z.string().optional(),
  consultationFee: z.number().min(0).optional(),
  bio: z.string().optional(),
  employmentStatus: employmentStatusSchema.optional(),
  availability: availabilitySchema.optional(),
  photoUrl: z.string().url("Invalid photo URL").optional().or(z.literal("")),
});

export const updateDoctorSchema = createDoctorSchema.partial();

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
