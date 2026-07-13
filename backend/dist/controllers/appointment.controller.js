"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppointmentSummary = exports.removeAppointment = exports.cancelAppointmentHandler = exports.editAppointment = exports.registerAppointment = exports.fetchAppointmentById = exports.getAppointments = void 0;
const appointment_service_1 = require("../services/appointment.service");
const appointment_validator_1 = require("../validators/appointment.validator");
const getStringParam = (val) => Array.isArray(val) ? val[0] : val;
const getAppointments = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", search, doctorId, patientId, departmentId, date, status, today } = req.query;
        const result = await (0, appointment_service_1.listAppointments)({
            page: Number(page || 1),
            limit: Number(limit || 10),
            search: typeof search === "string" ? search : undefined,
            doctorId: typeof doctorId === "string" ? doctorId : undefined,
            patientId: typeof patientId === "string" ? patientId : undefined,
            departmentId: typeof departmentId === "string" ? departmentId : undefined,
            date: typeof date === "string" ? date : undefined,
            status: typeof status === "string" ? status : undefined,
            today: typeof today === "string" ? today === "true" : undefined,
        });
        res.status(200).json({
            success: true,
            message: "Appointments retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAppointments = getAppointments;
const fetchAppointmentById = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const appointment = await (0, appointment_service_1.getAppointmentById)(id);
        res.status(200).json({
            success: true,
            message: "Appointment retrieved successfully",
            data: { appointment },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.fetchAppointmentById = fetchAppointmentById;
const registerAppointment = async (req, res, next) => {
    try {
        const data = appointment_validator_1.createAppointmentSchema.parse(req.body);
        const appointment = await (0, appointment_service_1.createAppointment)(data, req.user?.id);
        res.status(201).json({
            success: true,
            message: "Appointment created successfully",
            data: { appointment },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.registerAppointment = registerAppointment;
const editAppointment = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const data = appointment_validator_1.updateAppointmentSchema.parse(req.body);
        const appointment = await (0, appointment_service_1.updateAppointment)(id, data, req.user?.id);
        res.status(200).json({
            success: true,
            message: "Appointment updated successfully",
            data: { appointment },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.editAppointment = editAppointment;
const cancelAppointmentHandler = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const appointment = await (0, appointment_service_1.cancelAppointment)(id, req.user?.id);
        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
            data: { appointment },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.cancelAppointmentHandler = cancelAppointmentHandler;
const removeAppointment = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        await (0, appointment_service_1.deleteAppointment)(id);
        res.status(200).json({
            success: true,
            message: "Appointment deleted successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.removeAppointment = removeAppointment;
const getAppointmentSummary = async (req, res, next) => {
    try {
        const stats = await (0, appointment_service_1.getAppointmentStats)();
        res.status(200).json({
            success: true,
            message: "Appointment summary retrieved successfully",
            data: stats,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAppointmentSummary = getAppointmentSummary;
//# sourceMappingURL=appointment.controller.js.map