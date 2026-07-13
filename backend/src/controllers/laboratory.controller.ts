import { Request, Response, NextFunction } from "express";
import { LaboratoryOrderPriority, LaboratoryOrderStatus, LaboratoryResultStatus } from "@prisma/client";
import {
  createLaboratoryCategory,
  createLaboratoryOrder,
  createLaboratoryResult,
  createLaboratoryTest,
  deleteLaboratoryOrder,
  getLaboratoryOrderById,
  listLaboratoryCategories,
  listLaboratoryOrders,
  listLaboratoryTests,
  updateLaboratoryOrder,
  updateLaboratoryResult,
} from "../services/laboratory.service";
import {
  createLaboratoryCategorySchema,
  createLaboratoryOrderSchema,
  createLaboratoryResultSchema,
  createLaboratoryTestSchema,
  updateLaboratoryOrderSchema,
  type CreateLaboratoryCategoryInput,
  type CreateLaboratoryOrderInput,
  type CreateLaboratoryResultInput,
  type CreateLaboratoryTestInput,
  type UpdateLaboratoryOrderInput,
} from "../validators/laboratory.validator";

const getStringParam = (val: string | string[] | undefined): string | undefined => (Array.isArray(val) ? val[0] : val);

export const getLabCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = "1", limit = "10", search } = req.query;
    const result = await listLaboratoryCategories({ page: Number(page || 1), limit: Number(limit || 10), search: typeof search === "string" ? search : undefined });
    res.status(200).json({ success: true, message: "Laboratory categories retrieved successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const addLabCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createLaboratoryCategorySchema.parse(req.body) as CreateLaboratoryCategoryInput;
    const category = await createLaboratoryCategory(data, req.user?.id);
    res.status(201).json({ success: true, message: "Laboratory category created successfully", data: { category } });
  } catch (error) {
    next(error);
  }
};

export const getLabTests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = "1", limit = "10", search, categoryId } = req.query;
    const result = await listLaboratoryTests({ page: Number(page || 1), limit: Number(limit || 10), search: typeof search === "string" ? search : undefined, categoryId: typeof categoryId === "string" ? categoryId : undefined });
    res.status(200).json({ success: true, message: "Laboratory tests retrieved successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const addLabTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createLaboratoryTestSchema.parse(req.body) as CreateLaboratoryTestInput;
    const test = await createLaboratoryTest(data, req.user?.id);
    res.status(201).json({ success: true, message: "Laboratory test created successfully", data: { test } });
  } catch (error) {
    next(error);
  }
};

export const getLabOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = "1", limit = "10", search, patientId, doctorId, status, priority, date } = req.query;
    const result = await listLaboratoryOrders({
      page: Number(page || 1),
      limit: Number(limit || 10),
      search: typeof search === "string" ? search : undefined,
      patientId: typeof patientId === "string" ? patientId : undefined,
      doctorId: typeof doctorId === "string" ? doctorId : undefined,
      status: typeof status === "string" ? (status as LaboratoryOrderStatus) : undefined,
      priority: typeof priority === "string" ? (priority as LaboratoryOrderPriority) : undefined,
      date: typeof date === "string" ? date : undefined,
    });
    res.status(200).json({ success: true, message: "Laboratory orders retrieved successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const fetchLabOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const order = await getLaboratoryOrderById(id);
    res.status(200).json({ success: true, message: "Laboratory order retrieved successfully", data: { order } });
  } catch (error) {
    next(error);
  }
};

export const registerLabOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createLaboratoryOrderSchema.parse(req.body) as CreateLaboratoryOrderInput;
    const order = await createLaboratoryOrder(data, req.user?.id);
    res.status(201).json({ success: true, message: "Laboratory order created successfully", data: { order } });
  } catch (error) {
    next(error);
  }
};

export const editLabOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const data = updateLaboratoryOrderSchema.parse(req.body) as UpdateLaboratoryOrderInput;
    const order = await updateLaboratoryOrder(id, data, req.user?.id);
    res.status(200).json({ success: true, message: "Laboratory order updated successfully", data: { order } });
  } catch (error) {
    next(error);
  }
};

export const removeLabOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    await deleteLaboratoryOrder(id);
    res.status(200).json({ success: true, message: "Laboratory order removed successfully", data: null });
  } catch (error) {
    next(error);
  }
};

export const addLabResult = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const data = createLaboratoryResultSchema.parse(req.body) as CreateLaboratoryResultInput;
    const result = await createLaboratoryResult(id, data, req.user?.id);
    res.status(201).json({ success: true, message: "Laboratory result added successfully", data: { result } });
  } catch (error) {
    next(error);
  }
};

export const editLabResult = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const data = createLaboratoryResultSchema.parse(req.body) as CreateLaboratoryResultInput;
    const result = await updateLaboratoryResult(id, data, req.user?.id);
    res.status(200).json({ success: true, message: "Laboratory result updated successfully", data: { result } });
  } catch (error) {
    next(error);
  }
};
