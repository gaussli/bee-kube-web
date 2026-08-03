/**
 * Bee Kube Vite 构建配置文件
 * @description
 * 基于 Vite 的前端构建工具链，配置以下核心能力：
 *   1. Vue SFC 编译     — @vitejs/plugin-vue
 *   2. SVG 图标精灵图   — 自动生成 SVG sprite，通过 <svg><use> 引用
 *   3. 路径别名         — @ → src/，@components → src/components/
 *   4. 全局 SCSS 变量   — 所有组件/scss文件自动注入 variables.scss
 *   5. 开发代理         — /api 请求转发到本地后端/Mock 服务
 */

import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
  /* ======================================================================
   * 插件
   * ====================================================================== */
  plugins: [
    /* ------------------------------------------------------------------
     * 1. @vitejs/plugin-vue
     *    Vue 3 SFC 编译插件，处理 .vue 文件中 template/script/style 的
     *    编译和 HMR 热更新
     * ------------------------------------------------------------------ */
    vue(),

    /* ------------------------------------------------------------------
     * 2. vite-plugin-svg-icons
     *    扫描 src/assets/icons 下的所有 SVG 文件，在构建时生成 SVG
     *    sprite（symbol 模式），通过 <svg><use href="#icon-[name]"></use>
     *    引用图标，避免重复加载和 HTTP 请求。
     *
     *    symbolId 规则：icon-[目录]-[文件名]
     *    示例：src/assets/icons/common/home.svg → icon-common-home
     *
     *    SVGO 优化：移除 SVG 自身的 fill/stroke 属性，
     *    使得图标颜色可通过 CSS color 属性控制（继承父元素颜色）
     * ------------------------------------------------------------------ */
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, 'src/assets/icons')],  // SVG 图标存放目录
      symbolId: 'icon-[dir]-[name]',                       // 生成的 symbol ID 格式
      svgoOptions: {
        plugins: [
          {
            name: 'removeAttrs',
            params: {
              attrs: '(fill|stroke)'  // 移除内联 fill 和 stroke，让图标可通过 CSS 控制颜色
            }
          }
        ]
      }
    })
  ],

  /* ======================================================================
   * 路径别名（resolve.alias）
   *    在 import 语句中简写路径，避免深层嵌套的相对路径 ../../
   *    @components 别名专门用于简化跨目录组件引用
   * ====================================================================== */
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),                              // @/api/xxx → src/api/xxx
      '@components': resolve(__dirname, 'src/components')          // @components/BeeCard → src/components/BeeCard
    }
  },

  /* ======================================================================
   * CSS 预处理器配置
   *    通过 additionalData 在每个 .vue / .scss 文件编译时自动注入
   *    SCSS 全局变量文件，无需手动 @use 即可使用变量（如 $color-primary）
   *    as * 表示将所有变量、mixin、function 暴露到全局命名空间
   * ====================================================================== */
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`  // 全局注入 SCSS 变量
      }
    }
  },

  /* ======================================================================
   * 开发服务器
   *    本地端口默认 5173，/api 路径的请求会被代理转发到后端服务。
   *    与 .env.development 中 VITE_API_BASE_URL=/api 配合使用，
   *    前端请求 /api/xxx → 代理转发到 http://localhost:3000/api/xxx
   *
   *    若启用 Mock 模式（VITE_USE_MOCK=true），则请求被 axios mock
   *    adapter 拦截，不会经过此代理
   * ====================================================================== */
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 本地后端/Mock 服务地址
        changeOrigin: true               // 修改请求头中的 origin 为目标地址
      }
    }
  }
})
