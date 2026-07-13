"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = ({ res, statusCode = 200, message, data }) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data: data ?? null,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = ({ res, statusCode = 500, message, errors }) => {
    const body = {
        success: false,
        message,
    };
    if (errors && errors.length > 0) {
        body.errors = errors;
    }
    return res.status(statusCode).json(body);
};
exports.sendError = sendError;
//# sourceMappingURL=response.js.map