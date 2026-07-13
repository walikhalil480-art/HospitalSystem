"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const errorHandler_1 = require("./middlewares/errorHandler");
const express_rate_limit_1 = require("express-rate-limit");
const swagger_1 = require("./swagger");
// Routes imports
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const patient_route_1 = __importDefault(require("./routes/patient.route"));
const doctor_route_1 = __importDefault(require("./routes/doctor.route"));
const appointment_route_1 = __importDefault(require("./routes/appointment.route"));
const department_route_1 = __importDefault(require("./routes/department.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
const medical_record_route_1 = __importDefault(require("./routes/medical-record.route"));
const laboratory_route_1 = __importDefault(require("./routes/laboratory.route"));
const app = (0, express_1.default)();
// Security rate limiter
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(limiter);
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
app.use((0, morgan_1.default)("dev"));
// API Routes mounting
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/patients", patient_route_1.default);
app.use("/api/v1/doctors", doctor_route_1.default);
app.use("/api/v1/appointments", appointment_route_1.default);
app.use("/api/v1/departments", department_route_1.default);
app.use("/api/v1/users", user_route_1.default);
app.use("/api/v1/dashboard", dashboard_route_1.default);
app.use("/api/v1/medical-records", medical_record_route_1.default);
app.use("/api/v1/laboratory", laboratory_route_1.default);
// Swagger docs
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Health check endpoint
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hospital Management System API is running",
        data: {
            status: "ok",
            timestamp: new Date(),
        },
    });
});
// Route Not Found Handler
app.use(errorHandler_1.notFoundHandler);
// Centralized Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map