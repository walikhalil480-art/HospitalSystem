import { z } from "zod";
export declare const createPatientSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodString;
    gender: z.ZodNativeEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
        OTHER: "OTHER";
    }>;
    bloodGroup: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    emergencyContact: z.ZodOptional<z.ZodString>;
    emergencyPhone: z.ZodOptional<z.ZodString>;
    allergies: z.ZodOptional<z.ZodString>;
    insuranceDetails: z.ZodOptional<z.ZodString>;
    medicalNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    phone?: string | undefined;
    bloodGroup?: string | undefined;
    address?: string | undefined;
    emergencyContact?: string | undefined;
    emergencyPhone?: string | undefined;
    allergies?: string | undefined;
    insuranceDetails?: string | undefined;
    medicalNotes?: string | undefined;
}, {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    phone?: string | undefined;
    bloodGroup?: string | undefined;
    address?: string | undefined;
    emergencyContact?: string | undefined;
    emergencyPhone?: string | undefined;
    allergies?: string | undefined;
    insuranceDetails?: string | undefined;
    medicalNotes?: string | undefined;
}>;
export declare const updatePatientSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    dateOfBirth: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodNativeEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
        OTHER: "OTHER";
    }>>;
    bloodGroup: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    emergencyContact: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    emergencyPhone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    allergies: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    insuranceDetails: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    medicalNotes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
    dateOfBirth?: string | undefined;
    gender?: "MALE" | "FEMALE" | "OTHER" | undefined;
    bloodGroup?: string | undefined;
    address?: string | undefined;
    emergencyContact?: string | undefined;
    emergencyPhone?: string | undefined;
    allergies?: string | undefined;
    insuranceDetails?: string | undefined;
    medicalNotes?: string | undefined;
}, {
    email?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
    dateOfBirth?: string | undefined;
    gender?: "MALE" | "FEMALE" | "OTHER" | undefined;
    bloodGroup?: string | undefined;
    address?: string | undefined;
    emergencyContact?: string | undefined;
    emergencyPhone?: string | undefined;
    allergies?: string | undefined;
    insuranceDetails?: string | undefined;
    medicalNotes?: string | undefined;
}>;
export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
//# sourceMappingURL=patient.validator.d.ts.map