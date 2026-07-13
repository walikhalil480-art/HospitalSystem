import app from "./app";
import { env } from "./config/env";
import { logger } from "./logger";
import { prisma } from "./lib/prisma";

export { prisma } from "./lib/prisma";

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("✅ Database connected successfully");

    app.listen(env.PORT, () => {
      logger.info(`✅ Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error(error, "❌ Failed to start the server");
    process.exit(1);
  }
};

startServer();
