"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const department_controller_1 = require("../controllers/department.controller");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.get("/", department_controller_1.getDepartments);
router.get("/stats", department_controller_1.getDepartmentMetrics);
router.get("/:id", department_controller_1.fetchDepartmentById);
router.post("/", (0, auth_1.requireRole)("SUPER_ADMIN", "ADMIN"), department_controller_1.registerDepartment);
router.put("/:id", (0, auth_1.requireRole)("SUPER_ADMIN", "ADMIN"), department_controller_1.editDepartment);
router.delete("/:id", (0, auth_1.requireRole)("SUPER_ADMIN", "ADMIN"), department_controller_1.removeDepartment);
router.post("/:id/assign-doctor", (0, auth_1.requireRole)("SUPER_ADMIN", "ADMIN"), department_controller_1.assignDoctor);
exports.default = router;
//# sourceMappingURL=department.route.js.map