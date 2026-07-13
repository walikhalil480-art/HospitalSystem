import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { BadRequestError, NotFoundError } from "../errors/AppError";
import { hashPassword } from "../utils/password";

interface PatientListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const listPatients = async ({ page = 1, limit = 10, search }: PatientListParams) => {
  const pageNumber = Math.max(1, page);
  const limitNumber = Math.min(100, Math.max(1, limit));
  const skip = (pageNumber - 1) * limitNumber;

  const whereClause: Prisma.PatientWhereInput = {
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
    prisma.patient.findMany({
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
    prisma.patient.count({ where: whereClause }),
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

export const getPatientById = async (id: string) => {
  const patient = await prisma.patient.findFirst({
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

  if (!patient) throw new NotFoundError("Patient not found");
  return patient;
};

export const createPatient = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allergies?: string;
  insuranceDetails?: string;
  medicalNotes?: string;
}, actorId?: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) throw new BadRequestError("User with this email already exists");

  const hashedPassword = await hashPassword("Patient@123");

  return prisma.$transaction(async (tx) => {
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

export const updatePatient = async (
  id: string,
  payload: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    bloodGroup?: string | null;
    address?: string | null;
    emergencyContact?: string | null;
    emergencyPhone?: string | null;
    allergies?: string | null;
    insuranceDetails?: string | null;
    medicalNotes?: string | null;
  },
  actorId?: string
) => {
  const existingPatient = await prisma.patient.findFirst({ where: { id, deletedAt: null } });
  if (!existingPatient) throw new NotFoundError("Patient not found");

  return prisma.$transaction(async (tx) => {
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

export const deletePatient = async (id: string, actorId?: string) => {
  const patient = await prisma.patient.findFirst({ where: { id, deletedAt: null } });
  if (!patient) throw new NotFoundError("Patient not found");

  await prisma.$transaction(async (tx) => {
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
