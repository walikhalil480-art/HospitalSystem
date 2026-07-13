import { Request, Response, NextFunction } from "express";
import { createDoctorSchema, updateDoctorSchema } from "../validators/doctor.validator";
import { createDoctor, deleteDoctor, getDoctorById, listDoctors, updateDoctor } from "../services/doctor.service";

const getStringParam = (val: string | string[] | undefined): string | undefined =>
  Array.isArray(val) ? val[0] : val;

export const getDoctors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = "1", limit = "10", search, departmentId, status, availability } = req.query;
    const result = await listDoctors({
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
  } catch (error) {
    next(error);
  }
};

export const fetchDoctorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const doctor = await getDoctorById(id);

    res.status(200).json({
      success: true,
      message: "Doctor retrieved successfully",
      data: { doctor },
    });
  } catch (error) {
    next(error);
  }
};

export const registerDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createDoctorSchema.parse(req.body);
    const doctor = await createDoctor(data, req.user?.id);

    res.status(201).json({
      success: true,
      message: "Doctor created successfully. Default password: Doctor@123",
      data: { doctor },
    });
  } catch (error) {
    next(error);
  }
};

export const editDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const data = updateDoctorSchema.parse(req.body);
    const doctor = await updateDoctor(id, data, req.user?.id);

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: { doctor },
    });
  } catch (error) {
    next(error);
  }
};

export const removeDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    await deleteDoctor(id, req.user?.id);

    res.status(200).json({
      success: true,
      message: "Doctor deactivated successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
