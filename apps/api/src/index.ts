import { app } from "@app";
import { db } from "@db";
import { createServer } from "@/server";

async function main() {
  const server = await createServer();
  const port = app.env.PORT;

  server.listen(port, () => {
    console.info(`◆ Togglin API booted on http://localhost:${port}`);
    console.info(
      `➜ Running in ${app.env.NODE_ENV} mode (NODE_ENV=${app.env.NODE_ENV})`,
    );
  });
}

process.on("SIGINT", async () => {
  console.info("◆ Togglin API shutting down...");

  // Close the db connection
  try {
    await db.destroy();
  } catch (err) {
    console.error("Failed to shut down DB pool:", err);
  }

  process.exit(0);
});

main().catch((error) => {
  console.error("Failed to start app:", error);
  process.exit(1);
});
