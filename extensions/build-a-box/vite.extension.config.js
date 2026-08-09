import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import shopify from "vite-plugin-shopify";

export default defineConfig({
  cacheDir: "node_modules/.vite-extension",
  plugins: [
    shopify({
      themeRoot: ".",
    }),
    react(),
  ],
});