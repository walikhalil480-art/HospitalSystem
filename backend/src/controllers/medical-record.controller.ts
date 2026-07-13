import { Request, Response, NextFunction } from "express";
import {
  createMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecordById,
  getPatientMedicalHistory,
  getVisitHistory,
  listMedicalRecords,
  updateMedicalRecord,
} from "../services/medical-record.service";
import { createMedicalRecordSchema, updateMedicalRecordSchema } from "../validators/medical-record.validator";
import { MedicalRecordStatus } from "@prisma/client";

const getStringParam = (val: string | string[] | undefined): string | undefined =>
  Array.isArray(val) ? val[0] : val;

export const getMedicalRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = "1", limit = "10", search, patientId, doctorId, date, status } = req.query;
    const result = await listMedicalRecords({
      page: Number(page || 1),
      limit: Number(limit || 10),
      search: typeof search === "string" ? search : undefined,
      patientId: typeof patientId === "string" ? patientId : undefined,
      doctorId: typeof doctorId === "string" ? doctorId : undefined,
      date: typeof date === "string" ? date : undefined,
      status: typeof status === "string" ? (status as MedicalRecordStatus) : undefined,
    });

    res.status(200).json({ success: true, message: "Medical records retrieved successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const fetchMedicalRecordById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const medicalRecord = await getMedicalRecordById(id);
    res.status(200).json({ success: true, message: "Medical record retrieved successfully", data: { medicalRecord } });
  } catch (error) {
    next(error);
  }
};

export const registerMedicalRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createMedicalRecordSchema.parse(req.body);
    const medicalRecord = await createMedicalRecord(data, req.user?.id);
    res.status(201).json({ success: true, message: "Medical record created successfully", data: { medicalRecord } });
  } catch (error) {
    next(error);
  }
};

export const editMedicalRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const data = updateMedicalRecordSchema.parse(req.body);
    const medicalRecord = await updateMedicalRecord(id, data, req.user?.id);
    res.status(200).json({ success: true, message: "Medical record updated successfully", data: { medicalRecord } });
  } catch (error) {
    next(error);
  }
};

export const removeMedicalRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    await deleteMedicalRecord(id, req.user?.id);
    res.status(200).json({ success: true, message: "Medical record deleted successfully", data: null });
  } catch (error) {
    next(error);
  }
};

export const getPatientHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientId = getStringParam(req.params["patientId"]) as string;
    const history = await getPatientMedicalHistory(patientId);
    res.status(200).json({ success: true, message: "Patient medical history retrieved successfully", data: { history } });
  } catch (error) {
    next(error);
  }
};

export const getPatientVisitHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientId = getStringParam(req.params["patientId"]) as string;
    const history = await getVisitHistory(patientId);
    res.status(200).json({ success: true, message: "Patient visit history retrieved successfully", data: { history } });
  } catch (error) {
    next(error);
  }
};
