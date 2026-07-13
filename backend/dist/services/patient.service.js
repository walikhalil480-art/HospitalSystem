"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatient = exports.createPatient = exports.getPatientById = exports.listPatients = void 0;
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../errors/AppError");
const password_1 = require("../utils/password");
const listPatients = async ({ page = 1, limit = 10, search }) => {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.min(100, Math.max(1, limit));
    const skip = (pageNumber - 1) * limitNumber;
    const whereClause = {
        deletedAt: null,
        isActive: true,
        ...(search
            ? {
                OR: [
                    { patientNumber: { contains: search, mode: "insensitive" } },
                    { user: { OR: [{ firstName: { contains: search, mode: "insensitive" } }, { lastName: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] } },
                ],
            }
            : {}),
    };
    const [patients, total] = await Promise.all([
        prisma_1.prisma.patient.findMany({
            where: whereClause,
            include: {
                user: {
                    select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, isActive: true },
                },
            },
            skip,
            take: limitNumber,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.prisma.patient.count({ where: whereClause }),
    ]);
    return {
        patients,
        pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        },
    };
};
exports.listPatients = listPatients;
const getPatientById = async (id) => {
    const patient = await prisma_1.prisma.patient.findFirst({
        where: { id, deletedAt: null, isActive: true },
        include: {
            user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true } },
            appointments: {
                take: 10,
                orderBy: { appointmentDate: "desc" },
                include: { doctor: { include: { user: { select: { firstName: true, lastName: true } } } } },
            },
            medicalRecords: { take: 10, orderBy: { createdAt: "desc" } },
            invoices: { take: 10, orderBy: { createdAt: "desc" } },
        },
    });
    if (!patient)
        throw new AppError_1.NotFoundError("Patient not found");
    return patient;
};
exports.getPatientById = getPatientById;
const createPatient = async (payload, actorId) => {
    const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: payload.email } });
    if (existingUser)
        throw new AppError_1.BadRequestError("User with this email already exists");
    const hashedPassword = await (0, password_1.hashPassword)("Patient@123");
    return prisma_1.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email: payload.email,
                password: hashedPassword,
                firstName: payload.firstName,
                lastName: payload.lastName,
                phone: payload.phone,
                role: "PATIENT",
                createdBy: actorId,
            },
        });
        return tx.patient.create({
            data: {
                userId: user.id,
                dateOfBirth: new Date(payload.dateOfBirth),
                gender: payload.gender,
                bloodGroup: payload.bloodGroup,
                address: payload.address,
                emergencyContact: payload.emergencyContact,
                emergencyPhone: payload.emergencyPhone,
                allergies: payload.allergies,
                insuranceDetails: payload.insuranceDetails,
                medicalNotes: payload.medicalNotes,
                createdBy: actorId,
            },
            include: {
                user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true } },
            },
        });
    });
};
exports.createPatient = createPatient;
const updatePatient = async (id, payload, actorId) => {
    const existingPatient = await prisma_1.prisma.patient.findFirst({ where: { id, deletedAt: null } });
    if (!existingPatient)
        throw new AppError_1.NotFoundError("Patient not found");
    return prisma_1.prisma.$transaction(async (tx) => {
        if (payload.firstName || payload.lastName || payload.phone) {
            await tx.user.update({
                where: { id: existingPatient.userId },
                data: {
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    phone: payload.phone,
                    updatedBy: actorId,
                },
            });
        }
        return tx.patient.update({
            where: { id },
            data: {
                dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : undefined,
                gender: payload.gender,
                bloodGroup: payload.bloodGroup,
                address: payload.address,
                emergencyContact: payload.emergencyContact,
                emergencyPhone: payload.emergencyPhone,
                allergies: payload.allergies,
                insuranceDetails: payload.insuranceDetails,
                medicalNotes: payload.medicalNotes,
                updatedBy: actorId,
            },
            include: {
                user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true } },
            },
        });
    });
};
exports.updatePatient = updatePatient;
const deletePatient = async (id, actorId) => {
    const patient = await prisma_1.prisma.patient.findFirst({ where: { id, deletedAt: null } });
    if (!patient)
        throw new AppError_1.NotFoundError("Patient not found");
    await prisma_1.prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: patient.userId },
            data: { isActive: false, deletedAt: new Date(), updatedBy: actorId },
        });
        await tx.patient.update({
            where: { id },
            data: { isActive: false, deletedAt: new Date(), updatedBy: actorId },
        });
    });
    return true;
};
exports.deletePatient = deletePatient;
//# sourceMappingURL=patient.service.js.map