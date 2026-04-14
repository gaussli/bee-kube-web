import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 添加全局 SCSS 变量文件
        additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // 本地 mock 服务
        changeOrigin: true,
      },
    },
  },
});
