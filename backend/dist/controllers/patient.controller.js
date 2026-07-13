"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePatient = exports.editPatient = exports.registerPatient = exports.fetchPatientById = exports.getPatients = void 0;
const patient_validator_1 = require("../validators/patient.validator");
const patient_service_1 = require("../services/patient.service");
const getStringParam = (val) => Array.isArray(val) ? val[0] : val;
const getPatients = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", search } = req.query;
        const result = await (0, patient_service_1.listPatients)({
            page: Number(page || 1),
            limit: Number(limit || 10),
            search: typeof search === "string" ? search : undefined,
        });
        res.status(200).json({
            success: true,
            message: "Patients retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPatients = getPatients;
const fetchPatientById = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const patient = await (0, patient_service_1.getPatientById)(id);
        res.status(200).json({
            success: true,
            message: "Patient retrieved successfully",
            data: { patient },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.fetchPatientById = fetchPatientById;
const registerPatient = async (req, res, next) => {
    try {
        const data = patient_validator_1.createPatientSchema.parse(req.body);
        const patient = await (0, patient_service_1.createPatient)(data, req.user?.id);
        res.status(201).json({
            success: true,
            message: "Patient registered successfully",
            data: { patient },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.registerPatient = registerPatient;
const editPatient = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const data = patient_validator_1.updatePatientSchema.parse(req.body);
        const patient = await (0, patient_service_1.updatePatient)(id, data, req.user?.id);
        res.status(200).json({
            success: true,
            message: "Patient updated successfully",
            data: { patient },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.editPatient = editPatient;
const removePatient = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        await (0, patient_service_1.deletePatient)(id, req.user?.id);
        res.status(200).json({
            success: true,
            message: "Patient deleted successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.removePatient = removePatient;
//# sourceMappingURL=patient.controller.js.map