import path from "path";
import { defineConfig } from "vitest/config";

process.env.NODE_ENV = "test";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup/transaction.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/configs/app.ts"),
      "@db": path.resolve(__dirname, "src/lib/db/database.ts"),
      "@module": path.resolve(__dirname, "src/modules"),
    },
  },
});
