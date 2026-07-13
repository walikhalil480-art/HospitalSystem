"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientSchema = exports.createPatientSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createPatientSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, "First name must be at least 2 characters").max(50),
    lastName: zod_1.z.string().min(2, "Last name must be at least 2 characters").max(50),
    email: zod_1.z.string().email("Invalid email format"),
    phone: zod_1.z.string().optional(),
    dateOfBirth: zod_1.z.string().datetime({ message: "Invalid date format, expected ISO 8601" }),
    gender: zod_1.z.nativeEnum(client_1.Gender, { errorMap: () => ({ message: "Gender must be MALE, FEMALE, or OTHER" }) }),
    bloodGroup: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    emergencyContact: zod_1.z.string().optional(),
    emergencyPhone: zod_1.z.string().optional(),
    allergies: zod_1.z.string().optional(),
    insuranceDetails: zod_1.z.string().optional(),
    medicalNotes: zod_1.z.string().optional(),
});
exports.updatePatientSchema = exports.createPatientSchema.partial();
//# sourceMappingURL=patient.validator.js.map