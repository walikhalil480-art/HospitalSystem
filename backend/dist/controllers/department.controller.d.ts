import { Request, Response, NextFunction } from "express";
export declare const getDepartments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const fetchDepartmentById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const registerDepartment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const editDepartment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const removeDepartment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const assignDoctor: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDepartmentMetrics: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=department.controller.d.ts.map