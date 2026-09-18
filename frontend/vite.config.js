import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import path from "node:path";

const frontendDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(frontendDir, "..");

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.jsonl"],
  server: {
    port: 5173,
    open: true,
    fs: {
      allow: [frontendDir, repoRoot],
    },
  },
});
