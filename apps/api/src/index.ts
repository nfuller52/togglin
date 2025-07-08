import { config } from "@/configs";
import { createServer } from "@/server";

async function main() {
  const server = await createServer();

  const port = config.env.PORT;

  server.listen(port, () => {
    console.info(`◆ Togglin API booted on http://localhost:${port}`);
    console.info(
      `➜ Running in ${config.env.NODE_ENV} mode (NODE_ENV=${config.env.NODE_ENV})`,
    );
  });
}

main().catch((error) => {
  console.error("Failed to start app:", error);
  process.exit(1);
});
