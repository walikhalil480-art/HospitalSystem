import { Prisma, MedicalRecordStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from "../errors/AppError";
import { MedicalRecordRepository } from "../repositories/medical-record.repository";

const medicalRecordRepository = new MedicalRecordRepository(prisma);

interface MedicalRecordListParams {
  page?: number;
  limit?: number;
  search?: string;
  patientId?: string;
  doctorId?: string;
  date?: string;
  status?: MedicalRecordStatus;
}

const buildMedicalRecordNumber = async () => {
  const count = await prisma.medicalRecord.count({ where: { deletedAt: null } });
  return `MR-${String(count + 1).padStart(4, "0")}`;
};

const getActorContext = async (actorId: string) => {
  const actor = await prisma.user.findUnique({
    where: { id: actorId },
    select: { id: true, role: true },
  });

  const actorStaff = await prisma.staff.findFirst({
    where: { userId: actorId, deletedAt: null },
    select: { id: true },
  });

  return { actor, actorStaff };
};

export const listMedicalRecords = async ({ page = 1, limit = 10, search, patientId, doctorId, date, status }: MedicalRecordListParams) => {
  const pageNumber = Math.max(1, page);
  const limitNumber = Math.min(100, Math.max(1, limit));
  const skip = (pageNumber - 1) * limitNumber;

  const where: Prisma.MedicalRecordWhereInput = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(patientId ? { patientId } : {}),
    ...(doctorId ? { doctorId } : {}),
    ...(date ? {
      visitDate: {
        gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
      },
    } : {}),
    ...(search ? {
      OR: [
        { medicalRecordNumber: { contains: search, mode: "insensitive" } },
        { chiefComplaint: { contains: search, mode: "insensitive" } },
        { diagnosis: { contains: search, mode: "insensitive" } },
        { patient: { user: { OR: [{ firstName: { contains: search, mode: "insensitive" } }, { lastName: { contains: search, mode: "insensitive" } }] } } },
      ],
    } : {}),
  };

  const { records, total } = await medicalRecordRepository.list({ skip, take: limitNumber, where, orderBy: { visitDate: "desc" } });

  return {
    records,
    pagination: { total, page: pageNumber, limit: limitNumber, totalPages: Math.ceil(total / limitNumber) },
  };
};

export const getMedicalRecordById = async (id: string) => {
  const record = await medicalRecordRepository.findById(id);
  if (!record) throw new NotFoundError("Medical record not found");
  return record;
};

export const createMedicalRecord = async (
  payload: {
    patientId: string;
    doctorId: string;
    appointmentId: string;
    visitDate: string;
    chiefComplaint?: string;
    symptoms?: string;
    vitalSigns?: Record<string, any>;
    diagnosis?: string;
    differentialDiagnosis?: string;
    treatmentPlan?: string;
    prescriptions?: string[];
    allergies?: string[];
    chronicConditions?: string[];
    immunizations?: string[];
    laboratoryRequests?: string[];
    radiologyRequests?: string[];
    clinicalNotes?: string;
    followUpDate?: string;
    status?: MedicalRecordStatus;
  },
  actorId?: string
) => {
  if (!actorId) throw new UnauthorizedError("Authentication required");

  const { actor, actorStaff } = await getActorContext(actorId);
  if (!actor || !actorStaff || actor.role !== "DOCTOR") {
    throw new ForbiddenError("Only assigned doctors can create medical records");
  }

  if (payload.doctorId !== actorStaff.id) {
    throw new ForbiddenError("You can only create records for your assigned appointments");
  }

  const patient = await prisma.patient.findFirst({ where: { id: payload.patientId, deletedAt: null, isActive: true } });
  if (!patient) throw new NotFoundError("Patient not found or inactive");

  const doctor = await prisma.staff.findFirst({ where: { id: payload.doctorId, deletedAt: null, isActive: true } });
  if (!doctor) throw new NotFoundError("Doctor not found or inactive");

  const appointment = await prisma.appointment.findFirst({ where: { id: payload.appointmentId, deletedAt: null } });
  if (!appointment) throw new NotFoundError("Appointment not found");

  if (appointment.patientId !== payload.patientId || appointment.doctorId !== payload.doctorId) {
    throw new BadRequestError("Appointment does not match the selected patient and doctor");
  }

  const existingRecord = await prisma.medicalRecord.findFirst({ where: { appointmentId: payload.appointmentId, deletedAt: null } });
  if (existingRecord) throw new ConflictError("An EMR already exists for this appointment");

  const medicalRecordNumber = await buildMedicalRecordNumber();
  const now = new Date();

  return medicalRecordRepository.create({
    medicalRecordNumber,
    patient: { connect: { id: payload.patientId } },
    doctor: { connect: { id: payload.doctorId } },
    appointment: { connect: { id: payload.appointmentId } },
    visitDate: new Date(payload.visitDate),
    chiefComplaint: payload.chiefComplaint,
    symptoms: payload.symptoms,
    vitalSigns: payload.vitalSigns ?? undefined,
    diagnosis: payload.diagnosis,
    differentialDiagnosis: payload.differentialDiagnosis,
    treatmentPlan: payload.treatmentPlan,
    prescriptions: payload.prescriptions ?? undefined,
    allergies: payload.allergies ?? undefined,
    chronicConditions: payload.chronicConditions ?? undefined,
    immunizations: payload.immunizations ?? undefined,
    laboratoryRequests: payload.laboratoryRequests ?? undefined,
    radiologyRequests: payload.radiologyRequests ?? undefined,
    clinicalNotes: payload.clinicalNotes,
    followUpDate: payload.followUpDate ? new Date(payload.followUpDate) : undefined,
    status: payload.status ?? MedicalRecordStatus.OPEN,
    auditTrail: [{ action: "created", timestamp: now.toISOString(), userId: actorId, changes: payload }],
    createdBy: actorId,
    updatedBy: actorId,
  });
};

