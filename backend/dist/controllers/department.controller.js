"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartmentMetrics = exports.assignDoctor = exports.removeDepartment = exports.editDepartment = exports.registerDepartment = exports.fetchDepartmentById = exports.getDepartments = void 0;
const department_validator_1 = require("../validators/department.validator");
const department_service_1 = require("../services/department.service");
const getStringParam = (val) => Array.isArray(val) ? val[0] : val;
const getDepartments = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", search } = req.query;
        const result = await (0, department_service_1.listDepartments)({
            page: Number(page || 1),
            limit: Number(limit || 10),
            search: typeof search === "string" ? search : undefined,
        });
        res.status(200).json({ success: true, message: "Departments retrieved successfully", data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.getDepartments = getDepartments;
const fetchDepartmentById = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const department = await (0, department_service_1.getDepartmentById)(id);
        res.status(200).json({ success: true, message: "Department retrieved successfully", data: { department } });
    }
    catch (error) {
        next(error);
    }
};
exports.fetchDepartmentById = fetchDepartmentById;
const registerDepartment = async (req, res, next) => {
    try {
        const data = department_validator_1.createDepartmentSchema.parse(req.body);
        const department = await (0, department_service_1.createDepartment)(data, req.user?.id);
        res.status(201).json({ success: true, message: "Department created successfully", data: { department } });
    }
    catch (error) {
        next(error);
    }
};
exports.registerDepartment = registerDepartment;
const editDepartment = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const data = department_validator_1.updateDepartmentSchema.parse(req.body);
        const department = await (0, department_service_1.updateDepartment)(id, data, req.user?.id);
        res.status(200).json({ success: true, message: "Department updated successfully", data: { department } });
    }
    catch (error) {
        next(error);
    }
};
exports.editDepartment = editDepartment;
const removeDepartment = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        await (0, department_service_1.deleteDepartment)(id, req.user?.id);
        res.status(200).json({ success: true, message: "Department deactivated successfully", data: null });
    }
    catch (error) {
        next(error);
    }
};
exports.removeDepartment = removeDepartment;
const assignDoctor = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const data = department_validator_1.assignDoctorSchema.parse(req.body);
        const doctor = await (0, department_service_1.assignDoctorToDepartment)(id, data.doctorId, req.user?.id);
        res.status(200).json({ success: true, message: "Doctor assigned to department successfully", data: { doctor } });
    }
    catch (error) {
        next(error);
    }
};
exports.assignDoctor = assignDoctor;
const getDepartmentMetrics = async (req, res, next) => {
    try {
        const stats = await (0, department_service_1.getDepartmentStats)();
        res.status(200).json({ success: true, message: "Department statistics retrieved successfully", data: stats });
    }
    catch (error) {
        next(error);
    }
};
exports.getDepartmentMetrics = getDepartmentMetrics;
//# sourceMappingURL=department.controller.js.map