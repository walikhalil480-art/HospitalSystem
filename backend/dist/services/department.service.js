"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartmentStats = exports.assignDoctorToDepartment = exports.deleteDepartment = exports.updateDepartment = exports.createDepartment = exports.getDepartmentById = exports.listDepartments = void 0;
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../errors/AppError");
const department_repository_1 = require("../repositories/department.repository");
const departmentRepository = new department_repository_1.DepartmentRepository(prisma_1.prisma);
const listDepartments = async ({ page = 1, limit = 10, search }) => {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.min(100, Math.max(1, limit));
    const skip = (pageNumber - 1) * limitNumber;
    const where = {
        deletedAt: null,
        ...(search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                    { code: { contains: search, mode: "insensitive" } },
                ],
            }
            : {}),
    };
    const { departments, total } = await departmentRepository.list({ skip, take: limitNumber, where });
    return {
        departments,
        pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        },
    };
};
exports.listDepartments = listDepartments;
const getDepartmentById = async (id) => {
    const department = await departmentRepository.findById(id);
    if (!department)
        throw new AppError_1.NotFoundError("Department not found");
    return department;
};
exports.getDepartmentById = getDepartmentById;
const createDepartment = async (payload, actorId) => {
    const existing = await prisma_1.prisma.department.findFirst({ where: { OR: [{ name: payload.name }, ...(payload.code ? [{ code: payload.code }] : [])] } });
    if (existing)
        throw new AppError_1.ConflictError("Department with this name or code already exists");
    return departmentRepository.create({
        name: payload.name,
        description: payload.description,
        code: payload.code,
        createdBy: actorId,
    });
};
exports.createDepartment = createDepartment;
const updateDepartment = async (id, payload, actorId) => {
    const existing = await departmentRepository.findById(id);
    if (!existing)
        throw new AppError_1.NotFoundError("Department not found");
    if (payload.name || payload.code) {
        const duplicate = await prisma_1.prisma.department.findFirst({
            where: {
                OR: [
                    ...(payload.name ? [{ name: payload.name }] : []),
                    ...(payload.code ? [{ code: payload.code }] : []),
                ],
                NOT: { id },
            },
        });
        if (duplicate)
            throw new AppError_1.ConflictError("Department with this name or code already exists");
    }
    return departmentRepository.update(id, {
        name: payload.name,
        description: payload.description,
        code: payload.code,
        updatedBy: actorId,
    });
};
exports.updateDepartment = updateDepartment;
const deleteDepartment = async (id, actorId) => {
    const existing = await departmentRepository.findById(id);
    if (!existing)
        throw new AppError_1.NotFoundError("Department not found");
    await departmentRepository.deactivate(id, actorId);
    return true;
};
exports.deleteDepartment = deleteDepartment;
const assignDoctorToDepartment = async (departmentId, doctorId, actorId) => {
    const department = await departmentRepository.findById(departmentId);
    if (!department)
        throw new AppError_1.NotFoundError("Department not found");
    const doctor = await prisma_1.prisma.staff.findUnique({ where: { id: doctorId } });
    if (!doctor)
        throw new AppError_1.NotFoundError("Doctor not found");
    return departmentRepository.assignDoctor(departmentId, doctorId);
};
exports.assignDoctorToDepartment = assignDoctorToDepartment;
const getDepartmentStats = async () => {
    const [totalDepartments, activeDepartments, doctorsByDepartment] = await Promise.all([
        prisma_1.prisma.department.count({ where: { deletedAt: null } }),
        prisma_1.prisma.department.count({ where: { deletedAt: null, isActive: true } }),
        prisma_1.prisma.department.findMany({
            where: { deletedAt: null },
            select: { id: true, name: true, _count: { select: { staff: true } } },
            orderBy: { name: "asc" },
        }),
    ]);
    return {
        totalDepartments,
        activeDepartments,
        departments: doctorsByDepartment,
    };
};
exports.getDepartmentStats = getDepartmentStats;
//# sourceMappingURL=department.service.js.map