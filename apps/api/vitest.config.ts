import path from "path";
import { defineConfig } from "vitest/config";

process.env.NODE_ENV = "test";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/configs/app.ts"),
      "@db": path.resolve(__dirname, "src/lib/db/database.ts"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@logger": path.resolve(__dirname, "src/lib/logging/index.ts"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@shared": path.resolve(__dirname, "../../libs/shared/src"),
      "@tests": path.resolve(__dirname, "tests"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    projects: [
      {
        // --- unit tests (queries and service) ---
        extends: true,
        test: {
          name: "unit",
          include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
          exclude: ["src/**/integration/*.test.ts"],
          setupFiles: ["tests/setup/transaction.ts"],
        },
      },
      {
        // --- integration tests ---
        extends: true,
        test: {
          name: "integration",
          include: ["src/**/integration/*.test.ts"],
          setupFiles: ["tests/setup/truncate.ts"],
        },
      },
    ],
  },
});
