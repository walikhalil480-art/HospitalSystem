import { Response } from "express";
interface SuccessResponseOptions {
    res: Response;
    statusCode?: number;
    message: string;
    data?: unknown;
}
interface ErrorResponseOptions {
    res: Response;
    statusCode?: number;
    message: string;
    errors?: unknown[];
}
export declare const sendSuccess: ({ res, statusCode, message, data }: SuccessResponseOptions) => Response<any, Record<string, any>>;
export declare const sendError: ({ res, statusCode, message, errors }: ErrorResponseOptions) => Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=response.d.ts.map