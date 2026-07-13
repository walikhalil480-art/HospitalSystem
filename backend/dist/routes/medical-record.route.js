"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const medical_record_controller_1 = require("../controllers/medical-record.controller");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.get("/history/:patientId", medical_record_controller_1.getPatientHistory);
router.get("/visit-history/:patientId", medical_record_controller_1.getPatientVisitHistory);
router.get("/", medical_record_controller_1.getMedicalRecords);
router.get("/:id", medical_record_controller_1.fetchMedicalRecordById);
router.post("/", medical_record_controller_1.registerMedicalRecord);
router.put("/:id", medical_record_controller_1.editMedicalRecord);
router.delete("/:id", medical_record_controller_1.removeMedicalRecord);
exports.default = router;
//# sourceMappingURL=medical-record.route.js.map