import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({ optimize: false }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.svg", "pwa-192.png", "pwa-512.png"],
      manifest: {
        name: "شبكة اكرم — إدارة الشبكة",
        short_name: "شبكة اكرم",
        description: "نظام إدارة أجهزة الشبكة للبشمهندس أكرم جميل",
        theme_color: "#38bdf8",
        background_color: "#0b0b0e",
        display: "standalone",
        orientation: "portrait",
        lang: "ar",
        dir: "rtl",
        start_url: "./",
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      }
    })
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") }
  },
  build: {
    outDir: "dist"
  },
  server: {
    port: 5173,
    host: true
  }
});
