import { app } from "@app";
import { db } from "@db";
import { logger } from "@logger";
import { createServer } from "@/server";

import "@/types/global";

async function main() {
  const server = await createServer();
  const port = app.env.PORT;

  server.listen(port, () => {
    logger.info(`Togglin API booted on http://localhost:${port}`);
    logger.info(
      `Running in ${app.env.NODE_ENV} mode (NODE_ENV=${app.env.NODE_ENV})`,
    );
  });
}

process.on("SIGINT", async () => {
  logger.info("Togglin API shutting down...");

  // Close the db connection
  try {
    await db.destroy();
  } catch (err) {
    logger.error("Failed to shut down DB pool:", err);
  }

  process.exit(0);
});

main().catch((error) => {
  logger.error("Failed to start app:", error);
  process.exit(1);
});
