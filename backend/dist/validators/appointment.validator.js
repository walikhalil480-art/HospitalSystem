"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentSchema = exports.createAppointmentSchema = exports.appointmentStatusSchema = exports.appointmentPrioritySchema = exports.consultationTypeSchema = void 0;
const zod_1 = require("zod");
exports.consultationTypeSchema = zod_1.z.enum(["IN_PERSON", "ONLINE"]);
exports.appointmentPrioritySchema = zod_1.z.enum(["LOW", "NORMAL", "HIGH", "EMERGENCY"]);
exports.appointmentStatusSchema = zod_1.z.enum(["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]);
exports.createAppointmentSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid("Invalid patient ID"),
    doctorId: zod_1.z.string().uuid("Invalid doctor ID"),
    departmentId: zod_1.z.string().uuid("Invalid department ID"),
    appointmentDate: zod_1.z.string().min(1, "Appointment date is required"),
    startTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
    endTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format"),
    consultationType: exports.consultationTypeSchema.optional(),
    priority: exports.appointmentPrioritySchema.optional(),
    reasonForVisit: zod_1.z.string().max(500).optional(),
    symptoms: zod_1.z.string().max(1000).optional(),
    notes: zod_1.z.string().max(2000).optional(),
});
exports.updateAppointmentSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid("Invalid patient ID").optional(),
    doctorId: zod_1.z.string().uuid("Invalid doctor ID").optional(),
    departmentId: zod_1.z.string().uuid("Invalid department ID").optional(),
    appointmentDate: zod_1.z.string().min(1).optional(),
    startTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format").optional(),
    endTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format").optional(),
    consultationType: exports.consultationTypeSchema.optional(),
    priority: exports.appointmentPrioritySchema.optional(),
    status: exports.appointmentStatusSchema.optional(),
    reasonForVisit: zod_1.z.string().max(500).nullable().optional(),
    symptoms: zod_1.z.string().max(1000).nullable().optional(),
    notes: zod_1.z.string().max(2000).nullable().optional(),
});
//# sourceMappingURL=appointment.validator.js.map