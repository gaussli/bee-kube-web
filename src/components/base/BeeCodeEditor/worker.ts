/**
 * Monaco 运行环境配置
 * @module components/base/BeeCodeEditor/worker
 * @remarks 单独成文件而不写在 SFC 里，便于 Vite 的 worker 插件处理并产出独立 worker 产物
 * @remarks 路径必须相对 `esm/vs/`：`monaco-editor@0.57` 的 `exports` 只有
 * `"."`、`"./*.js" → "./esm/vs/*.js"`、`"./*" → "./esm/vs/*.js"`，
 * 写成 `monaco-editor/esm/vs/...` 会被拼成 `esm/vs/esm/vs/...` 而解析失败
 */

import EditorWorker from 'monaco-editor/editor/editor.worker.js?worker'

import type { Environment } from 'monaco-editor'

/** 全局作用域，Monaco 通过 `self.MonacoEnvironment` 获取 worker 工厂 */
const globalScope = self as unknown as { MonacoEnvironment: Environment }

globalScope.MonacoEnvironment = {
  /** 仅需编辑器 worker：YAML 等基础语言只做词法高亮，不依赖语言服务 worker */
  getWorker: () => new EditorWorker(),
}
