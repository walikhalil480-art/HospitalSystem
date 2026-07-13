import { Request, Response, NextFunction } from "express";
export declare const getAppointments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const fetchAppointmentById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const registerAppointment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const editAppointment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cancelAppointmentHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const removeAppointment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAppointmentSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=appointment.controller.d.ts.map