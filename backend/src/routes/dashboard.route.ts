import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import { getDashboardStats } from "../controllers/dashboard.controller";

const router = Router();

router.use(requireAuth);

router.get("/stats", requireRole(
  "SUPER_ADMIN",
  "ADMIN",
  "DOCTOR",
  "NURSE",
  "RECEPTIONIST",
  "PHARMACIST",
  "LAB_TECHNICIAN",
  "CASHIER"
), getDashboardStats);

export default router;
