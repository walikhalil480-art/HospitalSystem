"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDoctorSchema = exports.createDoctorSchema = void 0;
const zod_1 = require("zod");
const employmentStatusSchema = zod_1.z.enum(["ACTIVE", "ON_LEAVE", "INACTIVE", "SUSPENDED"]);
const availabilitySchema = zod_1.z.enum(["AVAILABLE", "BUSY", "OFFLINE"]);
const emptyStringAsUndefined = zod_1.z.preprocess((value) => (typeof value === "string" && value.trim() === "" ? undefined : value), zod_1.z.string().uuid("Invalid department ID").optional());
exports.createDoctorSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    firstName: zod_1.z.string().min(2).max(50),
    lastName: zod_1.z.string().min(2).max(50),
    phone: zod_1.z.string().optional(),
    departmentId: emptyStringAsUndefined,
    specialization: zod_1.z.string().optional(),
    qualifications: zod_1.z.string().optional(),
    licenseNumber: zod_1.z.string().optional(),
    schedule: zod_1.z.string().optional(),
    consultationFee: zod_1.z.number().min(0).optional(),
    bio: zod_1.z.string().optional(),
    employmentStatus: employmentStatusSchema.optional(),
    availability: availabilitySchema.optional(),
    photoUrl: zod_1.z.string().url("Invalid photo URL").optional().or(zod_1.z.literal("")),
});
exports.updateDoctorSchema = exports.createDoctorSchema.partial();
//# sourceMappingURL=doctor.validator.js.map