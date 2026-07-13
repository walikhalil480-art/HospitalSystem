import { Router } from "express";
import {
  editDoctor,
  fetchDoctorById,
  getDoctors,
  registerDoctor,
  removeDoctor,
} from "../controllers/doctor.controller";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.use(requireAuth);

router.get("/", getDoctors);
router.get("/:id", fetchDoctorById);
router.post("/", requireRole("SUPER_ADMIN", "ADMIN"), registerDoctor);
router.put("/:id", requireRole("SUPER_ADMIN", "ADMIN"), editDoctor);
router.delete("/:id", requireRole("SUPER_ADMIN", "ADMIN"), removeDoctor);

export default router;
