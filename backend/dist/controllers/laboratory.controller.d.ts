import { Request, Response, NextFunction } from "express";
export declare const getLabCategories: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const addLabCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getLabTests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const addLabTest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getLabOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const fetchLabOrderById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const registerLabOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const editLabOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const removeLabOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const addLabResult: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const editLabResult: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=laboratory.controller.d.ts.map