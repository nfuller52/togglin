import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

process.env.NODE_ENV = "test";

export default defineConfig({
  plugins: [
    tsconfigPaths({
      root: ".",
    }),
  ],
  test: {
    globals: true,
    environment: "node",
  },
});
