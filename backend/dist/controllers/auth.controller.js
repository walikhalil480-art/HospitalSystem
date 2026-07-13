"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.getMe = exports.refreshToken = exports.login = exports.checkSystemStatus = exports.register = void 0;
const prisma_1 = require("../lib/prisma");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const auth_validator_1 = require("../validators/auth.validator");
const AppError_1 = require("../errors/AppError");
const env_1 = require("../config/env");
const crypto_1 = __importDefault(require("crypto"));
// ─── Register ──────────────────────────────────────────────────────────────
// Only allowed if NO users exist yet (first super admin setup).
// After that, only SUPER_ADMIN/ADMIN can create users via /api/v1/users.
const register = async (req, res, next) => {
    try {
        // Check if any user already exists
        const userCount = await prisma_1.prisma.user.count();
        if (userCount > 0) {
            throw new AppError_1.ForbiddenError("Registration is closed. Contact your administrator to create an account.");
        }
        const data = auth_validator_1.registerSchema.parse(req.body);
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new AppError_1.ConflictError("A user with this email already exists");
        }
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                role: "SUPER_ADMIN", // First user is always super admin
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });
        const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id, role: user.role });
        const refreshToken = (0, jwt_1.signRefreshToken)({ userId: user.id });
        res.status(201).json({
            success: true,
            message: "Super Administrator account created successfully",
            data: { user, accessToken, refreshToken },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// ─── Check if system is initialized ────────────────────────────────────────
const checkSystemStatus = async (req, res, next) => {
    try {
        const userCount = await prisma_1.prisma.user.count();
        res.status(200).json({
            success: true,
            message: "System status retrieved",
            data: { isInitialized: userCount > 0 },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.checkSystemStatus = checkSystemStatus;
// ─── Login ──────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
    try {
        const data = auth_validator_1.loginSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
        if (!user || !user.isActive) {
            throw new AppError_1.UnauthorizedError("Invalid email or password");
        }
        const isPasswordValid = await (0, password_1.comparePassword)(data.password, user.password);
        if (!isPasswordValid) {
            throw new AppError_1.UnauthorizedError("Invalid email or password");
        }
        const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id, role: user.role });
        const refreshToken = (0, jwt_1.signRefreshToken)({ userId: user.id });
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    phone: user.phone,
                },
                accessToken,
                refreshToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// ─── Refresh Token ──────────────────────────────────────────────────────────
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.body;
        if (!token) {
            throw new AppError_1.UnauthorizedError("Refresh token is required");
        }
        const decoded = (0, jwt_1.verifyToken)(token, env_1.env.JWT_REFRESH_SECRET);
        if (!decoded || !decoded["userId"]) {
            throw new AppError_1.UnauthorizedError("Invalid or expired refresh token");
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded["userId"] },
            select: { id: true, role: true, isActive: true },
        });
        if (!user || !user.isActive) {
            throw new AppError_1.UnauthorizedError("User not found or inactive");
        }
        const newAccessToken = (0, jwt_1.signAccessToken)({ userId: user.id, role: user.role });
        res.status(200).json({
            success: true,
            message: "Access token refreshed",
            data: { accessToken: newAccessToken },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
// ─── Get Current User ───────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError_1.UnauthorizedError("Authentication required");
        }
        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: { user: req.user },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
// ─── Change Password ────────────────────────────────────────────────────────
const changePassword = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError_1.UnauthorizedError("Authentication required");
        }
        const data = auth_validator_1.changePasswordSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            throw new AppError_1.UnauthorizedError("User not found");
        }
        const isCurrentPasswordValid = await (0, password_1.comparePassword)(data.currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new AppError_1.BadRequestError("Current password is incorrect");
        }
        const hashedPassword = await (0, password_1.hashPassword)(data.newPassword);
        await prisma_1.prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword },
        });
        res.status(200).json({
            success: true,
            message: "Password changed successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
// ─── Forgot Password ────────────────────────────────────────────────────────
const forgotPassword = async (req, res, next) => {
    try {
        const data = auth_validator_1.forgotPasswordSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
        // Always return success to prevent email enumeration
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If that email exists, a reset link has been sent",
                data: null,
            });
        }
        // Generate a secure reset token
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const resetTokenHash = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        // Store the hashed token in DB
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: resetTokenHash,
                passwordResetExpiry: resetTokenExpiry,
            },
        });
        // In production, send email here with the raw resetToken
        // For development, return in response
        const resetUrl = `${env_1.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        return res.status(200).json({
            success: true,
            message: "If that email exists, a reset link has been sent",
            data: env_1.env.NODE_ENV === "development"
                ? { resetUrl, resetToken }
                : null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
// ─── Reset Password ─────────────────────────────────────────────────────────
const resetPassword = async (req, res, next) => {
    try {
        const data = auth_validator_1.resetPasswordSchema.parse(req.body);
        const resetTokenHash = crypto_1.default
            .createHash("sha256")
            .update(data.token)
            .digest("hex");
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                passwordResetToken: resetTokenHash,
                passwordResetExpiry: { gt: new Date() },
            },
        });
        if (!user) {
            throw new AppError_1.BadRequestError("Invalid or expired password reset token");
        }
        const hashedPassword = await (0, password_1.hashPassword)(data.newPassword);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpiry: null,
            },
        });
        res.status(200).json({
            success: true,
            message: "Password has been reset successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.controller.js.map