"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitHistory = exports.getPatientMedicalHistory = exports.deleteMedicalRecord = exports.updateMedicalRecord = exports.createMedicalRecord = exports.getMedicalRecordById = exports.listMedicalRecords = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../errors/AppError");
const medical_record_repository_1 = require("../repositories/medical-record.repository");
const medicalRecordRepository = new medical_record_repository_1.MedicalRecordRepository(prisma_1.prisma);
const buildMedicalRecordNumber = async () => {
    const count = await prisma_1.prisma.medicalRecord.count({ where: { deletedAt: null } });
    return `MR-${String(count + 1).padStart(4, "0")}`;
};
const getActorContext = async (actorId) => {
    const actor = await prisma_1.prisma.user.findUnique({
        where: { id: actorId },
        select: { id: true, role: true },
    });
    const actorStaff = await prisma_1.prisma.staff.findFirst({
        where: { userId: actorId, deletedAt: null },
        select: { id: true },
    });
    return { actor, actorStaff };
};
const listMedicalRecords = async ({ page = 1, limit = 10, search, patientId, doctorId, date, status }) => {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.min(100, Math.max(1, limit));
    const skip = (pageNumber - 1) * limitNumber;
    const where = {
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
exports.listMedicalRecords = listMedicalRecords;
const getMedicalRecordById = async (id) => {
    const record = await medicalRecordRepository.findById(id);
    if (!record)
        throw new AppError_1.NotFoundError("Medical record not found");
    return record;
};
exports.getMedicalRecordById = getMedicalRecordById;
const createMedicalRecord = async (payload, actorId) => {
    if (!actorId)
        throw new AppError_1.UnauthorizedError("Authentication required");
    const { actor, actorStaff } = await getActorContext(actorId);
    if (!actor || !actorStaff || actor.role !== "DOCTOR") {
        throw new AppError_1.ForbiddenError("Only assigned doctors can create medical records");
    }
    if (payload.doctorId !== actorStaff.id) {
        throw new AppError_1.ForbiddenError("You can only create records for your assigned appointments");
    }
    const patient = await prisma_1.prisma.patient.findFirst({ where: { id: payload.patientId, deletedAt: null, isActive: true } });
    if (!patient)
        throw new AppError_1.NotFoundError("Patient not found or inactive");
    const doctor = await prisma_1.prisma.staff.findFirst({ where: { id: payload.doctorId, deletedAt: null, isActive: true } });
    if (!doctor)
        throw new AppError_1.NotFoundError("Doctor not found or inactive");
    const appointment = await prisma_1.prisma.appointment.findFirst({ where: { id: payload.appointmentId, deletedAt: null } });
    if (!appointment)
        throw new AppError_1.NotFoundError("Appointment not found");
    if (appointment.patientId !== payload.patientId || appointment.doctorId !== payload.doctorId) {
        throw new AppError_1.BadRequestError("Appointment does not match the selected patient and doctor");
    }
    const existingRecord = await prisma_1.prisma.medicalRecord.findFirst({ where: { appointmentId: payload.appointmentId, deletedAt: null } });
    if (existingRecord)
        throw new AppError_1.ConflictError("An EMR already exists for this appointment");
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
        status: payload.status ?? client_1.MedicalRecordStatus.OPEN,
        auditTrail: [{ action: "created", timestamp: now.toISOString(), userId: actorId, changes: payload }],
        createdBy: actorId,
        updatedBy: actorId,
    });
};
exports.createMedicalRecord = createMedicalRecord;
const updateMedicalRecord = async (id, payload, actorId) => {
    if (!actorId)
        throw new AppError_1.UnauthorizedError("Authentication required");
    const existing = await medicalRecordRepository.findById(id);
    if (!existing)
        throw new AppError_1.NotFoundError("Medical record not found");
    if (existing.status === client_1.MedicalRecordStatus.CLOSED)
        throw new AppError_1.BadRequestError("Closed medical records are read-only");
    const { actor, actorStaff } = await getActorContext(actorId);
    if (!actor || !actorStaff || actor.role !== "DOCTOR") {
        throw new AppError_1.ForbiddenError("Only assigned doctors can update medical records");
    }
    if (existing.doctorId !== actorStaff.id) {
        throw new AppError_1.ForbiddenError("You can only edit your assigned patients' medical records");
    }
    const data = {
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
    if (payload.patientId)
        data.patient = { connect: { id: payload.patientId } };
    if (payload.doctorId)
        data.doctor = { connect: { id: payload.doctorId } };
    if (payload.appointmentId)
        data.appointment = { connect: { id: payload.appointmentId } };
    return medicalRecordRepository.update(id, data);
};
exports.updateMedicalRecord = updateMedicalRecord;
const deleteMedicalRecord = async (id, actorId) => {
    const existing = await medicalRecordRepository.findById(id);
    if (!existing)
        throw new AppError_1.NotFoundError("Medical record not found");
    if (actorId) {
        const { actor, actorStaff } = await getActorContext(actorId);
        if (!actor || !actorStaff || actor.role !== "DOCTOR" || existing.doctorId !== actorStaff.id) {
            throw new AppError_1.ForbiddenError("Only assigned doctors can delete medical records");
        }
    }
    return medicalRecordRepository.softDelete(id);
};
exports.deleteMedicalRecord = deleteMedicalRecord;
const getPatientMedicalHistory = async (patientId) => {
    const patient = await prisma_1.prisma.patient.findFirst({ where: { id: patientId, deletedAt: null, isActive: true } });
    if (!patient)
        throw new AppError_1.NotFoundError("Patient not found");
    return prisma_1.prisma.medicalRecord.findMany({
        where: { patientId, deletedAt: null },
        orderBy: { visitDate: "desc" },
        include: {
            doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
            appointment: true,
        },
    });
};
exports.getPatientMedicalHistory = getPatientMedicalHistory;
const getVisitHistory = async (patientId) => {
    return (0, exports.getPatientMedicalHistory)(patientId);
};
exports.getVisitHistory = getVisitHistory;
//# sourceMappingURL=medical-record.service.js.map