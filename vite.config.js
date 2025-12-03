import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { cwd } from "process";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    "@": path.resolve(cwd(), "src"),
  },
});
