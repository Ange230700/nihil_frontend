// nihil_frontend\vite.config.ts

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";
import i18nVersionPlugin from "./build/i18nVersionPlugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Safe fallbacks in dev so new URL(...) doesn't throw
  const USER_URL = env.VITE_USER_SERVICE_API_URL || "http://localhost:3001";
  const POST_URL = env.VITE_POST_SERVICE_API_URL || "http://localhost:3002";

  // Build the API host list at build time
  const hosts = Array.from(
    new Set([new URL(USER_URL).host, new URL(POST_URL).host]),
  );

  // Escape for regex and create a literal that Workbox can embed
  const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const hostPattern = hosts.map(escapeRe).join("|");
  const apiRegex = new RegExp(`^https?:\\/\\/(${hostPattern})\\/api(\\/|$)`);

  return {
    plugins: [
      i18nVersionPlugin({ locales: ["src/i18n/en.json", "src/i18n/fr.json"] }),
      tailwindcss(),
      react(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: { enabled: true, type: "module" },
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
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            // ✅ Use a RegExp so no external variables are needed in the SW
            {
              urlPattern: apiRegex,
              handler: "NetworkFirst",
              options: {
                cacheName: "nihil-api",
                networkTimeoutSeconds: 3,
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.startsWith("/themes/") &&
                url.pathname.endsWith(".css"),
              handler: "CacheFirst",
              options: {
                cacheName: "prime-themes",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
    ],
    resolve: { alias: { "@nihil_frontend": resolve(__dirname, "src") } },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/tests/setup.ts"],
      coverage: { reporter: ["text", "html"] },
    },
  };
});
