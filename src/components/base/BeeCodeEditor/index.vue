<template>
  <div ref="containerRef" class="bee-code-editor" :style="{ height }"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import * as monaco from 'monaco-editor'

import { EDITOR_THEME, registerEditorTheme } from './theme'
import './worker'

/**
 * 代码编辑器
 * @description 基于 Monaco Editor 的代码编辑器，默认识别 YAML，支持语法高亮、行号、括号匹配、折叠与查找。
 * 背景透明（编辑区与行号槽都不铺底色），编辑器会完全融入父级容器背景；
 * `v-model` 绑定纯文本内容，不参与任何解析与校验（内容合法性由提交后的接口返回）
 * @remarks 容器需要有确定高度：默认 `height="100%"`，依赖父级提供高度；也可显式传入如 `height="480px"`
 * @example
 * ```vue
 * <BeeCodeEditor v-model="yamlText" height="100%" />
 * ```
 */
defineOptions({ name: 'BeeCodeEditor' })

// ==================== Prop & Emit ====================
const modelValue = defineModel<string>({ default: '' })
const props = withDefaults(
  defineProps<{
    /** 语言（Monaco 语言 id） */
    language?: string
    /** 只读标记 */
    readonly?: boolean
    /** 编辑器高度，支持任意 CSS 长度 */
    height?: string
  }>(),
  {
    language: 'yaml',
    readonly: false,
    height: '100%',
  },
)

// ==================== Reactive State ====================
const containerRef = ref<HTMLDivElement>()
/** 编辑器实例 */
let editorInstance: monaco.editor.IStandaloneCodeEditor | undefined

// ==================== Method ====================
/**
 * 创建编辑器实例
 */
function createEditor() {
  if (!containerRef.value) return
  registerEditorTheme()
  editorInstance = monaco.editor.create(containerRef.value, {
    value: modelValue.value,
    language: props.language,
    theme: EDITOR_THEME,
    automaticLayout: true,
    readOnly: props.readonly,
    minimap: { enabled: false },
    fontSize: 13,
    lineHeight: 22,
    tabSize: 2,
    wordWrap: 'off',
    scrollBeyondLastLine: false,
    renderLineHighlight: 'all',
    smoothScrolling: true,
    fixedOverflowWidgets: true,
    padding: { top: 12, bottom: 12 },
    scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
  })
  editorInstance.onDidChangeModelContent(handleContentChange)
}

// ==================== Handler ====================
/**
 * 内容变更：同步到 v-model
 */
function handleContentChange() {
  const value = editorInstance?.getValue() ?? ''
  if (value === modelValue.value) return
  modelValue.value = value
}

// ==================== Watch ====================
watch(modelValue, value => {
  if (!editorInstance || editorInstance.getValue() === value) return
  editorInstance.setValue(value)
})

watch(
  () => props.readonly,
  value => {
    editorInstance?.updateOptions({ readOnly: value })
  },
)

watch(
  () => props.language,
  value => {
    const model = editorInstance?.getModel()
    if (model) monaco.editor.setModelLanguage(model, value)
  },
)

// ==================== Lifecycle ====================
onMounted(() => {
  createEditor()
})

onBeforeUnmount(() => {
  editorInstance?.getModel()?.dispose()
  editorInstance?.dispose()
  editorInstance = undefined
})
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-code-editor {
  width: 100%;
  min-height: 240px;
  border-radius: 12px;
  overflow: hidden;
}
</style>
