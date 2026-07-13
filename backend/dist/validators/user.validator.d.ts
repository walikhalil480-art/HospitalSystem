import { z } from "zod";
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodNativeEnum<{
        SUPER_ADMIN: "SUPER_ADMIN";
        ADMIN: "ADMIN";
        DOCTOR: "DOCTOR";
        RECEPTIONIST: "RECEPTIONIST";
        NURSE: "NURSE";
        PHARMACIST: "PHARMACIST";
        LAB_TECHNICIAN: "LAB_TECHNICIAN";
        CASHIER: "CASHIER";
        PATIENT: "PATIENT";
    }>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "NURSE" | "PHARMACIST" | "LAB_TECHNICIAN" | "CASHIER" | "PATIENT";
    phone?: string | undefined;
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "NURSE" | "PHARMACIST" | "LAB_TECHNICIAN" | "CASHIER" | "PATIENT";
    phone?: string | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    role: z.ZodOptional<z.ZodNativeEnum<{
        SUPER_ADMIN: "SUPER_ADMIN";
        ADMIN: "ADMIN";
        DOCTOR: "DOCTOR";
        RECEPTIONIST: "RECEPTIONIST";
        NURSE: "NURSE";
        PHARMACIST: "PHARMACIST";
        LAB_TECHNICIAN: "LAB_TECHNICIAN";
        CASHIER: "CASHIER";
        PATIENT: "PATIENT";
    }>>;
} & {
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    password?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "NURSE" | "PHARMACIST" | "LAB_TECHNICIAN" | "CASHIER" | "PATIENT" | undefined;
    phone?: string | undefined;
    isActive?: boolean | undefined;
}, {
    email?: string | undefined;
    password?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "NURSE" | "PHARMACIST" | "LAB_TECHNICIAN" | "CASHIER" | "PATIENT" | undefined;
    phone?: string | undefined;
    isActive?: boolean | undefined;
}>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
//# sourceMappingURL=user.validator.d.ts.map