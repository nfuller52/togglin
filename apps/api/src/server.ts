import { createApp } from "@/app";

export async function createServer() {
  const app = await createApp();

  return app;
}
