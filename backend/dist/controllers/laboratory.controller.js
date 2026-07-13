"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editLabResult = exports.addLabResult = exports.removeLabOrder = exports.editLabOrder = exports.registerLabOrder = exports.fetchLabOrderById = exports.getLabOrders = exports.addLabTest = exports.getLabTests = exports.addLabCategory = exports.getLabCategories = void 0;
const laboratory_service_1 = require("../services/laboratory.service");
const laboratory_validator_1 = require("../validators/laboratory.validator");
const getStringParam = (val) => (Array.isArray(val) ? val[0] : val);
const getLabCategories = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", search } = req.query;
        const result = await (0, laboratory_service_1.listLaboratoryCategories)({ page: Number(page || 1), limit: Number(limit || 10), search: typeof search === "string" ? search : undefined });
        res.status(200).json({ success: true, message: "Laboratory categories retrieved successfully", data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.getLabCategories = getLabCategories;
const addLabCategory = async (req, res, next) => {
    try {
        const data = laboratory_validator_1.createLaboratoryCategorySchema.parse(req.body);
        const category = await (0, laboratory_service_1.createLaboratoryCategory)(data, req.user?.id);
        res.status(201).json({ success: true, message: "Laboratory category created successfully", data: { category } });
    }
    catch (error) {
        next(error);
    }
};
exports.addLabCategory = addLabCategory;
const getLabTests = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", search, categoryId } = req.query;
        const result = await (0, laboratory_service_1.listLaboratoryTests)({ page: Number(page || 1), limit: Number(limit || 10), search: typeof search === "string" ? search : undefined, categoryId: typeof categoryId === "string" ? categoryId : undefined });
        res.status(200).json({ success: true, message: "Laboratory tests retrieved successfully", data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.getLabTests = getLabTests;
const addLabTest = async (req, res, next) => {
    try {
        const data = laboratory_validator_1.createLaboratoryTestSchema.parse(req.body);
        const test = await (0, laboratory_service_1.createLaboratoryTest)(data, req.user?.id);
        res.status(201).json({ success: true, message: "Laboratory test created successfully", data: { test } });
    }
    catch (error) {
        next(error);
    }
};
exports.addLabTest = addLabTest;
const getLabOrders = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", search, patientId, doctorId, status, priority, date } = req.query;
        const result = await (0, laboratory_service_1.listLaboratoryOrders)({
            page: Number(page || 1),
            limit: Number(limit || 10),
            search: typeof search === "string" ? search : undefined,
            patientId: typeof patientId === "string" ? patientId : undefined,
            doctorId: typeof doctorId === "string" ? doctorId : undefined,
            status: typeof status === "string" ? status : undefined,
            priority: typeof priority === "string" ? priority : undefined,
            date: typeof date === "string" ? date : undefined,
        });
        res.status(200).json({ success: true, message: "Laboratory orders retrieved successfully", data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.getLabOrders = getLabOrders;
const fetchLabOrderById = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const order = await (0, laboratory_service_1.getLaboratoryOrderById)(id);
        res.status(200).json({ success: true, message: "Laboratory order retrieved successfully", data: { order } });
    }
    catch (error) {
        next(error);
    }
};
exports.fetchLabOrderById = fetchLabOrderById;
const registerLabOrder = async (req, res, next) => {
    try {
        const data = laboratory_validator_1.createLaboratoryOrderSchema.parse(req.body);
        const order = await (0, laboratory_service_1.createLaboratoryOrder)(data, req.user?.id);
        res.status(201).json({ success: true, message: "Laboratory order created successfully", data: { order } });
    }
    catch (error) {
        next(error);
    }
};
exports.registerLabOrder = registerLabOrder;
const editLabOrder = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const data = laboratory_validator_1.updateLaboratoryOrderSchema.parse(req.body);
        const order = await (0, laboratory_service_1.updateLaboratoryOrder)(id, data, req.user?.id);
        res.status(200).json({ success: true, message: "Laboratory order updated successfully", data: { order } });
    }
    catch (error) {
        next(error);
    }
};
exports.editLabOrder = editLabOrder;
const removeLabOrder = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        await (0, laboratory_service_1.deleteLaboratoryOrder)(id);
        res.status(200).json({ success: true, message: "Laboratory order removed successfully", data: null });
    }
    catch (error) {
        next(error);
    }
};
exports.removeLabOrder = removeLabOrder;
const addLabResult = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const data = laboratory_validator_1.createLaboratoryResultSchema.parse(req.body);
        const result = await (0, laboratory_service_1.createLaboratoryResult)(id, data, req.user?.id);
        res.status(201).json({ success: true, message: "Laboratory result added successfully", data: { result } });
    }
    catch (error) {
        next(error);
    }
};
exports.addLabResult = addLabResult;
const editLabResult = async (req, res, next) => {
    try {
        const id = getStringParam(req.params["id"]);
        const data = laboratory_validator_1.createLaboratoryResultSchema.parse(req.body);
        const result = await (0, laboratory_service_1.updateLaboratoryResult)(id, data, req.user?.id);
        res.status(200).json({ success: true, message: "Laboratory result updated successfully", data: { result } });
    }
    catch (error) {
        next(error);
    }
};
exports.editLabResult = editLabResult;
//# sourceMappingURL=laboratory.controller.js.map