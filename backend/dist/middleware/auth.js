"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const AppError_1 = require("../errors/AppError");
const jwt_1 = require("../utils/jwt");
const index_1 = require("../index");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError_1.UnauthorizedError("Authentication token is missing or invalid");
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded || !decoded["userId"]) {
            throw new AppError_1.UnauthorizedError("Invalid or expired token");
        }
        const user = await index_1.prisma.user.findUnique({
            where: { id: decoded["userId"] },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                phone: true,
            },
        });
        if (!user || !user.isActive) {
            throw new AppError_1.UnauthorizedError("User does not exist or is inactive");
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.requireAuth = requireAuth;
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError_1.UnauthorizedError("Authentication required"));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.ForbiddenError("You do not have permission to perform this action"));
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map