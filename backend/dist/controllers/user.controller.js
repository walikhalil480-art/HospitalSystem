"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const prisma_1 = require("../lib/prisma");
const user_validator_1 = require("../validators/user.validator");
const AppError_1 = require("../errors/AppError");
const password_1 = require("../utils/password");
const getStringParam = (val) => Array.isArray(val) ? val[0] : val;
const getUsers = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", search, role } = req.query;
        const pageNumber = Math.max(1, parseInt(page));
        const limitNumber = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNumber - 1) * limitNumber;
        const roleStr = getStringParam(role);
        const where = {
            deletedAt: null,
            ...(roleStr ? { role: roleStr } : {}),
            ...(search
                ? {
                    OR: [
                        { firstName: { contains: search, mode: "insensitive" } },
                        { lastName: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                    ],
                }
                : {}),
        };
        const [users, total] = await Promise.all([
            prisma_1.prisma.user.findMany({
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
            prisma_1.prisma.user.count({ where }),
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
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const user = await prisma_1.prisma.user.findUnique({
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
        if (!user || user.deletedAt)
            throw new AppError_1.NotFoundError("User not found");
        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: { user },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res, next) => {
    try {
        const data = user_validator_1.createUserSchema.parse(req.body);
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser)
            throw new AppError_1.ConflictError("A user with this email already exists");
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        const user = await prisma_1.prisma.$transaction(async (tx) => {
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
            }
            else if (!["SUPER_ADMIN", "ADMIN"].includes(data.role)) {
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
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
const updateUser = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const data = user_validator_1.updateUserSchema.parse(req.body);
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!existingUser || existingUser.deletedAt)
            throw new AppError_1.NotFoundError("User not found");
        if (data.email && data.email !== existingUser.email) {
            const emailConflict = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
            if (emailConflict)
                throw new AppError_1.ConflictError("Email is already in use");
        }
        const updateData = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: data.role,
            isActive: data.isActive,
            updatedBy: req.user?.id,
        };
        if (data.password) {
            updateData.password = await (0, password_1.hashPassword)(data.password);
        }
        const user = await prisma_1.prisma.user.update({
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!existingUser || existingUser.deletedAt)
            throw new AppError_1.NotFoundError("User not found");
        await prisma_1.prisma.user.update({
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
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map