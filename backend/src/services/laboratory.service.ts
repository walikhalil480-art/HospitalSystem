import { Prisma, LaboratoryOrderPriority, LaboratoryOrderStatus, LaboratoryResultStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { BadRequestError, ConflictError, NotFoundError } from "../errors/AppError";
import { LaboratoryRepository } from "../repositories/laboratory.repository";

const laboratoryRepository = new LaboratoryRepository(prisma);

interface LaboratoryOrderListParams {
  page?: number;
  limit?: number;
  search?: string;
  patientId?: string;
  doctorId?: string;
  status?: LaboratoryOrderStatus;
  priority?: LaboratoryOrderPriority;
  date?: string;
}

const buildOrderNumber = async () => {
  const count = await prisma.laboratoryOrder.count({ where: { deletedAt: null } });
  return `LAB-${String(count + 1).padStart(4, "0")}`;
};

export const listLaboratoryCategories = async ({ page = 1, limit = 10, search }: { page?: number; limit?: number; search?: string } = {}) => {
  const pageNumber = Math.max(1, page);
  const limitNumber = Math.min(100, Math.max(1, limit));
  const skip = (pageNumber - 1) * limitNumber;
  const where: Prisma.LaboratoryCategoryWhereInput = {
    deletedAt: null,
    ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
  };
  const { categories, total } = await laboratoryRepository.listCategories({ skip, take: limitNumber, where });
  return { categories, pagination: { total, page: pageNumber, limit: limitNumber, totalPages: Math.ceil(total / limitNumber) } };
};

export const createLaboratoryCategory = async (payload: { name: string; description?: string }, actorId?: string) => {
  const existing = await prisma.laboratoryCategory.findFirst({ where: { name: payload.name, deletedAt: null } });
  if (existing) throw new ConflictError("Laboratory category already exists");
  return laboratoryRepository.createCategory({ name: payload.name, description: payload.description, createdBy: actorId, updatedBy: actorId });
};

export const listLaboratoryTests = async ({ page = 1, limit = 10, search, categoryId }: { page?: number; limit?: number; search?: string; categoryId?: string } = {}) => {
  const pageNumber = Math.max(1, page);
  const limitNumber = Math.min(100, Math.max(1, limit));
  const skip = (pageNumber - 1) * limitNumber;
  const where: Prisma.LaboratoryTestWhereInput = {
    deletedAt: null,
    ...(categoryId ? { laboratoryCategoryId: categoryId } : {}),
    ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
  };
  const { tests, total } = await laboratoryRepository.listTests({ skip, take: limitNumber, where });
  return { tests, pagination: { total, page: pageNumber, limit: limitNumber, totalPages: Math.ceil(total / limitNumber) } };
};

export const createLaboratoryTest = async (payload: { name: string; laboratoryCategoryId: string; description?: string; referenceRange?: string }, actorId?: string) => {
  const category = await prisma.laboratoryCategory.findFirst({ where: { id: payload.laboratoryCategoryId, deletedAt: null } });
  if (!category) throw new NotFoundError("Laboratory category not found");
  const existing = await prisma.laboratoryTest.findFirst({ where: { name: payload.name, deletedAt: null } });
  if (existing) throw new ConflictError("Laboratory test already exists");
  return laboratoryRepository.createTest({ name: payload.name, laboratoryCategory: { connect: { id: payload.laboratoryCategoryId } }, description: payload.description, referenceRange: payload.referenceRange, createdBy: actorId, updatedBy: actorId });
};

export const listLaboratoryOrders = async ({ page = 1, limit = 10, search, patientId, doctorId, status, priority, date }: LaboratoryOrderListParams) => {
  const pageNumber = Math.max(1, page);
  const limitNumber = Math.min(100, Math.max(1, limit));
  const skip = (pageNumber - 1) * limitNumber;

  const where: Prisma.LaboratoryOrderWhereInput = {
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

export const getLaboratoryOrderById = async (id: string) => {
  const order = await laboratoryRepository.findOrderById(id);
  if (!order) throw new NotFoundError("Laboratory order not found");
  return order;
};

export const createLaboratoryOrder = async (payload: {
  patientId: string;
  doctorId: string;
  appointmentId: string;
  medicalRecordId: string;
  laboratoryCategoryId: string;
  laboratoryTestId: string;
  priority?: LaboratoryOrderPriority;
  status?: LaboratoryOrderStatus;
  clinicalNotes?: string;
}, actorId?: string) => {
  const patient = await prisma.patient.findFirst({ where: { id: payload.patientId, deletedAt: null, isActive: true } });
  if (!patient) throw new NotFoundError("Patient not found or inactive");

  const doctor = await prisma.staff.findFirst({ where: { id: payload.doctorId, deletedAt: null, isActive: true } });
  if (!doctor) throw new NotFoundError("Doctor not found or inactive");

  const appointment = await prisma.appointment.findFirst({ where: { id: payload.appointmentId, deletedAt: null } });
  if (!appointment) throw new NotFoundError("Appointment not found");

  const medicalRecord = await prisma.medicalRecord.findFirst({ where: { id: payload.medicalRecordId, deletedAt: null } });
  if (!medicalRecord) throw new NotFoundError("Medical record not found");

  const category = await prisma.laboratoryCategory.findFirst({ where: { id: payload.laboratoryCategoryId, deletedAt: null } });
  if (!category) throw new NotFoundError("Laboratory category not found");

  const test = await prisma.laboratoryTest.findFirst({ where: { id: payload.laboratoryTestId, deletedAt: null } });
  if (!test) throw new NotFoundError("Laboratory test not found");

  if (appointment.patientId !== payload.patientId || appointment.doctorId !== payload.doctorId || medicalRecord.appointmentId !== payload.appointmentId) {
    throw new BadRequestError("Appointment and medical record do not match the selected patient and doctor");
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
    priority: payload.priority ?? LaboratoryOrderPriority.NORMAL,
    status: payload.status ?? LaboratoryOrderStatus.PENDING,
    clinicalNotes: payload.clinicalNotes,
    createdBy: actorId,
    updatedBy: actorId,
  });
};

export const updateLaboratoryOrder = async (id: string, payload: {
  patientId?: string;
  doctorId?: string;
  appointmentId?: string;
  medicalRecordId?: string;
  laboratoryCategoryId?: string;
  laboratoryTestId?: string;
  priority?: LaboratoryOrderPriority;
  status?: LaboratoryOrderStatus;
  clinicalNotes?: string | null;
  collectedDate?: string | null;
  completedDate?: string | null;
}, actorId?: string) => {
  const existing = await laboratoryRepository.findOrderById(id);
  if (!existing) throw new NotFoundError("Laboratory order not found");

  const data: Prisma.LaboratoryOrderUpdateInput = {
    priority: payload.priority,
    status: payload.status,
    clinicalNotes: payload.clinicalNotes,
    collectedDate: payload.collectedDate ? new Date(payload.collectedDate) : undefined,
    completedDate: payload.completedDate ? new Date(payload.completedDate) : undefined,
    updatedBy: actorId,
  };

  if (payload.patientId) data.patient = { connect: { id: payload.patientId } };
  if (payload.doctorId) data.doctor = { connect: { id: payload.doctorId } };
  if (payload.appointmentId) data.appointment = { connect: { id: payload.appointmentId } };
  if (payload.medicalRecordId) data.medicalRecord = { connect: { id: payload.medicalRecordId } };
  if (payload.laboratoryCategoryId) data.laboratoryCategory = { connect: { id: payload.laboratoryCategoryId } };
  if (payload.laboratoryTestId) data.laboratoryTest = { connect: { id: payload.laboratoryTestId } };

  return laboratoryRepository.updateOrder(id, data);
};

export const deleteLaboratoryOrder = async (id: string) => {
  const existing = await laboratoryRepository.findOrderById(id);
  if (!existing) throw new NotFoundError("Laboratory order not found");
  return laboratoryRepository.softDeleteOrder(id);
};

export const createLaboratoryResult = async (orderId: string, payload: { resultValue?: string; referenceRange?: string; interpretation?: string; technicianNotes?: string; attachment?: string; status?: LaboratoryResultStatus }, actorId?: string) => {
  const order = await laboratoryRepository.findOrderById(orderId);
  if (!order) throw new NotFoundError("Laboratory order not found");

  const existingResult = await laboratoryRepository.findResultByOrderId(orderId);
  if (existingResult) throw new ConflictError("A laboratory result already exists for this order");

  return laboratoryRepository.createResult({
    laboratoryOrder: { connect: { id: orderId } },
    resultValue: payload.resultValue,
    referenceRange: payload.referenceRange,
    interpretation: payload.interpretation,
    technicianNotes: payload.technicianNotes,
    attachment: payload.attachment,
    status: payload.status ?? LaboratoryResultStatus.ENTERED,
    createdBy: actorId,
    updatedBy: actorId,
  });
};

export const updateLaboratoryResult = async (orderId: string, payload: { resultValue?: string | null; referenceRange?: string | null; interpretation?: string | null; technicianNotes?: string | null; attachment?: string | null; status?: LaboratoryResultStatus }, actorId?: string) => {
  const existingResult = await laboratoryRepository.findResultByOrderId(orderId);
  if (!existingResult) throw new NotFoundError("Laboratory result not found");

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
