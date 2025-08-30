// vite.config.ts

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // enable SW in dev so you can demo offline
        type: "module",
      },
      includeAssets: [
        "robots.txt",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
        "pwa-512x512-maskable.png",
      ],
      manifest: {
        name: "Nihil",
        short_name: "Nihil",
        theme_color: "#0ea5e9",
        background_color: "#0b1220",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/pwa-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            // function receives {url, event, request}
            urlPattern: ({ url }) => {
              // only match API calls
              if (!/\/api\/.+/.test(url.pathname)) return false;

              // allowed hosts
              const allowed = [
                "localhost:3001",
                "localhost:3002",
                new URL(process.env.VITE_USER_SERVICE_API_URL ?? "").host,
                new URL(process.env.VITE_POST_SERVICE_API_URL ?? "").host,
              ].filter(Boolean);

              return allowed.includes(url.host);
            },
            handler: "NetworkFirst",
            options: {
              cacheName: "nihil-api",
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@nihil_frontend": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
