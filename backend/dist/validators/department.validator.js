"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignDoctorSchema = exports.updateDepartmentSchema = exports.createDepartmentSchema = void 0;
const zod_1 = require("zod");
exports.createDepartmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().max(500).optional().or(zod_1.z.literal("")),
    code: zod_1.z.string().min(1).max(20).optional().or(zod_1.z.literal("")),
});
exports.updateDepartmentSchema = exports.createDepartmentSchema.partial();
exports.assignDoctorSchema = zod_1.z.object({
    doctorId: zod_1.z.string().uuid("Invalid doctor ID"),
});
//# sourceMappingURL=department.validator.js.map