import { Router } from "express";
import {
  register,
  login,
  getMe,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  checkSystemStatus,
} from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// Public routes
router.get("/status", checkSystemStatus);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", requireAuth, getMe);
router.post("/change-password", requireAuth, changePassword);

export default router;
