"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const appointment_controller_1 = require("../controllers/appointment.controller");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.get("/summary", appointment_controller_1.getAppointmentSummary);
router.get("/", appointment_controller_1.getAppointments);
router.get("/:id", appointment_controller_1.fetchAppointmentById);
router.post("/", appointment_controller_1.registerAppointment);
router.put("/:id", appointment_controller_1.editAppointment);
router.patch("/:id/cancel", appointment_controller_1.cancelAppointmentHandler);
router.delete("/:id", appointment_controller_1.removeAppointment);
exports.default = router;
//# sourceMappingURL=appointment.route.js.map