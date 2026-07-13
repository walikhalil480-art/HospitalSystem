"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_controller_1 = require("../controllers/doctor.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.get("/", doctor_controller_1.getDoctors);
router.get("/:id", doctor_controller_1.fetchDoctorById);
router.post("/", (0, auth_1.requireRole)("SUPER_ADMIN", "ADMIN"), doctor_controller_1.registerDoctor);
router.put("/:id", (0, auth_1.requireRole)("SUPER_ADMIN", "ADMIN"), doctor_controller_1.editDoctor);
router.delete("/:id", (0, auth_1.requireRole)("SUPER_ADMIN", "ADMIN"), doctor_controller_1.removeDoctor);
exports.default = router;
//# sourceMappingURL=doctor.route.js.map