"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLaboratoryResultSchema = exports.updateLaboratoryOrderSchema = exports.createLaboratoryOrderSchema = exports.createLaboratoryTestSchema = exports.createLaboratoryCategorySchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createLaboratoryCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().max(500).optional().or(zod_1.z.literal("")),
});
exports.createLaboratoryTestSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(150),
    laboratoryCategoryId: zod_1.z.string().uuid("Invalid category ID"),
    description: zod_1.z.string().max(500).optional().or(zod_1.z.literal("")),
    referenceRange: zod_1.z.string().max(200).optional().or(zod_1.z.literal("")),
});
exports.createLaboratoryOrderSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid("Invalid patient ID"),
    doctorId: zod_1.z.string().uuid("Invalid doctor ID"),
    appointmentId: zod_1.z.string().uuid("Invalid appointment ID"),
    medicalRecordId: zod_1.z.string().uuid("Invalid medical record ID"),
    laboratoryCategoryId: zod_1.z.string().uuid("Invalid category ID"),
    laboratoryTestId: zod_1.z.string().uuid("Invalid test ID"),
    priority: zod_1.z.nativeEnum(client_1.LaboratoryOrderPriority).optional(),
    status: zod_1.z.nativeEnum(client_1.LaboratoryOrderStatus).optional(),
    clinicalNotes: zod_1.z.string().max(1000).optional().or(zod_1.z.literal("")),
});
exports.updateLaboratoryOrderSchema = exports.createLaboratoryOrderSchema.partial().extend({
    priority: zod_1.z.nativeEnum(client_1.LaboratoryOrderPriority).optional(),
    status: zod_1.z.nativeEnum(client_1.LaboratoryOrderStatus).optional(),
    collectedDate: zod_1.z.string().optional(),
    completedDate: zod_1.z.string().optional(),
});
exports.createLaboratoryResultSchema = zod_1.z.object({
    resultValue: zod_1.z.string().max(500).optional().or(zod_1.z.literal("")),
    referenceRange: zod_1.z.string().max(200).optional().or(zod_1.z.literal("")),
    interpretation: zod_1.z.string().max(500).optional().or(zod_1.z.literal("")),
    technicianNotes: zod_1.z.string().max(1000).optional().or(zod_1.z.literal("")),
    attachment: zod_1.z.string().max(500).optional().or(zod_1.z.literal("")),
    status: zod_1.z.nativeEnum(client_1.LaboratoryResultStatus).optional(),
});
//# sourceMappingURL=laboratory.validator.js.map