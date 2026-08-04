/**
 * Bee Kube ESLint 配置文件（Flat Config 模式，ESLint v9+）
 * @description
 * 以下配置按数组顺序依次应用，后声明的规则会覆盖前声明的同规则定义：
 *   1. 全局忽略     — node_modules、构建产物、环境变量文件
 *   2. 内置推荐     — ESLint 官方推荐的 JS 规则集
 *   3. 全局变量     — 定义浏览器和 Node.js 环境变量，避免未定义错误
 *   4. 未使用导入   — 自动检测并标记未被引用的 import 语句
 *   5. Vue 解析器   — 解析 .vue 文件，内部委托 TypeScript 解析器处理 <script lang="ts">
 *   6. TypeScript   — 类型安全重复声明检测、变量命名约束
 *   7. Import 排序  — 强制导入语句按分组和字母序排列
 *   8. Prettier     — 统一代码格式化，关闭冲突规则
 */

import js from '@eslint/js'
import tseslintPlugin from '@typescript-eslint/eslint-plugin'
import tseslintParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import jsdoc from 'eslint-plugin-jsdoc'
import unusedImports from 'eslint-plugin-unused-imports'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import * as parserVue from 'vue-eslint-parser'

export default [
  /* ======================================================================
   * 1. 全局忽略
   *    以下目录和文件不会被 ESLint 检查
   * ====================================================================== */
  {
    ignores: [
      'node_modules', // 依赖目录
      'dist',          // Vite 构建产物
      '*.local',       // 本地配置文件
      '.env*'          // 环境变量文件
    ]
  },

  /* ======================================================================
   * 2. ESLint 内置推荐规则
   *    包含 no-undef / no-unused-vars 等基础 JS 检查
   * ====================================================================== */
  js.configs.recommended,

  /* ======================================================================
   * 3. 全局变量定义
   *    声明当前环境可用的全局变量，避免 no-undef 误报
   * ====================================================================== */
  {
    files: ['**/*'],
    languageOptions: {
      globals: {
        ...globals.browser, // document / console / localStorage / window 等浏览器 API
        ...globals.node     // process / __dirname / module 等 Node.js API
      }
    }
  },

  /* ======================================================================
   * 4. JSDoc 注释规范（eslint-plugin-jsdoc）
   *    对齐项目编码规范：文件级 @module 注释 + 导出函数 @param/@returns。
   *    先用 warn 级别摸底，后续可逐步收紧为 error。
   * ====================================================================== */
  {
    files: ['**/*.ts', '**/*.vue', '**/*.tsx'],
    plugins: { jsdoc },
    rules: {
      // --- 要求导出函数/类有 JSDoc ---
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: true,                          // 仅检查导出符号
          require: {
            FunctionDeclaration: true,               // function foo() {}
            MethodDefinition: true,                  // class 中的方法
            ClassDeclaration: true,                  // class Foo {}
            ArrowFunctionExpression: false,          // 跳过箭头函数（回调和组件 setup 太常见）
            FunctionExpression: false                // 跳过函数表达式
          }
        }
      ],
      // --- 有 JSDoc 的函数必须写明 @param ---
      'jsdoc/require-param': 'warn',
      // --- 有返回值的函数必须写明 @returns ---
      'jsdoc/require-returns': 'warn',
      // --- 参数名必须与实际一致（防止拷贝后未更新）---
      'jsdoc/check-param-names': 'warn'
    }
  },

  /* ======================================================================
   * 5. 未使用导入检测（unused-imports 插件）
   *    关掉 ESLint 原生的 no-unused-vars（与 TS 版本冲突），
   *    改用 unused-imports 插件单独检测未被引用的 import 语句。
   *    执行 pnpm lint 时会自动移除这些冗余导入。
   * ====================================================================== */
  {
    files: ['**/*'],
    plugins: {
      'unused-imports': unusedImports,
      import: importPlugin
    },
    rules: {
      'no-unused-vars': 'off',                     // 关闭 ESLint 原生规则，避免与 @typescript-eslint 冲突
      'unused-imports/no-unused-imports': 'error'  // 标记所有未被引用的 import 为错误
    }
  },

  /* ======================================================================
   * 5. Vue 推荐规则集（eslint-plugin-vue flat/recommended）
   *    包含 118 条规则，覆盖 essential（错误预防）+ strongly-recommended（可读性）+
   *    recommended（最佳实践）。先应用推荐规则，后续 Block 5a 再做项目级覆盖。
   * ====================================================================== */
  ...pluginVue.configs['flat/recommended'],

  /* ======================================================================
   * 5a. Vue 文件解析器 + 项目级规则覆盖
   *     .vue 文件使用 vue-eslint-parser 作为顶层解析器，委托 TypeScript 解析器
   *     处理 <script lang="ts">。此处对 Vue 推荐规则做项目定制，并注入
   *     @typescript-eslint 规则，确保 .vue 文件中的 TS 代码与 .ts 文件享有同等检查。
   * ====================================================================== */
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,          // Vue SFC 解析器（处理 template / script / style）
      parserOptions: {
        ecmaVersion: 'latest',            // 使用最新 ECMAScript 语法标准
        sourceType: 'module',             // ES Module 模式
        parser: tseslintParser,           // <script lang="ts"> 委托给 TypeScript 解析器
        projectService: true,             // 启用 TS 项目服务，支持类型感知规则
        tsconfigRootDir: import.meta.dirname,  // 项目根目录
        extraFileExtensions: ['.vue']     // 让 TS 解析器识别 .vue SFC 文件
      }
    },
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': tseslintPlugin
    },
    rules: {
      // --- Vue 规则项目级覆盖 ---
      'vue/multi-word-component-names': 'off',               // 允许单单词组件名（如 Index / Login）
      'vue/no-v-html': 'off',                                // 允许 v-html（YAML 高亮等场景需要）
      'vue/require-toggle-inside-transition': 'off',         // 页面入场动画无需 v-if/v-show（静态子元素 + mode="out-in" 即可）

      // --- TypeScript 规则（与 Block 6 保持一致，确保 .vue 脚本享有同等检查）---
      'no-redeclare': 'off',                              // 关闭 ESLint 原生规则
      '@typescript-eslint/no-redeclare': 'error',         // 启用 TS 版本（兼容类型声明和接口重复检测）
      '@typescript-eslint/no-explicit-any': 'off',        // 允许显式 any（渐进式迁移）
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',                                    // 检查所有变量声明
          varsIgnorePattern: '^_',                        // _ 前缀变量允许未使用
          args: 'all',                                    // 检查所有函数参数
          argsIgnorePattern: '^_'                         // _ 前缀参数允许未使用
        }
      ],
      'no-prototype-builtins': 'off',                     // 允许直接调用 hasOwnProperty 等原型方法

      // --- 类型感知规则（需 projectService）---
      '@typescript-eslint/no-floating-promises': 'error', // 禁止未处理的 Promise（await/.then/.catch）
      '@typescript-eslint/await-thenable': 'error',       // 禁止对非 Promise 对象使用 await
      '@typescript-eslint/no-misused-promises': 'error'   // 禁止在需要布尔/数组的地方误用 Promise
    }
  },

  /* ======================================================================
   * 6. TypeScript 规则
   *    覆盖 .ts / .tsx 文件及 vite.config.ts
   *    — 启用 @typescript-eslint 版本的 no-redeclare（类型安全）
   *    — 允许显式 any（渐进式类型迁移，但建议逐步收紧）
   *    — 禁止未使用变量，但 _ 前缀变量（占位符 / 解构剩余）例外
   * ====================================================================== */
  {
    files: ['**/*.ts', '**/*.tsx', 'vite.config.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,             // 启用 TS 项目服务，支持类型感知规则
        tsconfigRootDir: import.meta.dirname  // 项目根目录
      }
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin
    },
    rules: {
      'no-redeclare': 'off',                              // 关闭 ESLint 原生规则
      '@typescript-eslint/no-redeclare': 'error',         // 启用 TS 版本（兼容类型声明和接口重复检测）
      '@typescript-eslint/no-explicit-any': 'off',        // 允许显式 any（可通过改为 'warn' 逐步收紧）
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',                                    // 检查所有变量声明
          varsIgnorePattern: '^_',                        // 以 _ 开头的变量允许未使用（如 _unused）
          args: 'all',                                    // 检查所有函数参数
          argsIgnorePattern: '^_'                         // 以 _ 开头的参数允许未使用（如 _event）
        }
      ],
      'no-prototype-builtins': 'off',                     // 允许直接在对象上调用 hasOwnProperty 等原型方法

      // --- 类型感知规则（需 projectService）---
      '@typescript-eslint/no-floating-promises': 'error', // 禁止未处理的 Promise（await/.then/.catch）
      '@typescript-eslint/await-thenable': 'error',       // 禁止对非 Promise 对象使用 await
      '@typescript-eslint/no-misused-promises': 'error'   // 禁止在需要布尔/数组的地方误用 Promise
    }
  },

  /* ======================================================================
   * 7. Import/Order 导入排序规则
   *    强制所有文件中的导入语句按分组和字母序排列，确保项目代码风格统一。
   *
   *    分组顺序（从上到下）：
   *    ┌────────────┬──────────────────────────────────────────────────────────┐
   *    │ 分组       │ 匹配内容                                                   │
   *    ├────────────┼──────────────────────────────────────────────────────────┤
   *    │ external   │ vue（最前）→ vue-router → pinia → axios → element-plus   │
   *    │            │ → @element-plus/**                                       │
   *    ├────────────┼──────────────────────────────────────────────────────────┤
   *    │ internal   │ @/utils/** → @/types/** → @/api/** → @/mock              │
   *    │            │ → @/router/** → @/stores/** → @/components/**            │
   *    │            │ → @components/** → @/views/** → @/**（兜底）              │
   *    ├────────────┼──────────────────────────────────────────────────────────┤
   *    │ parent     │ ../ 开头的相对路径导入                                    │
   *    │ sibling    │ ./ 开头的相对路径导入                                     │
   *    │ index      │ 目录索引文件（如 styles/index.scss）                      │
   *    └────────────┴──────────────────────────────────────────────────────────┘
   *
   *    同组内按字母升序排列，不区分大小写。type import 也参与排序。
   * ====================================================================== */
  {
    files: ['**/*'],
    plugins: {
      import: importPlugin
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json'  // 让 eslint-plugin-import 正确解析 tsconfig 中的 paths 别名
        },
        node: true                        // 回退到 Node.js 解析，兜底处理无 tsconfig 的模块
      }
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',   // Node.js 内置模块（path / fs / http 等）
            'external',  // node_modules 中的第三方依赖
            'type',      // import type 类型导入
            'internal',  // 项目内部模块（@/ 别名路径）
            'parent',    // ../ 父级相对路径
            'sibling',   // ./ 同级相对路径
            'index',     // 目录的 index 入口文件
            'object'     // import * as 对象导入
          ],
          'newlines-between': 'always',                 // 不同分组之间插入空行，提升可读性
          pathGroupsExcludedImportTypes: ['builtin'],   // Node 内置模块不作为 pathGroups 候选
          pathGroups: [
            // --- external 组：核心依赖按固定顺序排在 npm 包最前面 ---
            { pattern: 'vue', group: 'external', position: 'before' },
            { pattern: 'vue-router', group: 'external', position: 'before' },
            { pattern: 'pinia', group: 'external', position: 'before' },
            { pattern: 'axios', group: 'external', position: 'before' },
            { pattern: 'element-plus', group: 'external', position: 'before' },
            { pattern: '@element-plus/**', group: 'external', position: 'before' },

            // --- internal 组：项目内部模块按层级从上到下排列 ---
            { pattern: '@/utils/**', group: 'internal', position: 'before' },
            { pattern: '@/types/**', group: 'internal', position: 'before' },
            { pattern: '@/api/**', group: 'internal', position: 'before' },
            { pattern: '@/mock', group: 'internal', position: 'before' },
            { pattern: '@/router/**', group: 'internal', position: 'before' },
            { pattern: '@/stores/**', group: 'internal', position: 'before' },
            { pattern: '@/components/**', group: 'internal', position: 'before' },
            { pattern: '@components/**', group: 'internal', position: 'before' },
            { pattern: '@/views/**', group: 'internal', position: 'before' },
            { pattern: '@/**', group: 'internal', position: 'before' }  // 兜底匹配剩余 @ 别名导入
          ],
          alphabetize: {
            order: 'asc',             // 升序排列
            caseInsensitive: true     // 不区分大小写（@/Api 和 @/api 视为等价）
          },
          sortTypesGroup: true        // import type 语句也参与字母排序
        }
      ]
    }
  },

  /* ======================================================================
   * 8. Prettier 集成
   *    eslint-config-prettier 关闭 ESLint 中与 Prettier 冲突的格式化规则，
   *    eslint-plugin-prettier 以 ESLint 规则形式运行 Prettier 检查
   * ====================================================================== */
  eslintConfigPrettier,     // 扁平配置：直接展开，关闭所有与 Prettier 冲突的 ESLint 规则
  {
    plugins: {
      prettier
    },
    rules: {
      'prettier/prettier': 'error'  // 以 error 级别报告 Prettier 格式化差异
    }
  }
]
