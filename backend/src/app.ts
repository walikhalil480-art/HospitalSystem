import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { rateLimit } from "express-rate-limit";
import { swaggerSpec } from "./swagger";

// Routes imports
import authRoutes from "./routes/auth.route";
import patientRoutes from "./routes/patient.route";
import doctorRoutes from "./routes/doctor.route";
import appointmentRoutes from "./routes/appointment.route";
import departmentRoutes from "./routes/department.route";
import userRoutes from "./routes/user.route";
import dashboardRoutes from "./routes/dashboard.route";
import medicalRecordRoutes from "./routes/medical-record.route";
import laboratoryRoutes from "./routes/laboratory.route";

const app = express();

// Security rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(morgan("dev"));

// API Routes mounting
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/medical-records", medicalRecordRoutes);
app.use("/api/v1/laboratory", laboratoryRoutes);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
