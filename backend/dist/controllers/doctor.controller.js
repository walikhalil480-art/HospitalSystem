"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDoctor = exports.editDoctor = exports.registerDoctor = exports.fetchDoctorById = exports.getDoctors = void 0;
const doctor_validator_1 = require("../validators/doctor.validator");
const doctor_service_1 = require("../services/doctor.service");
const getStringParam = (val) => Array.isArray(val) ? val[0] : val;
const getDoctors = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", search, departmentId, status, availability } = req.query;
        const result = await (0, doctor_service_1.listDoctors)({
            page: Number(page || 1),
            limit: Number(limit || 10),
            search: typeof search === "string" ? search : undefined,
            departmentId: typeof departmentId === "string" ? departmentId : undefined,
            status: typeof status === "string" ? status : undefined,
            availability: typeof availability === "string" ? availability : undefined,
        });
        res.status(200).json({
            success: true,
            message: "Doctors retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDoctors = getDoctors;
const fetchDoctorById = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const doctor = await (0, doctor_service_1.getDoctorById)(id);
        res.status(200).json({
            success: true,
            message: "Doctor retrieved successfully",
            data: { doctor },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.fetchDoctorById = fetchDoctorById;
const registerDoctor = async (req, res, next) => {
    try {
        const data = doctor_validator_1.createDoctorSchema.parse(req.body);
        const doctor = await (0, doctor_service_1.createDoctor)(data, req.user?.id);
        res.status(201).json({
            success: true,
            message: "Doctor created successfully. Default password: Doctor@123",
            data: { doctor },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.registerDoctor = registerDoctor;
const editDoctor = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const data = doctor_validator_1.updateDoctorSchema.parse(req.body);
        const doctor = await (0, doctor_service_1.updateDoctor)(id, data, req.user?.id);
        res.status(200).json({
            success: true,
            message: "Doctor updated successfully",
            data: { doctor },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.editDoctor = editDoctor;
const removeDoctor = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        await (0, doctor_service_1.deleteDoctor)(id, req.user?.id);
        res.status(200).json({
            success: true,
            message: "Doctor deactivated successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.removeDoctor = removeDoctor;
//# sourceMappingURL=doctor.controller.js.map