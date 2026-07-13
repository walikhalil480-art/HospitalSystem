import { Request, Response, NextFunction } from "express";
import {
  cancelAppointment,
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointmentStats,
  listAppointments,
  updateAppointment,
} from "../services/appointment.service";
import { createAppointmentSchema, updateAppointmentSchema } from "../validators/appointment.validator";
import { AppointmentStatus } from "@prisma/client";

const getStringParam = (val: string | string[] | undefined): string | undefined =>
  Array.isArray(val) ? val[0] : val;

export const getAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = "1", limit = "10", search, doctorId, patientId, departmentId, date, status, today } = req.query;
    const result = await listAppointments({
      page: Number(page || 1),
      limit: Number(limit || 10),
      search: typeof search === "string" ? search : undefined,
      doctorId: typeof doctorId === "string" ? doctorId : undefined,
      patientId: typeof patientId === "string" ? patientId : undefined,
      departmentId: typeof departmentId === "string" ? departmentId : undefined,
      date: typeof date === "string" ? date : undefined,
      status: typeof status === "string" ? (status as AppointmentStatus) : undefined,
      today: typeof today === "string" ? today === "true" : undefined,
    });

    res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const appointment = await getAppointmentById(id);

    res.status(200).json({
      success: true,
      message: "Appointment retrieved successfully",
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
};

export const registerAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createAppointmentSchema.parse(req.body);
    const appointment = await createAppointment(data, req.user?.id);

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
};

export const editAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const data = updateAppointmentSchema.parse(req.body);
    const appointment = await updateAppointment(id, data, req.user?.id);

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointmentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    const appointment = await cancelAppointment(id, req.user?.id);

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
};

export const removeAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getStringParam(req.params["id"]) as string;
    await deleteAppointment(id);

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getAppointmentStats();
    res.status(200).json({
      success: true,
      message: "Appointment summary retrieved successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
