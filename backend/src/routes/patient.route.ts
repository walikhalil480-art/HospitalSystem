import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import {
  fetchPatientById,
  getPatients,
  registerPatient,
  editPatient,
  removePatient,
} from "../controllers/patient.controller";

const router = Router();

router.use(requireAuth);

router.get("/", getPatients);
router.get("/:id", fetchPatientById);

router.post("/", requireRole("SUPER_ADMIN", "ADMIN", "RECEPTIONIST"), registerPatient);
router.put("/:id", requireRole("SUPER_ADMIN", "ADMIN", "RECEPTIONIST", "DOCTOR"), editPatient);
router.delete("/:id", requireRole("SUPER_ADMIN", "ADMIN"), removePatient);

export default router;
