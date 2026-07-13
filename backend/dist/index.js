"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./logger");
const prisma_1 = require("./lib/prisma");
var prisma_2 = require("./lib/prisma");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return prisma_2.prisma; } });
const startServer = async () => {
    try {
        await prisma_1.prisma.$connect();
        logger_1.logger.info("✅ Database connected successfully");
        app_1.default.listen(env_1.env.PORT, () => {
            logger_1.logger.info(`✅ Server is running on port ${env_1.env.PORT} in ${env_1.env.NODE_ENV} mode`);
        });
    }
    catch (error) {
        logger_1.logger.error(error, "❌ Failed to start the server");
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map