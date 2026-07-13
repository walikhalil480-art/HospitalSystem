"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppointmentStats = exports.deleteAppointment = exports.cancelAppointment = exports.updateAppointment = exports.createAppointment = exports.getAppointmentById = exports.listAppointments = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../errors/AppError");
const appointment_repository_1 = require("../repositories/appointment.repository");
const appointmentRepository = new appointment_repository_1.AppointmentRepository(prisma_1.prisma);
const WORK_START_HOUR = 8;
const WORK_END_HOUR = 17;
const parseTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};
const buildAppointmentNumber = async () => {
    const count = await prisma_1.prisma.appointment.count({ where: { deletedAt: null } });
    return `APT-${String(count + 1).padStart(4, "0")}`;
};
const buildQueueNumber = async (appointmentDate) => {
    const dayStart = new Date(appointmentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(appointmentDate);
    dayEnd.setHours(23, 59, 59, 999);
    const count = await prisma_1.prisma.appointment.count({
        where: { appointmentDate: { gte: dayStart, lt: dayEnd }, deletedAt: null },
    });
    return count + 1;
};
const normalizeTimeRange = (appointmentDate, startTime, endTime) => {
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    if (startMinutes < WORK_START_HOUR * 60 || endMinutes > WORK_END_HOUR * 60 || startMinutes >= endMinutes) {
        throw new AppError_1.BadRequestError("Appointments must be scheduled within working hours and end after the start time");
    }
    return { startMinutes, endMinutes };
};
const listAppointments = async ({ page = 1, limit = 10, search, doctorId, patientId, departmentId, date, status, today }) => {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.min(100, Math.max(1, limit));
    const skip = (pageNumber - 1) * limitNumber;
    const where = {
        deletedAt: null,
        ...(status ? { status } : {}),
        ...(doctorId ? { doctorId } : {}),
        ...(patientId ? { patientId } : {}),
        ...(departmentId ? { departmentId } : {}),
        ...(today ? {
            appointmentDate: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
        } : {}),
        ...(date ? {
            appointmentDate: {
                gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
                lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
            },
        } : {}),
        ...(search ? {
            OR: [
                { reasonForVisit: { contains: search, mode: "insensitive" } },
                { symptoms: { contains: search, mode: "insensitive" } },
                { appointmentNumber: { contains: search, mode: "insensitive" } },
                { patient: { user: { OR: [{ firstName: { contains: search, mode: "insensitive" } }, { lastName: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] } } },
            ],
        } : {}),
    };
    const { appointments, total } = await appointmentRepository.list({ skip, take: limitNumber, where, orderBy: { appointmentDate: "asc" } });
    return {
        appointments,
        pagination: { total, page: pageNumber, limit: limitNumber, totalPages: Math.ceil(total / limitNumber) },
    };
};
exports.listAppointments = listAppointments;
const getAppointmentById = async (id) => {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment)
        throw new AppError_1.NotFoundError("Appointment not found");
    return appointment;
};
exports.getAppointmentById = getAppointmentById;
const createAppointment = async (payload, actorId) => {
    const patient = await prisma_1.prisma.patient.findFirst({ where: { id: payload.patientId, deletedAt: null, isActive: true } });
    if (!patient)
        throw new AppError_1.NotFoundError("Patient not found or inactive");
    const doctor = await prisma_1.prisma.staff.findFirst({ where: { id: payload.doctorId, deletedAt: null, isActive: true, user: { role: "DOCTOR" } } });
    if (!doctor)
        throw new AppError_1.NotFoundError("Doctor not found or inactive");
    const department = await prisma_1.prisma.department.findFirst({ where: { id: payload.departmentId, deletedAt: null, isActive: true } });
    if (!department)
        throw new AppError_1.NotFoundError("Department not found or inactive");
    const appointmentDate = new Date(payload.appointmentDate);
    const { startMinutes, endMinutes } = normalizeTimeRange(appointmentDate, payload.startTime, payload.endTime);
    const overlap = await prisma_1.prisma.appointment.findFirst({
        where: {
            doctorId: payload.doctorId,
            deletedAt: null,
            status: { notIn: [client_1.AppointmentStatus.CANCELLED, client_1.AppointmentStatus.NO_SHOW] },
            appointmentDate: {
                gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
                lt: new Date(appointmentDate.setHours(23, 59, 59, 999)),
            },
            OR: [
                {
                    AND: [
                        { startTime: { lte: payload.startTime } },
                        { endTime: { gt: payload.startTime } },
                    ],
                },
                {
                    AND: [
                        { startTime: { lt: payload.endTime } },
                        { endTime: { gte: payload.endTime } },
                    ],
                },
            ],
        },
    });
    if (overlap)
        throw new AppError_1.ConflictError("The selected doctor already has an overlapping appointment");
    const appointmentNumber = await buildAppointmentNumber();
    const queueNumber = await buildQueueNumber(appointmentDate);
    const durationMinutes = endMinutes - startMinutes;
    return appointmentRepository.create({
        appointmentNumber,
        patient: { connect: { id: payload.patientId } },
        doctor: { connect: { id: payload.doctorId } },
        department: { connect: { id: payload.departmentId } },
        appointmentDate,
        startTime: payload.startTime,
        endTime: payload.endTime,
        durationMinutes,
        consultationType: payload.consultationType ?? client_1.ConsultationType.IN_PERSON,
        priority: payload.priority ?? client_1.AppointmentPriority.NORMAL,
        reasonForVisit: payload.reasonForVisit,
        symptoms: payload.symptoms,
        notes: payload.notes,
        queueNumber,
        ...(actorId ? { createdByUser: { connect: { id: actorId } } } : {}),
    });
};
exports.createAppointment = createAppointment;
const updateAppointment = async (id, payload, actorId) => {
    const existing = await appointmentRepository.findById(id);
    if (!existing)
        throw new AppError_1.NotFoundError("Appointment not found");
    const data = {
        status: payload.status,
        reasonForVisit: payload.reasonForVisit,
        symptoms: payload.symptoms,
        notes: payload.notes,
        ...(actorId ? { updatedByUser: { connect: { id: actorId } } } : {}),
    };
    if (payload.patientId)
        data.patient = { connect: { id: payload.patientId } };
    if (payload.doctorId)
        data.doctor = { connect: { id: payload.doctorId } };
    if (payload.departmentId)
        data.department = { connect: { id: payload.departmentId } };
    if (payload.appointmentDate)
        data.appointmentDate = new Date(payload.appointmentDate);
    if (payload.startTime)
        data.startTime = payload.startTime;
    if (payload.endTime)
        data.endTime = payload.endTime;
    if (payload.consultationType)
        data.consultationType = payload.consultationType;
    if (payload.priority)
        data.priority = payload.priority;
    return appointmentRepository.update(id, data);
};
exports.updateAppointment = updateAppointment;
const cancelAppointment = async (id, actorId) => {
    const existing = await appointmentRepository.findById(id);
    if (!existing)
        throw new AppError_1.NotFoundError("Appointment not found");
    return appointmentRepository.cancel(id, actorId);
};
exports.cancelAppointment = cancelAppointment;
const deleteAppointment = async (id) => {
    const existing = await appointmentRepository.findById(id);
    if (!existing)
        throw new AppError_1.NotFoundError("Appointment not found");
    return appointmentRepository.delete(id);
};
exports.deleteAppointment = deleteAppointment;
const getAppointmentStats = async () => {
    return appointmentRepository.getTodayStats();
};
exports.getAppointmentStats = getAppointmentStats;
//# sourceMappingURL=appointment.service.js.map