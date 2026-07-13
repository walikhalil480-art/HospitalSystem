"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    firstName: zod_1.z.string().min(2, "First name must be at least 2 characters").max(50),
    lastName: zod_1.z.string().min(2, "Last name must be at least 2 characters").max(50),
    phone: zod_1.z.string().optional(),
    role: zod_1.z.nativeEnum(client_1.Role, { errorMap: () => ({ message: "Invalid role specified" }) }),
});
exports.updateUserSchema = exports.createUserSchema.partial().extend({
    isActive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=user.validator.js.map