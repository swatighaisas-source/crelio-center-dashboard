import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // The parameter-setup tool imports via "@/..."; scope it to its own subtree.
      "@": path.resolve(__dirname, "./src/parameter-setup"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: true,
    proxy: {
      "/api/cms": {
        target: "https://data.cms.gov",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/cms/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader(
              "User-Agent",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            );
            proxyReq.setHeader("Referer", "https://data.cms.gov/");
            proxyReq.setHeader("Origin", "https://data.cms.gov");
            proxyReq.setHeader("Accept", "application/json, text/plain, */*");
            proxyReq.setHeader("Accept-Language", "en-US,en;q=0.9");
          });
        },
      },
    },
  },
});
