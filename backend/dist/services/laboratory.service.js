"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLaboratoryResult = exports.createLaboratoryResult = exports.deleteLaboratoryOrder = exports.updateLaboratoryOrder = exports.createLaboratoryOrder = exports.getLaboratoryOrderById = exports.listLaboratoryOrders = exports.createLaboratoryTest = exports.listLaboratoryTests = exports.createLaboratoryCategory = exports.listLaboratoryCategories = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../errors/AppError");
const laboratory_repository_1 = require("../repositories/laboratory.repository");
const laboratoryRepository = new laboratory_repository_1.LaboratoryRepository(prisma_1.prisma);
const buildOrderNumber = async () => {
    const count = await prisma_1.prisma.laboratoryOrder.count({ where: { deletedAt: null } });
    return `LAB-${String(count + 1).padStart(4, "0")}`;
};
const listLaboratoryCategories = async ({ page = 1, limit = 10, search } = {}) => {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.min(100, Math.max(1, limit));
    const skip = (pageNumber - 1) * limitNumber;
    const where = {
        deletedAt: null,
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    };
    const { categories, total } = await laboratoryRepository.listCategories({ skip, take: limitNumber, where });
    return { categories, pagination: { total, page: pageNumber, limit: limitNumber, totalPages: Math.ceil(total / limitNumber) } };
};
exports.listLaboratoryCategories = listLaboratoryCategories;
const createLaboratoryCategory = async (payload, actorId) => {
    const existing = await prisma_1.prisma.laboratoryCategory.findFirst({ where: { name: payload.name, deletedAt: null } });
    if (existing)
        throw new AppError_1.ConflictError("Laboratory category already exists");
    return laboratoryRepository.createCategory({ name: payload.name, description: payload.description, createdBy: actorId, updatedBy: actorId });
};
exports.createLaboratoryCategory = createLaboratoryCategory;
const listLaboratoryTests = async ({ page = 1, limit = 10, search, categoryId } = {}) => {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.min(100, Math.max(1, limit));
    const skip = (pageNumber - 1) * limitNumber;
    const where = {
        deletedAt: null,
        ...(categoryId ? { laboratoryCategoryId: categoryId } : {}),
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    };
    const { tests, total } = await laboratoryRepository.listTests({ skip, take: limitNumber, where });
    return { tests, pagination: { total, page: pageNumber, limit: limitNumber, totalPages: Math.ceil(total / limitNumber) } };
};
exports.listLaboratoryTests = listLaboratoryTests;
const createLaboratoryTest = async (payload, actorId) => {
    const category = await prisma_1.prisma.laboratoryCategory.findFirst({ where: { id: payload.laboratoryCategoryId, deletedAt: null } });
    if (!category)
        throw new AppError_1.NotFoundError("Laboratory category not found");
    const existing = await prisma_1.prisma.laboratoryTest.findFirst({ where: { name: payload.name, deletedAt: null } });
    if (existing)
        throw new AppError_1.ConflictError("Laboratory test already exists");
    return laboratoryRepository.createTest({ name: payload.name, laboratoryCategory: { connect: { id: payload.laboratoryCategoryId } }, description: payload.description, referenceRange: payload.referenceRange, createdBy: actorId, updatedBy: actorId });
};
exports.createLaboratoryTest = createLaboratoryTest;
const listLaboratoryOrders = async ({ page = 1, limit = 10, search, patientId, doctorId, status, priority, date }) => {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.min(100, Math.max(1, limit));
    const skip = (pageNumber - 1) * limitNumber;
    const where = {
        deletedAt: null,
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(patientId ? { patientId } : {}),
        ...(doctorId ? { doctorId } : {}),
        ...(date ? { orderedDate: { gte: new Date(new Date(date).setHours(0, 0, 0, 0)), lt: new Date(new Date(date).setHours(23, 59, 59, 999)) } } : {}),
        ...(search ? {
            OR: [
                { orderNumber: { contains: search, mode: "insensitive" } },
                { clinicalNotes: { contains: search, mode: "insensitive" } },
                { patient: { user: { OR: [{ firstName: { contains: search, mode: "insensitive" } }, { lastName: { contains: search, mode: "insensitive" } }] } } },
                { doctor: { user: { OR: [{ firstName: { contains: search, mode: "insensitive" } }, { lastName: { contains: search, mode: "insensitive" } }] } } },
            ],
        } : {}),
    };
    const { orders, total } = await laboratoryRepository.listOrders({ skip, take: limitNumber, where, orderBy: { orderedDate: "desc" } });
    return { orders, pagination: { total, page: pageNumber, limit: limitNumber, totalPages: Math.ceil(total / limitNumber) } };
};
exports.listLaboratoryOrders = listLaboratoryOrders;
const getLaboratoryOrderById = async (id) => {
    const order = await laboratoryRepository.findOrderById(id);
    if (!order)
        throw new AppError_1.NotFoundError("Laboratory order not found");
    return order;
};
exports.getLaboratoryOrderById = getLaboratoryOrderById;
const createLaboratoryOrder = async (payload, actorId) => {
    const patient = await prisma_1.prisma.patient.findFirst({ where: { id: payload.patientId, deletedAt: null, isActive: true } });
    if (!patient)
        throw new AppError_1.NotFoundError("Patient not found or inactive");
    const doctor = await prisma_1.prisma.staff.findFirst({ where: { id: payload.doctorId, deletedAt: null, isActive: true } });
    if (!doctor)
        throw new AppError_1.NotFoundError("Doctor not found or inactive");
    const appointment = await prisma_1.prisma.appointment.findFirst({ where: { id: payload.appointmentId, deletedAt: null } });
    if (!appointment)
        throw new AppError_1.NotFoundError("Appointment not found");
    const medicalRecord = await prisma_1.prisma.medicalRecord.findFirst({ where: { id: payload.medicalRecordId, deletedAt: null } });
    if (!medicalRecord)
        throw new AppError_1.NotFoundError("Medical record not found");
    const category = await prisma_1.prisma.laboratoryCategory.findFirst({ where: { id: payload.laboratoryCategoryId, deletedAt: null } });
    if (!category)
        throw new AppError_1.NotFoundError("Laboratory category not found");
    const test = await prisma_1.prisma.laboratoryTest.findFirst({ where: { id: payload.laboratoryTestId, deletedAt: null } });
    if (!test)
        throw new AppError_1.NotFoundError("Laboratory test not found");
    if (appointment.patientId !== payload.patientId || appointment.doctorId !== payload.doctorId || medicalRecord.appointmentId !== payload.appointmentId) {
        throw new AppError_1.BadRequestError("Appointment and medical record do not match the selected patient and doctor");
    }
    const orderNumber = await buildOrderNumber();
    return laboratoryRepository.createOrder({
        orderNumber,
        patient: { connect: { id: payload.patientId } },
        doctor: { connect: { id: payload.doctorId } },
        appointment: { connect: { id: payload.appointmentId } },
        medicalRecord: { connect: { id: payload.medicalRecordId } },
        laboratoryCategory: { connect: { id: payload.laboratoryCategoryId } },
        laboratoryTest: { connect: { id: payload.laboratoryTestId } },
        priority: payload.priority ?? client_1.LaboratoryOrderPriority.NORMAL,
        status: payload.status ?? client_1.LaboratoryOrderStatus.PENDING,
        clinicalNotes: payload.clinicalNotes,
        createdBy: actorId,
        updatedBy: actorId,
    });
};
exports.createLaboratoryOrder = createLaboratoryOrder;
const updateLaboratoryOrder = async (id, payload, actorId) => {
    const existing = await laboratoryRepository.findOrderById(id);
    if (!existing)
        throw new AppError_1.NotFoundError("Laboratory order not found");
    const data = {
        priority: payload.priority,
        status: payload.status,
        clinicalNotes: payload.clinicalNotes,
        collectedDate: payload.collectedDate ? new Date(payload.collectedDate) : undefined,
        completedDate: payload.completedDate ? new Date(payload.completedDate) : undefined,
        updatedBy: actorId,
    };
    if (payload.patientId)
        data.patient = { connect: { id: payload.patientId } };
    if (payload.doctorId)
        data.doctor = { connect: { id: payload.doctorId } };
    if (payload.appointmentId)
        data.appointment = { connect: { id: payload.appointmentId } };
    if (payload.medicalRecordId)
        data.medicalRecord = { connect: { id: payload.medicalRecordId } };
    if (payload.laboratoryCategoryId)
        data.laboratoryCategory = { connect: { id: payload.laboratoryCategoryId } };
    if (payload.laboratoryTestId)
        data.laboratoryTest = { connect: { id: payload.laboratoryTestId } };
    return laboratoryRepository.updateOrder(id, data);
};
exports.updateLaboratoryOrder = updateLaboratoryOrder;
const deleteLaboratoryOrder = async (id) => {
    const existing = await laboratoryRepository.findOrderById(id);
    if (!existing)
        throw new AppError_1.NotFoundError("Laboratory order not found");
    return laboratoryRepository.softDeleteOrder(id);
};
exports.deleteLaboratoryOrder = deleteLaboratoryOrder;
const createLaboratoryResult = async (orderId, payload, actorId) => {
    const order = await laboratoryRepository.findOrderById(orderId);
    if (!order)
        throw new AppError_1.NotFoundError("Laboratory order not found");
    const existingResult = await laboratoryRepository.findResultByOrderId(orderId);
    if (existingResult)
        throw new AppError_1.ConflictError("A laboratory result already exists for this order");
    return laboratoryRepository.createResult({
        laboratoryOrder: { connect: { id: orderId } },
        resultValue: payload.resultValue,
        referenceRange: payload.referenceRange,
        interpretation: payload.interpretation,
        technicianNotes: payload.technicianNotes,
        attachment: payload.attachment,
        status: payload.status ?? client_1.LaboratoryResultStatus.ENTERED,
        createdBy: actorId,
        updatedBy: actorId,
    });
};
exports.createLaboratoryResult = createLaboratoryResult;
const updateLaboratoryResult = async (orderId, payload, actorId) => {
    const existingResult = await laboratoryRepository.findResultByOrderId(orderId);
    if (!existingResult)
        throw new AppError_1.NotFoundError("Laboratory result not found");
    return laboratoryRepository.updateResult(existingResult.id, {
        resultValue: payload.resultValue,
        referenceRange: payload.referenceRange,
        interpretation: payload.interpretation,
        technicianNotes: payload.technicianNotes,
        attachment: payload.attachment,
        status: payload.status,
        updatedBy: actorId,
    });
};
exports.updateLaboratoryResult = updateLaboratoryResult;
//# sourceMappingURL=laboratory.service.js.map