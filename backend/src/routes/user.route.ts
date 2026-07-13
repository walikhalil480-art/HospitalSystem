import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

router.use(requireAuth);
router.use(requireRole("SUPER_ADMIN", "ADMIN"));

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