export const updateMedicalRecord = async (
  id: string,
  payload: {
    patientId?: string;
    doctorId?: string;
    appointmentId?: string;
    visitDate?: string;
    chiefComplaint?: string | null;
    symptoms?: string | null;
    vitalSigns?: Record<string, any> | null;
    diagnosis?: string | null;
    differentialDiagnosis?: string | null;
    treatmentPlan?: string | null;
    prescriptions?: string[] | null;
    allergies?: string[] | null;
    chronicConditions?: string[] | null;
    immunizations?: string[] | null;
    laboratoryRequests?: string[] | null;
    radiologyRequests?: string[] | null;
    clinicalNotes?: string | null;
    followUpDate?: string | null;
    status?: MedicalRecordStatus;
  },
  actorId?: string
) => {
  if (!actorId) throw new UnauthorizedError("Authentication required");

  const existing = await medicalRecordRepository.findById(id);
  if (!existing) throw new NotFoundError("Medical record not found");
  if (existing.status === MedicalRecordStatus.CLOSED) throw new BadRequestError("Closed medical records are read-only");

  const { actor, actorStaff } = await getActorContext(actorId);
  if (!actor || !actorStaff || actor.role !== "DOCTOR") {
    throw new ForbiddenError("Only assigned doctors can update medical records");
  }

  if (existing.doctorId !== actorStaff.id) {
    throw new ForbiddenError("You can only edit your assigned patients' medical records");
  }

  const data: Prisma.MedicalRecordUpdateInput = {
    visitDate: payload.visitDate ? new Date(payload.visitDate) : undefined,
    chiefComplaint: payload.chiefComplaint,
    symptoms: payload.symptoms,
    vitalSigns: payload.vitalSigns ?? undefined,
    diagnosis: payload.diagnosis,
    differentialDiagnosis: payload.differentialDiagnosis,
    treatmentPlan: payload.treatmentPlan,
    prescriptions: payload.prescriptions ?? undefined,
    allergies: payload.allergies ?? undefined,
    chronicConditions: payload.chronicConditions ?? undefined,
    immunizations: payload.immunizations ?? undefined,
    laboratoryRequests: payload.laboratoryRequests ?? undefined,
    radiologyRequests: payload.radiologyRequests ?? undefined,
    clinicalNotes: payload.clinicalNotes,
    followUpDate: payload.followUpDate ? new Date(payload.followUpDate) : undefined,
    status: payload.status,
    updatedBy: actorId,
    auditTrail: {
      push: [
        {
          action: "updated",
          timestamp: new Date().toISOString(),
          userId: actorId,
          changes: payload,
        },
      ],
    },
  };

  if (payload.patientId) data.patient = { connect: { id: payload.patientId } };
  if (payload.doctorId) data.doctor = { connect: { id: payload.doctorId } };
  if (payload.appointmentId) data.appointment = { connect: { id: payload.appointmentId } };

  return medicalRecordRepository.update(id, data);
};

export const deleteMedicalRecord = async (id: string, actorId?: string) => {
  const existing = await medicalRecordRepository.findById(id);
  if (!existing) throw new NotFoundError("Medical record not found");

  if (actorId) {
    const { actor, actorStaff } = await getActorContext(actorId);
    if (!actor || !actorStaff || actor.role !== "DOCTOR" || existing.doctorId !== actorStaff.id) {
      throw new ForbiddenError("Only assigned doctors can delete medical records");
    }
  }

  return medicalRecordRepository.softDelete(id);
};

export const getPatientMedicalHistory = async (patientId: string) => {
  const patient = await prisma.patient.findFirst({ where: { id: patientId, deletedAt: null, isActive: true } });
  if (!patient) throw new NotFoundError("Patient not found");

  return prisma.medicalRecord.findMany({
    where: { patientId, deletedAt: null },
    orderBy: { visitDate: "desc" },
    include: {
      doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
      appointment: true,
    },
  });
};

export const getVisitHistory = async (patientId: string) => {
  return getPatientMedicalHistory(patientId);
};
