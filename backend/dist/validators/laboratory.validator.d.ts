import { z } from "zod";
export declare const createLaboratoryCategorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
}>;
export declare const createLaboratoryTestSchema: z.ZodObject<{
    name: z.ZodString;
    laboratoryCategoryId: z.ZodString;
    description: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    referenceRange: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    laboratoryCategoryId: string;
    description?: string | undefined;
    referenceRange?: string | undefined;
}, {
    name: string;
    laboratoryCategoryId: string;
    description?: string | undefined;
    referenceRange?: string | undefined;
}>;
export declare const createLaboratoryOrderSchema: z.ZodObject<{
    patientId: z.ZodString;
    doctorId: z.ZodString;
    appointmentId: z.ZodString;
    medicalRecordId: z.ZodString;
    laboratoryCategoryId: z.ZodString;
    laboratoryTestId: z.ZodString;
    priority: z.ZodOptional<z.ZodNativeEnum<{
        LOW: "LOW";
        NORMAL: "NORMAL";
        HIGH: "HIGH";
        URGENT: "URGENT";
    }>>;
    status: z.ZodOptional<z.ZodNativeEnum<{
        PENDING: "PENDING";
        SCHEDULED: "SCHEDULED";
        COLLECTED: "COLLECTED";
        IN_PROGRESS: "IN_PROGRESS";
        COMPLETED: "COMPLETED";
        VERIFIED: "VERIFIED";
        CANCELLED: "CANCELLED";
    }>>;
    clinicalNotes: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    patientId: string;
    doctorId: string;
    appointmentId: string;
    medicalRecordId: string;
    laboratoryCategoryId: string;
    laboratoryTestId: string;
    status?: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "PENDING" | "COLLECTED" | "VERIFIED" | undefined;
    priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT" | undefined;
    clinicalNotes?: string | undefined;
}, {
    patientId: string;
    doctorId: string;
    appointmentId: string;
    medicalRecordId: string;
    laboratoryCategoryId: string;
    laboratoryTestId: string;
    status?: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "PENDING" | "COLLECTED" | "VERIFIED" | undefined;
    priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT" | undefined;
    clinicalNotes?: string | undefined;
}>;
export declare const updateLaboratoryOrderSchema: z.ZodObject<{
    patientId: z.ZodOptional<z.ZodString>;
    doctorId: z.ZodOptional<z.ZodString>;
    appointmentId: z.ZodOptional<z.ZodString>;
    medicalRecordId: z.ZodOptional<z.ZodString>;
    laboratoryCategoryId: z.ZodOptional<z.ZodString>;
    laboratoryTestId: z.ZodOptional<z.ZodString>;
    clinicalNotes: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
} & {
    priority: z.ZodOptional<z.ZodNativeEnum<{
        LOW: "LOW";
        NORMAL: "NORMAL";
        HIGH: "HIGH";
        URGENT: "URGENT";
    }>>;
    status: z.ZodOptional<z.ZodNativeEnum<{
        PENDING: "PENDING";
        SCHEDULED: "SCHEDULED";
        COLLECTED: "COLLECTED";
        IN_PROGRESS: "IN_PROGRESS";
        COMPLETED: "COMPLETED";
        VERIFIED: "VERIFIED";
        CANCELLED: "CANCELLED";
    }>>;
    collectedDate: z.ZodOptional<z.ZodString>;
    completedDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "PENDING" | "COLLECTED" | "VERIFIED" | undefined;
    patientId?: string | undefined;
    doctorId?: string | undefined;
    priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT" | undefined;
    appointmentId?: string | undefined;
    clinicalNotes?: string | undefined;
    medicalRecordId?: string | undefined;
    laboratoryCategoryId?: string | undefined;
    laboratoryTestId?: string | undefined;
    collectedDate?: string | undefined;
    completedDate?: string | undefined;
}, {
    status?: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "PENDING" | "COLLECTED" | "VERIFIED" | undefined;
    patientId?: string | undefined;
    doctorId?: string | undefined;
    priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT" | undefined;
    appointmentId?: string | undefined;
    clinicalNotes?: string | undefined;
    medicalRecordId?: string | undefined;
    laboratoryCategoryId?: string | undefined;
    laboratoryTestId?: string | undefined;
    collectedDate?: string | undefined;
    completedDate?: string | undefined;
}>;
export declare const createLaboratoryResultSchema: z.ZodObject<{
    resultValue: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    referenceRange: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    interpretation: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    technicianNotes: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    attachment: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    status: z.ZodOptional<z.ZodNativeEnum<{
        PENDING: "PENDING";
        ENTERED: "ENTERED";
        VERIFIED: "VERIFIED";
        CANCELLED: "CANCELLED";
    }>>;
}, "strip", z.ZodTypeAny, {
    status?: "CANCELLED" | "PENDING" | "VERIFIED" | "ENTERED" | undefined;
    referenceRange?: string | undefined;
    resultValue?: string | undefined;
    interpretation?: string | undefined;
    technicianNotes?: string | undefined;
    attachment?: string | undefined;
}, {
    status?: "CANCELLED" | "PENDING" | "VERIFIED" | "ENTERED" | undefined;
    referenceRange?: string | undefined;
    resultValue?: string | undefined;
    interpretation?: string | undefined;
    technicianNotes?: string | undefined;
    attachment?: string | undefined;
}>;
export type CreateLaboratoryCategoryInput = z.infer<typeof createLaboratoryCategorySchema>;
export type CreateLaboratoryTestInput = z.infer<typeof createLaboratoryTestSchema>;
export type CreateLaboratoryOrderInput = z.infer<typeof createLaboratoryOrderSchema>;
export type UpdateLaboratoryOrderInput = z.infer<typeof updateLaboratoryOrderSchema>;
export type CreateLaboratoryResultInput = z.infer<typeof createLaboratoryResultSchema>;
//# sourceMappingURL=laboratory.validator.d.ts.map