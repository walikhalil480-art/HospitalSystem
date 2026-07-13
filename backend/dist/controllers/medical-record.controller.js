"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatientVisitHistory = exports.getPatientHistory = exports.removeMedicalRecord = exports.editMedicalRecord = exports.registerMedicalRecord = exports.fetchMedicalRecordById = exports.getMedicalRecords = void 0;
const medical_record_service_1 = require("../services/medical-record.service");
const medical_record_validator_1 = require("../validators/medical-record.validator");
const getStringParam = (val) => Array.isArray(val) ? val[0] : val;
const getMedicalRecords = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", search, patientId, doctorId, date, status } = req.query;
        const result = await (0, medical_record_service_1.listMedicalRecords)({
            page: Number(page || 1),
            limit: Number(limit || 10),
            search: typeof search === "string" ? search : undefined,
            patientId: typeof patientId === "string" ? patientId : undefined,
            doctorId: typeof doctorId === "string" ? doctorId : undefined,
            date: typeof date === "string" ? date : undefined,
            status: typeof status === "string" ? status : undefined,
        });
        res.status(200).json({ success: true, message: "Medical records retrieved successfully", data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.getMedicalRecords = getMedicalRecords;
const fetchMedicalRecordById = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const medicalRecord = await (0, medical_record_service_1.getMedicalRecordById)(id);
        res.status(200).json({ success: true, message: "Medical record retrieved successfully", data: { medicalRecord } });
    }
    catch (error) {
        next(error);
    }
};
exports.fetchMedicalRecordById = fetchMedicalRecordById;
const registerMedicalRecord = async (req, res, next) => {
    try {
        const data = medical_record_validator_1.createMedicalRecordSchema.parse(req.body);
        const medicalRecord = await (0, medical_record_service_1.createMedicalRecord)(data, req.user?.id);
        res.status(201).json({ success: true, message: "Medical record created successfully", data: { medicalRecord } });
    }
    catch (error) {
        next(error);
    }
};
exports.registerMedicalRecord = registerMedicalRecord;
const editMedicalRecord = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const data = medical_record_validator_1.updateMedicalRecordSchema.parse(req.body);
        const medicalRecord = await (0, medical_record_service_1.updateMedicalRecord)(id, data, req.user?.id);
        res.status(200).json({ success: true, message: "Medical record updated successfully", data: { medicalRecord } });
    }
    catch (error) {
        next(error);
    }
};
exports.editMedicalRecord = editMedicalRecord;
const removeMedicalRecord = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        await (0, medical_record_service_1.deleteMedicalRecord)(id, req.user?.id);
        res.status(200).json({ success: true, message: "Medical record deleted successfully", data: null });
    }
    catch (error) {
        next(error);
    }
};
exports.removeMedicalRecord = removeMedicalRecord;
const getPatientHistory = async (req, res, next) => {
    try {
        const patientId = getStringParam(req.params["patientId"]);
        const history = await (0, medical_record_service_1.getPatientMedicalHistory)(patientId);
        res.status(200).json({ success: true, message: "Patient medical history retrieved successfully", data: { history } });
    }
    catch (error) {
        next(error);
    }
};
exports.getPatientHistory = getPatientHistory;
const getPatientVisitHistory = async (req, res, next) => {
    try {
        const patientId = getStringParam(req.params["patientId"]);
        const history = await (0, medical_record_service_1.getVisitHistory)(patientId);
        res.status(200).json({ success: true, message: "Patient visit history retrieved successfully", data: { history } });
    }
    catch (error) {
        next(error);
    }
};
exports.getPatientVisitHistory = getPatientVisitHistory;
//# sourceMappingURL=medical-record.controller.js.map