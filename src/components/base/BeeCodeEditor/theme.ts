/**
 * Monaco 编辑器主题
 * @module components/base/BeeCodeEditor/theme
 * @remarks 项目目前只有深色一套配色（`variables.scss` 仅深色变量，`data-theme` 无 CSS 消费），
 * 故只注册一个基于 `vs-dark` 的主题；透明背景与配色均取自项目色板
 */
import * as monaco from 'monaco-editor'

/** 编辑器主题名称 */
export const EDITOR_THEME = 'bee-dark'

/**
 * 注册编辑器主题
 * @description 以 `vs-dark` 为基底，把编辑区与行号槽背景置为透明，使编辑器完全融入父级容器背景；
 * 同时把行号、当前行、选中态、光标、查找高亮、滚动条一并调整为「透明背景 + 半透明叠色」方案，
 * 避免出现主体透明但周边仍是实心色块的割裂感；浮层类（补全、悬浮提示）保持不透明，否则会与下方内容叠影
 * @remarks 需在 `monaco.editor.create` 之前调用
 */
export function registerEditorTheme() {
  monaco.editor.defineTheme(EDITOR_THEME, {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      // 编辑区与行号槽：透明，露出父级容器背景（如 BeeCard 的 $color-bg-secondary）
      'editor.background': '#00000000',
      'editorGutter.background': '#00000000',
      // 行号与折叠控件：$color-text-third / $color-text-primary
      'editorLineNumber.foreground': '#82828280',
      'editorLineNumber.activeForeground': '#e6e6e6',
      'editorGutter.foldingControlForeground': '#82828280',
      // 当前行与选中态：半透明叠色，避免在透明背景上出现实心色块
      'editor.lineHighlightBackground': '#ffffff12',
      'editor.lineHighlightBorder': '#00000000',
      'editor.selectionBackground': '#c8640066',
      'editor.inactiveSelectionBackground': '#ffffff12',
      // 光标与括号匹配：$color-primary
      'editorCursor.foreground': '#c86400',
      'editorBracketMatch.background': '#ffffff1a',
      'editorBracketMatch.border': '#ffffff26',
      // 查找高亮：$color-primary 半透明
      'editor.findMatchBackground': '#c8640066',
      'editor.findMatchHighlightBackground': '#c8640033',
      // 滚动条
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#ffffff1a',
      'scrollbarSlider.hoverBackground': '#ffffff26',
      'scrollbarSlider.activeBackground': '#ffffff33',
      // 浮层：保持不透明，底色取 $color-bg-third
      'editorWidget.background': '#1e1e1e',
      'editorWidget.border': '#ffffff26',
      'editorSuggestWidget.background': '#1e1e1e',
      'editorSuggestWidget.border': '#ffffff26',
      'editorSuggestWidget.selectedBackground': '#c8640033',
      'editorHoverWidget.background': '#1e1e1e',
      'editorHoverWidget.border': '#ffffff26',
    },
  })
}
