import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { BadRequestError, ConflictError, NotFoundError } from "../errors/AppError";
import { DepartmentRepository } from "../repositories/department.repository";

const departmentRepository = new DepartmentRepository(prisma);

interface DepartmentListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const listDepartments = async ({ page = 1, limit = 10, search }: DepartmentListParams) => {
  const pageNumber = Math.max(1, page);
  const limitNumber = Math.min(100, Math.max(1, limit));
  const skip = (pageNumber - 1) * limitNumber;

  const where: Prisma.DepartmentWhereInput = {
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { code: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const { departments, total } = await departmentRepository.list({ skip, take: limitNumber, where });

  return {
    departments,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

export const getDepartmentById = async (id: string) => {
  const department = await departmentRepository.findById(id);
  if (!department) throw new NotFoundError("Department not found");
  return department;
};

export const createDepartment = async (payload: { name: string; description?: string; code?: string }, actorId?: string) => {
  const existing = await prisma.department.findFirst({ where: { OR: [{ name: payload.name }, ...(payload.code ? [{ code: payload.code }] : [])] } });
  if (existing) throw new ConflictError("Department with this name or code already exists");

  return departmentRepository.create({
    name: payload.name,
    description: payload.description,
    code: payload.code,
    createdBy: actorId,
  });
};

export const updateDepartment = async (id: string, payload: { name?: string; description?: string | null; code?: string | null }, actorId?: string) => {
  const existing = await departmentRepository.findById(id);
  if (!existing) throw new NotFoundError("Department not found");

  if (payload.name || payload.code) {
    const duplicate = await prisma.department.findFirst({
      where: {
        OR: [
          ...(payload.name ? [{ name: payload.name }] : []),
          ...(payload.code ? [{ code: payload.code }] : []),
        ],
        NOT: { id },
      },
    });
    if (duplicate) throw new ConflictError("Department with this name or code already exists");
  }

  return departmentRepository.update(id, {
    name: payload.name,
    description: payload.description,
    code: payload.code,
    updatedBy: actorId,
  });
};

export const deleteDepartment = async (id: string, actorId?: string) => {
  const existing = await departmentRepository.findById(id);
  if (!existing) throw new NotFoundError("Department not found");
  await departmentRepository.deactivate(id, actorId);
  return true;
};

export const assignDoctorToDepartment = async (departmentId: string, doctorId: string, actorId?: string) => {
  const department = await departmentRepository.findById(departmentId);
  if (!department) throw new NotFoundError("Department not found");

  const doctor = await prisma.staff.findUnique({ where: { id: doctorId } });
  if (!doctor) throw new NotFoundError("Doctor not found");

  return departmentRepository.assignDoctor(departmentId, doctorId);
};

export const getDepartmentStats = async () => {
  const [totalDepartments, activeDepartments, doctorsByDepartment] = await Promise.all([
    prisma.department.count({ where: { deletedAt: null } }),
    prisma.department.count({ where: { deletedAt: null, isActive: true } }),
    prisma.department.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, _count: { select: { staff: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    totalDepartments,
    activeDepartments,
    departments: doctorsByDepartment,
  };
};
