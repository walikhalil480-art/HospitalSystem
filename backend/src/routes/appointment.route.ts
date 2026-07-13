import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  cancelAppointmentHandler,
  editAppointment,
  fetchAppointmentById,
  getAppointmentSummary,
  getAppointments,
  registerAppointment,
  removeAppointment,
} from "../controllers/appointment.controller";

const router = Router();

router.use(requireAuth);

router.get("/summary", getAppointmentSummary);
router.get("/", getAppointments);
router.get("/:id", fetchAppointmentById);
router.post("/", registerAppointment);
router.put("/:id", editAppointment);
router.patch("/:id/cancel", cancelAppointmentHandler);
router.delete("/:id", removeAppointment);

export default router;
