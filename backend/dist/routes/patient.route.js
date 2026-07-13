"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const patient_controller_1 = require("../controllers/patient.controller");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.get("/", patient_controller_1.getPatients);
router.get("/:id", patient_controller_1.fetchPatientById);
router.post("/", (0, auth_1.requireRole)("SUPER_ADMIN", "ADMIN", "RECEPTIONIST"), patient_controller_1.registerPatient);
router.put("/:id", (0, auth_1.requireRole)("SUPER_ADMIN", "ADMIN", "RECEPTIONIST", "DOCTOR"), patient_controller_1.editPatient);
router.delete("/:id", (0, auth_1.requireRole)("SUPER_ADMIN", "ADMIN"), patient_controller_1.removePatient);
exports.default = router;
//# sourceMappingURL=patient.route.js.map