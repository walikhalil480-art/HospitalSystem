import { Request, Response, NextFunction } from "express";
import { createDepartmentSchema, updateDepartmentSchema, assignDoctorSchema } from "../validators/department.validator";
import {
  assignDoctorToDepartment,
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartmentStats,
  listDepartments,
  updateDepartment,
} from "../services/department.service";

const getStringParam = (val: string | string[] | undefined): string | undefined =>
  Array.isArray(val) ? val[0] : val;

export const getDepartments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = "1", limit = "10", search } = req.query;
    const result = await listDepartments({
      page: Number(page || 1),
      limit: Number(limit || 10),
      search: typeof search === "string" ? search : undefined,
    });

    res.status(200).json({ success: true, message: "Departments retrieved successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const fetchDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const department = await getDepartmentById(id);
    res.status(200).json({ success: true, message: "Department retrieved successfully", data: { department } });
  } catch (error) {
    next(error);
  }
};

export const registerDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createDepartmentSchema.parse(req.body);
    const department = await createDepartment(data, req.user?.id);
    res.status(201).json({ success: true, message: "Department created successfully", data: { department } });
  } catch (error) {
    next(error);
  }
};

export const editDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const data = updateDepartmentSchema.parse(req.body);
    const department = await updateDepartment(id, data, req.user?.id);
    res.status(200).json({ success: true, message: "Department updated successfully", data: { department } });
  } catch (error) {
    next(error);
  }
};

export const removeDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    await deleteDepartment(id, req.user?.id);
    res.status(200).json({ success: true, message: "Department deactivated successfully", data: null });
  } catch (error) {
    next(error);
  }
};

export const assignDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const data = assignDoctorSchema.parse(req.body);
    const doctor = await assignDoctorToDepartment(id, data.doctorId, req.user?.id);
    res.status(200).json({ success: true, message: "Doctor assigned to department successfully", data: { doctor } });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getDepartmentStats();
    res.status(200).json({ success: true, message: "Department statistics retrieved successfully", data: stats });
  } catch (error) {
    next(error);
  }
};
