import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";
import { NotFoundError, ConflictError } from "../errors/AppError";
import { hashPassword } from "../utils/password";
import { Prisma } from "@prisma/client";

const getStringParam = (val: string | string[] | undefined): string | undefined =>
  Array.isArray(val) ? val[0] : val;

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = "1", limit = "10", search, role } = req.query;

    const pageNumber = Math.max(1, parseInt(page as string));
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNumber - 1) * limitNumber;
    const roleStr = getStringParam(role as string | string[]);

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(roleStr ? { role: roleStr as any } : {}),
      ...(search
        ? {
            OR: [
              { firstName: { contains: search as string, mode: "insensitive" } },
              { lastName: { contains: search as string, mode: "insensitive" } },
              { email: { contains: search as string, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
        skip,
        take: limitNumber,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        deletedAt: true,
        patientProfile: true,
        staffProfile: { include: { department: true } },
      },
    });

    if (!user || user.deletedAt) throw new NotFoundError("User not found");

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new ConflictError("A user with this email already exists");

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: data.role,
          createdBy: req.user?.id,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
      });

      // Auto-create the appropriate profile based on role
      if (data.role === "PATIENT") {
        await tx.patient.create({
          data: {
            userId: createdUser.id,
            dateOfBirth: new Date("2000-01-01"),
            gender: "OTHER",
          },
        });
      } else if (!["SUPER_ADMIN", "ADMIN"].includes(data.role)) {
        // DOCTOR, NURSE, PHARMACIST, LAB_TECHNICIAN, CASHIER, RECEPTIONIST
        await tx.staff.create({
          data: { userId: createdUser.id },
        });
      }

      return createdUser;
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const data = updateUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser || existingUser.deletedAt) throw new NotFoundError("User not found");

    if (data.email && data.email !== existingUser.email) {
      const emailConflict = await prisma.user.findUnique({ where: { email: data.email } });
      if (emailConflict) throw new ConflictError("Email is already in use");
    }

    const updateData: Prisma.UserUpdateInput = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
      isActive: data.isActive,
      updatedBy: req.user?.id,
    };

    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser || existingUser.deletedAt) throw new NotFoundError("User not found");

    await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
        updatedBy: req.user?.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
