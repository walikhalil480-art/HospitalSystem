import { Request, Response, NextFunction } from "express";
export declare const getMedicalRecords: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const fetchMedicalRecordById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const registerMedicalRecord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const editMedicalRecord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const removeMedicalRecord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPatientHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPatientVisitHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=medical-record.controller.d.ts.map