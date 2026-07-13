import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { BadRequestError, ConflictError, NotFoundError } from "../errors/AppError";
import { hashPassword } from "../utils/password";
import { DoctorRepository } from "../repositories/doctor.repository";

const doctorRepository = new DoctorRepository(prisma);

interface DoctorListParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  status?: string;
  availability?: string;
}

export const listDoctors = async ({ page = 1, limit = 10, search, departmentId, status, availability }: DoctorListParams) => {
  const pageNumber = Math.max(1, page);
  const limitNumber = Math.min(100, Math.max(1, limit));
  const skip = (pageNumber - 1) * limitNumber;

  const where: Prisma.StaffWhereInput = {
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
    ...(status ? { employmentStatus: status as any } : {}),
    ...(availability ? { availability: availability as any } : {}),
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

export const getDoctorById = async (id: string) => {
  const doctor = await doctorRepository.findById(id);
  if (!doctor) throw new NotFoundError("Doctor not found");
  return doctor;
};

export const createDoctor = async (
  payload: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    departmentId?: string;
    specialization?: string;
    qualifications?: string;
    licenseNumber?: string;
    schedule?: string;
    consultationFee?: number;
    bio?: string;
    employmentStatus?: string;
    availability?: string;
    photoUrl?: string;
  },
  actorId?: string
) => {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) throw new ConflictError("A user with this email already exists");

  if (payload.departmentId) {
    const department = await prisma.department.findUnique({ where: { id: payload.departmentId } });
    if (!department) throw new BadRequestError("Department not found");
  }

  const hashedPassword = await hashPassword("Doctor@123");

  return prisma.$transaction(async (tx) => {
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

    return doctorRepository.create(
      {
        user: { connect: { id: user.id } },
        department: payload.departmentId ? { connect: { id: payload.departmentId } } : undefined,
        specialization: payload.specialization,
        qualifications: payload.qualifications,
        licenseNumber: payload.licenseNumber,
        schedule: payload.schedule,
        consultationFee: payload.consultationFee,
        bio: payload.bio,
        employmentStatus: (payload.employmentStatus as any) ?? "ACTIVE",
        availability: (payload.availability as any) ?? "AVAILABLE",
        photoUrl: payload.photoUrl,
        createdBy: actorId,
      },
      tx
    );
  });
};

export const updateDoctor = async (
  id: string,
  payload: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    departmentId?: string | null;
    specialization?: string | null;
    qualifications?: string | null;
    licenseNumber?: string | null;
    schedule?: string | null;
    consultationFee?: number | null;
    bio?: string | null;
    employmentStatus?: string | null;
    availability?: string | null;
    photoUrl?: string | null;
  },
  actorId?: string
) => {
  const existing = await doctorRepository.findById(id);
  if (!existing) throw new NotFoundError("Doctor not found");

  if (payload.departmentId) {
    const department = await prisma.department.findUnique({ where: { id: payload.departmentId } });
    if (!department) throw new BadRequestError("Department not found");
  }

  return prisma.$transaction(async (tx) => {
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
      employmentStatus: payload.employmentStatus as any,
      availability: payload.availability as any,
      photoUrl: payload.photoUrl,
      updatedBy: actorId,
    });
  });
};

export const deleteDoctor = async (id: string, actorId?: string) => {
  const doctor = await doctorRepository.findById(id);
  if (!doctor) throw new NotFoundError("Doctor not found");
  await doctorRepository.deactivate(id, actorId);
  return true;
};
