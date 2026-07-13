import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import {
  assignDoctor,
  editDepartment,
  fetchDepartmentById,
  getDepartmentMetrics,
  getDepartments,
  registerDepartment,
  removeDepartment,
} from "../controllers/department.controller";

const router = Router();

router.use(requireAuth);

router.get("/", getDepartments);
router.get("/stats", getDepartmentMetrics);
router.get("/:id", fetchDepartmentById);
router.post("/", requireRole("SUPER_ADMIN", "ADMIN"), registerDepartment);
router.put("/:id", requireRole("SUPER_ADMIN", "ADMIN"), editDepartment);
router.delete("/:id", requireRole("SUPER_ADMIN", "ADMIN"), removeDepartment);
router.post("/:id/assign-doctor", requireRole("SUPER_ADMIN", "ADMIN"), assignDoctor);

export default router;
