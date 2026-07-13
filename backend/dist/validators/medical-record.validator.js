"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedicalRecordSchema = exports.createMedicalRecordSchema = exports.vitalSignsSchema = void 0;
const zod_1 = require("zod");
exports.vitalSignsSchema = zod_1.z.object({
    bloodPressure: zod_1.z.string().optional(),
    heartRate: zod_1.z.number().optional(),
    respiratoryRate: zod_1.z.number().optional(),
    temperature: zod_1.z.number().optional(),
    oxygenSaturation: zod_1.z.number().optional(),
    weight: zod_1.z.number().optional(),
    height: zod_1.z.number().optional(),
    bmi: zod_1.z.number().optional(),
});
exports.createMedicalRecordSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid("Invalid patient ID"),
    doctorId: zod_1.z.string().uuid("Invalid doctor ID"),
    appointmentId: zod_1.z.string().uuid("Invalid appointment ID"),
    visitDate: zod_1.z.string().min(1, "Visit date is required"),
    chiefComplaint: zod_1.z.string().max(500).optional(),
    symptoms: zod_1.z.string().max(1000).optional(),
    vitalSigns: exports.vitalSignsSchema.optional(),
    diagnosis: zod_1.z.string().max(1000).optional(),
    differentialDiagnosis: zod_1.z.string().max(1000).optional(),
    treatmentPlan: zod_1.z.string().max(2000).optional(),
    prescriptions: zod_1.z.array(zod_1.z.string()).optional(),
    allergies: zod_1.z.array(zod_1.z.string()).optional(),
    chronicConditions: zod_1.z.array(zod_1.z.string()).optional(),
    immunizations: zod_1.z.array(zod_1.z.string()).optional(),
    laboratoryRequests: zod_1.z.array(zod_1.z.string()).optional(),
    radiologyRequests: zod_1.z.array(zod_1.z.string()).optional(),
    clinicalNotes: zod_1.z.string().max(4000).optional(),
    followUpDate: zod_1.z.string().optional(),
    status: zod_1.z.enum(["OPEN", "CLOSED"]).optional(),
});
exports.updateMedicalRecordSchema = exports.createMedicalRecordSchema.partial();
//# sourceMappingURL=medical-record.validator.js.map