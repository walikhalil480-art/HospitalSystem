import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  editMedicalRecord,
  fetchMedicalRecordById,
  getMedicalRecords,
  getPatientHistory,
  getPatientVisitHistory,
  registerMedicalRecord,
  removeMedicalRecord,
} from "../controllers/medical-record.controller";

const router = Router();

router.use(requireAuth);

router.get("/history/:patientId", getPatientHistory);
router.get("/visit-history/:patientId", getPatientVisitHistory);
router.get("/", getMedicalRecords);
router.get("/:id", fetchMedicalRecordById);
router.post("/", registerMedicalRecord);
router.put("/:id", editMedicalRecord);
router.delete("/:id", removeMedicalRecord);

export default router;
