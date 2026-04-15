import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import prettier from 'eslint-plugin-prettier'
import pluginVue from 'eslint-plugin-vue'
import unusedImports from 'eslint-plugin-unused-imports'
import importPlugin from 'eslint-plugin-import'
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
        console: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        Date: 'readonly',
        JSON: 'readonly',
        Math: 'readonly',
        Promise: 'readonly',
        Object: 'readonly',
        __dirname: 'readonly'
      }
    },
    rules: {
      'no-undef': 'error',
      'no-redeclare': 'off',
      'no-unused-vars': 'off'
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: tsparser
      }
    },
    plugins: {
      vue: pluginVue,
      'unused-imports': unusedImports,
      import: importPlugin
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'unused-imports/no-unused-imports': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type'
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            { pattern: 'vue', group: 'external', position: 'before' },
            { pattern: 'vue-router', group: 'external', position: 'before' },
            { pattern: 'pinia', group: 'external', position: 'before' },
            { pattern: '@element-plus/**', group: 'external' },
            { pattern: '@/styles/**', group: 'index', position: 'after' },
            { pattern: '@/views/**', group: 'internal', position: 'after' },
            { pattern: '@/components/**', group: 'internal', position: 'after' },
            { pattern: '@/utils/**', group: 'internal', position: 'after' },
            { pattern: '@/api/**', group: 'internal', position: 'after' },
            { pattern: '@/router/**', group: 'internal', position: 'after' },
            { pattern: '@/store/**', group: 'internal', position: 'after' },
            { pattern: '@/**', group: 'internal' }
          ]
        }
      ]
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', 'vite.config.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'unused-imports': unusedImports,
      import: importPlugin
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-redeclare': 'off',
      'no-prototype-builtins': 'off',
      'unused-imports/no-unused-imports': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type'
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            { pattern: 'vue', group: 'external', position: 'before' },
            { pattern: 'vue-router', group: 'external', position: 'before' },
            { pattern: 'pinia', group: 'external', position: 'before' },
            { pattern: '@element-plus/**', group: 'external' },
            { pattern: '@/styles/**', group: 'index', position: 'after' },
            { pattern: '@/views/**', group: 'internal', position: 'after' },
            { pattern: '@/components/**', group: 'internal', position: 'after' },
            { pattern: '@/utils/**', group: 'internal', position: 'after' },
            { pattern: '@/api/**', group: 'internal', position: 'after' },
            { pattern: '@/router/**', group: 'internal', position: 'after' },
            { pattern: '@/store/**', group: 'internal', position: 'after' },
            { pattern: '@/**', group: 'internal' }
          ]
        }
      ]
    }
  },
  {
    files: ['**/*.vue'],
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      'unused-imports/no-unused-imports': 'error'
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
