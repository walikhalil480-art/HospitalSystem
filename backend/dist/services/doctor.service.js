"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctor = exports.updateDoctor = exports.createDoctor = exports.getDoctorById = exports.listDoctors = void 0;
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../errors/AppError");
const password_1 = require("../utils/password");
const doctor_repository_1 = require("../repositories/doctor.repository");
const doctorRepository = new doctor_repository_1.DoctorRepository(prisma_1.prisma);
const listDoctors = async ({ page = 1, limit = 10, search, departmentId, status, availability }) => {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.min(100, Math.max(1, limit));
    const skip = (pageNumber - 1) * limitNumber;
    const where = {
        deletedAt: null,
        user: {
            role: { in: ["DOCTOR"] },
            deletedAt: null,
            ...(search
                ? {
                    OR: [
                        { firstName: { contains: search, mode: "insensitive" } },
                        { lastName: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                        { phone: { contains: search, mode: "insensitive" } },
                    ],
                }
                : {}),
        },
        ...(departmentId ? { departmentId } : {}),
        ...(status ? { employmentStatus: status } : {}),
        ...(availability ? { availability: availability } : {}),
    };
    const { doctors, total } = await doctorRepository.list({ skip, take: limitNumber, where });
    return {
        doctors,
        pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        },
    };
};
exports.listDoctors = listDoctors;
const getDoctorById = async (id) => {
    const doctor = await doctorRepository.findById(id);
    if (!doctor)
        throw new AppError_1.NotFoundError("Doctor not found");
    return doctor;
};
exports.getDoctorById = getDoctorById;
const createDoctor = async (payload, actorId) => {
    const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: payload.email } });
    if (existingUser)
        throw new AppError_1.ConflictError("A user with this email already exists");
    if (payload.departmentId) {
        const department = await prisma_1.prisma.department.findUnique({ where: { id: payload.departmentId } });
        if (!department)
            throw new AppError_1.BadRequestError("Department not found");
    }
    const hashedPassword = await (0, password_1.hashPassword)("Doctor@123");
    return prisma_1.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email: payload.email,
                password: hashedPassword,
                firstName: payload.firstName,
                lastName: payload.lastName,
                phone: payload.phone,
                role: "DOCTOR",
                createdBy: actorId,
            },
        });
        return doctorRepository.create({
            user: { connect: { id: user.id } },
            department: payload.departmentId ? { connect: { id: payload.departmentId } } : undefined,
            specialization: payload.specialization,
            qualifications: payload.qualifications,
            licenseNumber: payload.licenseNumber,
            schedule: payload.schedule,
            consultationFee: payload.consultationFee,
            bio: payload.bio,
            employmentStatus: payload.employmentStatus ?? "ACTIVE",
            availability: payload.availability ?? "AVAILABLE",
            photoUrl: payload.photoUrl,
            createdBy: actorId,
        }, tx);
    });
};
exports.createDoctor = createDoctor;
const updateDoctor = async (id, payload, actorId) => {
    const existing = await doctorRepository.findById(id);
    if (!existing)
        throw new AppError_1.NotFoundError("Doctor not found");
    if (payload.departmentId) {
        const department = await prisma_1.prisma.department.findUnique({ where: { id: payload.departmentId } });
        if (!department)
            throw new AppError_1.BadRequestError("Department not found");
    }
    return prisma_1.prisma.$transaction(async (tx) => {
        if (payload.firstName || payload.lastName || payload.phone) {
            await tx.user.update({
                where: { id: existing.userId },
                data: {
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    phone: payload.phone,
                    updatedBy: actorId,
                },
            });
        }
        return doctorRepository.update(id, {
            department: payload.departmentId !== undefined ? (payload.departmentId ? { connect: { id: payload.departmentId } } : { disconnect: true }) : undefined,
            specialization: payload.specialization,
            qualifications: payload.qualifications,
            licenseNumber: payload.licenseNumber,
            schedule: payload.schedule,
            consultationFee: payload.consultationFee,
            bio: payload.bio,
            employmentStatus: payload.employmentStatus,
            availability: payload.availability,
            photoUrl: payload.photoUrl,
            updatedBy: actorId,
        });
    });
};
exports.updateDoctor = updateDoctor;
const deleteDoctor = async (id, actorId) => {
    const doctor = await doctorRepository.findById(id);
    if (!doctor)
        throw new AppError_1.NotFoundError("Doctor not found");
    await doctorRepository.deactivate(id, actorId);
    return true;
};
exports.deleteDoctor = deleteDoctor;
//# sourceMappingURL=doctor.service.js.map