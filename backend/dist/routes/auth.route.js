"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Public routes
router.get("/status", auth_controller_1.checkSystemStatus);
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.post("/refresh-token", auth_controller_1.refreshToken);
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.post("/reset-password", auth_controller_1.resetPassword);
// Protected routes
router.get("/me", auth_1.requireAuth, auth_controller_1.getMe);
router.post("/change-password", auth_1.requireAuth, auth_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth.route.js.map