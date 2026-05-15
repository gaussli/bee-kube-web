import js from '@eslint/js'
import tseslintPlugin from '@typescript-eslint/eslint-plugin'
import tseslintParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import unusedImports from 'eslint-plugin-unused-imports'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import * as parserVue from 'vue-eslint-parser'

export default [
  {
    ignores: ['node_modules', 'dist', '*.local', '.env*']
  },
  js.configs.recommended,
  {
    files: ['**/*'],
    languageOptions: {
      globals: {
        ...globals.browser, // 包含 localStorage, document, console 等
        ...globals.node // 如果需要 Node 全局变量
      }
    }
  },
  {
    files: ['**/*'],
    plugins: {
      'unused-imports': unusedImports,
      'import': importPlugin
    },
    rules: {
      // 关闭 ESLint 原生的未使用变量检查
      'no-unused-vars': 'off',
      // 启用 unused-imports 的规则
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['error', { vars: 'all', varsIgnorePattern: '^_*', args: 'after-used', argsIgnorePattern: '^_' }]
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: tseslintParser
      }
    },
    plugins: {
      vue: pluginVue
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off'
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', 'vite.config.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin
    },
    rules: {
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-prototype-builtins': 'off'
    }
  },
  // 单独配置 import/order 规则，确保在所有文件中都生效
  {
    files: ['**/*'],
    plugins: {
      import: importPlugin
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json'
        },
        node: true // 作为 fallback
      }
    },
    rules: {
      // import/order 导入排序规则
      // 排序逻辑:
      // 1. 基础组 (builtin): Node.js 内置模块，如 path, fs, http
      // 2. 外部组 (external): npm 包，vue 使用 position: 'before' 强制排最前，其他按定义顺序
      //    顺序: vue > vue-router > pinia > axios > element-plus
      // 3. 父级/同级组 (parent/sibling): ../ 或 ./ 开头的相对路径
      // 4. 内部组 (internal): 项目内部模块 @/api, @/components, @/router, @/store, @/utils, @/views
      // 5. 样式组 (index): @/styles 放最后
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          'newlines-between': 'never',
          'pathGroupsExcludedImportTypes': ['builtin'],
          'pathGroups': [
            { pattern: 'vue', group: 'external', position: 'before' },
            { pattern: 'vue-router', group: 'external', position: 'before' },
            { pattern: 'pinia', group: 'external', position: 'before' },
            { pattern: 'axios', group: 'external', position: 'before' },
            { pattern: 'element-plus', group: 'external', position: 'before' },
            { pattern: '@element-plus/**', group: 'external', position: 'before' },
            { pattern: '@/utils', group: 'internal', position: 'before' },
            { pattern: '@/types', group: 'internal', position: 'before' },
            { pattern: '@/api', group: 'internal', position: 'before' },
            { pattern: '@/mock', group: 'internal', position: 'before' },
            { pattern: '@/router', group: 'internal', position: 'before' },
            { pattern: '@/stores', group: 'internal', position: 'before' },
            { pattern: '@/components/**', group: 'internal', position: 'before' },
            { pattern: '@components/**', group: 'internal', position: 'before' },
            { pattern: '@/views', group: 'internal', position: 'before' },
            { pattern: '@/**', group: 'internal', position: 'before' }
          ],
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true
          },
          'sortTypesGroup': true
        }
      ]
    }
  },
  eslintConfigPrettier,
  {
    plugins: {
      prettier
    },
    rules: {
      'prettier/prettier': 'error'
    }
  }
]
