"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const AppError_1 = require("../errors/AppError");
const logger_1 = require("../logger");
const zod_1 = require("zod");
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    logger_1.logger.error({ err, url: req.url, method: req.method }, err.message);
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    }
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    // Unknown errors - do NOT leak details in production
    const message = process.env.NODE_ENV === "development" ? err.message : "Internal server error";
    res.status(500).json({
        success: false,
        message,
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`,
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map