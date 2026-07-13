import { Prisma, AppointmentStatus, ConsultationType, AppointmentPriority } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { BadRequestError, ConflictError, NotFoundError } from "../errors/AppError";
import { AppointmentRepository } from "../repositories/appointment.repository";

const appointmentRepository = new AppointmentRepository(prisma);

interface AppointmentListParams {
  page?: number;
  limit?: number;
  search?: string;
  doctorId?: string;
  patientId?: string;
  departmentId?: string;
  date?: string;
  status?: AppointmentStatus;
  today?: boolean;
}

const WORK_START_HOUR = 8;
const WORK_END_HOUR = 17;

const parseTimeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const buildAppointmentNumber = async () => {
  const count = await prisma.appointment.count({ where: { deletedAt: null } });
  return `APT-${String(count + 1).padStart(4, "0")}`;
};

const buildQueueNumber = async (appointmentDate: Date) => {
  const dayStart = new Date(appointmentDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(appointmentDate);
  dayEnd.setHours(23, 59, 59, 999);

  const count = await prisma.appointment.count({
    where: { appointmentDate: { gte: dayStart, lt: dayEnd }, deletedAt: null },
  });

  return count + 1;
};

const normalizeTimeRange = (appointmentDate: Date, startTime: string, endTime: string) => {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (startMinutes < WORK_START_HOUR * 60 || endMinutes > WORK_END_HOUR * 60 || startMinutes >= endMinutes) {
    throw new BadRequestError("Appointments must be scheduled within working hours and end after the start time");
  }

  return { startMinutes, endMinutes };
};

export const listAppointments = async ({ page = 1, limit = 10, search, doctorId, patientId, departmentId, date, status, today }: AppointmentListParams) => {
  const pageNumber = Math.max(1, page);
  const limitNumber = Math.min(100, Math.max(1, limit));
  const skip = (pageNumber - 1) * limitNumber;

  const where: Prisma.AppointmentWhereInput = {
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

export const getAppointmentById = async (id: string) => {
  const appointment = await appointmentRepository.findById(id);
  if (!appointment) throw new NotFoundError("Appointment not found");
  return appointment;
};

export const createAppointment = async (payload: {
  patientId: string;
  doctorId: string;
  departmentId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  consultationType?: ConsultationType;
  priority?: AppointmentPriority;
  reasonForVisit?: string;
  symptoms?: string;
  notes?: string;
}, actorId?: string) => {
  const patient = await prisma.patient.findFirst({ where: { id: payload.patientId, deletedAt: null, isActive: true } });
  if (!patient) throw new NotFoundError("Patient not found or inactive");

  const doctor = await prisma.staff.findFirst({ where: { id: payload.doctorId, deletedAt: null, isActive: true, user: { role: "DOCTOR" } } });
  if (!doctor) throw new NotFoundError("Doctor not found or inactive");

  const department = await prisma.department.findFirst({ where: { id: payload.departmentId, deletedAt: null, isActive: true } });
  if (!department) throw new NotFoundError("Department not found or inactive");

  const appointmentDate = new Date(payload.appointmentDate);
  const { startMinutes, endMinutes } = normalizeTimeRange(appointmentDate, payload.startTime, payload.endTime);

  const overlap = await prisma.appointment.findFirst({
    where: {
      doctorId: payload.doctorId,
      deletedAt: null,
      status: { notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW] },
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

  if (overlap) throw new ConflictError("The selected doctor already has an overlapping appointment");

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
    consultationType: payload.consultationType ?? ConsultationType.IN_PERSON,
    priority: payload.priority ?? AppointmentPriority.NORMAL,
    reasonForVisit: payload.reasonForVisit,
    symptoms: payload.symptoms,
    notes: payload.notes,
    queueNumber,
    ...(actorId ? { createdByUser: { connect: { id: actorId } } } : {}),
  });
};

export const updateAppointment = async (id: string, payload: {
  patientId?: string;
  doctorId?: string;
  departmentId?: string;
  appointmentDate?: string;
  startTime?: string;
  endTime?: string;
  consultationType?: ConsultationType;
  priority?: AppointmentPriority;
  status?: AppointmentStatus;
  reasonForVisit?: string | null;
  symptoms?: string | null;
  notes?: string | null;
}, actorId?: string) => {
  const existing = await appointmentRepository.findById(id);
  if (!existing) throw new NotFoundError("Appointment not found");

  const data: Prisma.AppointmentUpdateInput = {
    status: payload.status,
    reasonForVisit: payload.reasonForVisit,
    symptoms: payload.symptoms,
    notes: payload.notes,
    ...(actorId ? { updatedByUser: { connect: { id: actorId } } } : {}),
  };

  if (payload.patientId) data.patient = { connect: { id: payload.patientId } };
  if (payload.doctorId) data.doctor = { connect: { id: payload.doctorId } };
  if (payload.departmentId) data.department = { connect: { id: payload.departmentId } };
  if (payload.appointmentDate) data.appointmentDate = new Date(payload.appointmentDate);
  if (payload.startTime) data.startTime = payload.startTime;
  if (payload.endTime) data.endTime = payload.endTime;
  if (payload.consultationType) data.consultationType = payload.consultationType;
  if (payload.priority) data.priority = payload.priority;

  return appointmentRepository.update(id, data);
};

export const cancelAppointment = async (id: string, actorId?: string) => {
  const existing = await appointmentRepository.findById(id);
  if (!existing) throw new NotFoundError("Appointment not found");
  return appointmentRepository.cancel(id, actorId);
};

export const deleteAppointment = async (id: string) => {
  const existing = await appointmentRepository.findById(id);
  if (!existing) throw new NotFoundError("Appointment not found");
  return appointmentRepository.delete(id);
};

export const getAppointmentStats = async () => {
  return appointmentRepository.getTodayStats();
};
