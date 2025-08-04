// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  test: {
    environment: "jsdom", // so React DOM rendering works
    globals: true, // so you can use describe/it without imports
    setupFiles: [], // you can add setup files later if you want
    coverage: {
      // optional, but nice to have
      reporter: ["text", "html"],
    },
  },
});
