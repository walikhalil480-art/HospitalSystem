import { z } from "zod";
export declare const createDepartmentSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    code: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    code?: string | undefined;
    description?: string | undefined;
}, {
    name: string;
    code?: string | undefined;
    description?: string | undefined;
}>;
export declare const updateDepartmentSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    code: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
}, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
}>;
export declare const assignDoctorSchema: z.ZodObject<{
    doctorId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    doctorId: string;
}, {
    doctorId: string;
}>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type AssignDoctorInput = z.infer<typeof assignDoctorSchema>;
//# sourceMappingURL=department.validator.d.ts.map