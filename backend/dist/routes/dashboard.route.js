"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.get("/stats", (0, auth_1.requireRole)("SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACIST", "LAB_TECHNICIAN", "CASHIER"), dashboard_controller_1.getDashboardStats);
exports.default = router;
//# sourceMappingURL=dashboard.route.js.map