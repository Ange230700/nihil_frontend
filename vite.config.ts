// vite.config.ts

import {
  defineConfig,
  loadEnv,
  type HtmlTagDescriptor,
  type Plugin,
} from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Safe URL helpers with sensible dev fallbacks
  const USER_URL = env.VITE_USER_SERVICE_API_URL;
  const POST_URL = env.VITE_POST_SERVICE_API_URL;
  // Derive allowed API origins from your VITE_* URLs (fallbacks for local dev)
  const userOrigin = new URL(USER_URL).origin;
  const postOrigin = new URL(POST_URL).origin;
  const apiHosts = Array.from(
    new Set([new URL(USER_URL).host, new URL(POST_URL).host]),
  );

  const isDev = mode === "development";

  if (!isDev && (!USER_URL || !POST_URL)) {
    throw new Error("Missing VITE_* API URLs in production.");
  }

  const cspPlugin = (): Plugin => ({
    name: "nihil-csp",
    enforce: "pre",
    transformIndexHtml(): HtmlTagDescriptor[] {
      const connect = isDev
        ? "'self' ws: http: https:" // dev: allow Vite HMR + any localhost APIs
        : `'self' ${userOrigin} ${postOrigin}`;

      const csp = [
        "default-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'",
        // Images/fonts from self + data/blob (avatars, inlined assets)
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        // React inline style props & some third-party components use inline styles
        "style-src 'self' 'unsafe-inline'",
        // Dev needs eval for HMR; drop it in production
        isDev ? `script-src 'self' 'unsafe-eval'` : `script-src 'self'`,
        // XHR/fetch/websocket targets
        `connect-src ${connect}`,
        // Service workers/workers
        `worker-src 'self' blob:`,
        `manifest-src 'self'`,
        // Optional: upgrade mixed content if you ever serve behind HTTPS only
        // `upgrade-insecure-requests`,
      ].join("; ");
      return [
        {
          tag: "meta",
          injectTo: "head-prepend",
          attrs: { "http-equiv": "Content-Security-Policy", content: csp },
        },
      ];
    },
  });

  return {
    plugins: [
      cspPlugin(),
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
          cleanupOutdatedCaches: true,
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          navigateFallback: "/index.html",
          runtimeCaching: [
            // 🔹 API (dev + prod) — NetworkFirst
            {
              urlPattern: ({ url }) =>
                apiHosts.includes(url.host) && /\/api(\/|$)/.test(url.pathname),
              handler: "NetworkFirst",
              options: {
                cacheName: "nihil-api",
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 1 day
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            // 🔹 Prime themes CSS — CacheFirst
            {
              urlPattern: ({ url }) =>
                url.pathname.startsWith("/themes/") &&
                url.pathname.endsWith(".css"),
              handler: "CacheFirst",
              options: {
                cacheName: "prime-themes",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
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
      setupFiles: ["./src/tests/setup.ts"], // if you add it
      coverage: { reporter: ["text", "html"] },
    },
  };
});
