import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { signAccessToken, signRefreshToken, verifyToken } from "../utils/jwt";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validator";
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
} from "../errors/AppError";
import { env } from "../config/env";
import crypto from "crypto";

// ─── Register ──────────────────────────────────────────────────────────────
// Only allowed if NO users exist yet (first super admin setup).
// After that, only SUPER_ADMIN/ADMIN can create users via /api/v1/users.
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if any user already exists
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      throw new ForbiddenError(
        "Registration is closed. Contact your administrator to create an account."
      );
    }

    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictError("A user with this email already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
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

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id });

    res.status(201).json({
      success: true,
      message: "Super Administrator account created successfully",
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Check if system is initialized ────────────────────────────────────────
export const checkSystemStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCount = await prisma.user.count();
    res.status(200).json({
      success: true,
      message: "System status retrieved",
      data: { isInitialized: userCount > 0 },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Login ──────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user || !user.isActive) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id });

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
  } catch (error) {
    next(error);
  }
};

// ─── Refresh Token ──────────────────────────────────────────────────────────
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body as { refreshToken: string };
    if (!token) {
      throw new UnauthorizedError("Refresh token is required");
    }

    const decoded = verifyToken(token, env.JWT_REFRESH_SECRET);
    if (!decoded || !decoded["userId"]) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded["userId"] as string },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError("User not found or inactive");
    }

    const newAccessToken = signAccessToken({ userId: user.id, role: user.role });

    res.status(200).json({
      success: true,
      message: "Access token refreshed",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Current User ───────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Change Password ────────────────────────────────────────────────────────
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const data = changePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const isCurrentPasswordValid = await comparePassword(data.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestError("Current password is incorrect");
    }

    const hashedPassword = await hashPassword(data.newPassword);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Forgot Password ────────────────────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = forgotPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent",
        data: null,
      });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store the hashed token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetTokenHash,
        passwordResetExpiry: resetTokenExpiry,
      },
    });

    // In production, send email here with the raw resetToken
    // For development, return in response
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    return res.status(200).json({
      success: true,
      message: "If that email exists, a reset link has been sent",
      data:
        env.NODE_ENV === "development"
          ? { resetUrl, resetToken }
          : null,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Reset Password ─────────────────────────────────────────────────────────
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = resetPasswordSchema.parse(req.body);

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(data.token)
      .digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: resetTokenHash,
        passwordResetExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestError("Invalid or expired password reset token");
    }

    const hashedPassword = await hashPassword(data.newPassword);

    await prisma.user.update({
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
  } catch (error) {
    next(error);
  }
};
