import { Request, Response, NextFunction } from "express";
import { createPatientSchema, updatePatientSchema } from "../validators/patient.validator";
import {
  createPatient,
  deletePatient,
  getPatientById,
  listPatients,
  updatePatient,
} from "../services/patient.service";

const getStringParam = (val: string | string[] | undefined): string | undefined =>
  Array.isArray(val) ? val[0] : val;

export const getPatients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = "1", limit = "10", search } = req.query;
    const result = await listPatients({
      page: Number(page || 1),
      limit: Number(limit || 10),
      search: typeof search === "string" ? search : undefined,
    });

    res.status(200).json({
      success: true,
      message: "Patients retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchPatientById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const patient = await getPatientById(id);

    res.status(200).json({
      success: true,
      message: "Patient retrieved successfully",
      data: { patient },
    });
  } catch (error) {
    next(error);
  }
};

export const registerPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createPatientSchema.parse(req.body);
    const patient = await createPatient(data, req.user?.id);

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: { patient },
    });
  } catch (error) {
    next(error);
  }
};

export const editPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const data = updatePatientSchema.parse(req.body);
    const patient = await updatePatient(id, data, req.user?.id);

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: { patient },
    });
  } catch (error) {
    next(error);
  }
};

export const removePatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    await deletePatient(id, req.user?.id);

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
