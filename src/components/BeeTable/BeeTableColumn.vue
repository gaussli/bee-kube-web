<template><!-- renderless: column definition only --></template>

<script setup lang="ts">
/**
 * BeeTable 列定义组件（renderless）
 * 通过 provide/inject 向父级 BeeTable 注册列配置
 * @module components/BeeTable/BeeTableColumn
 */
import { getCurrentInstance, inject, onMounted, onUnmounted, useSlots } from 'vue'
import type { PropType } from 'vue'

defineOptions({ name: 'BeeTableColumn' })

const props = defineProps({
  /** 列标识，对应数据字段名 */
  prop: { type: String, default: '' },
  /** 表头文本（header 插槽未提供时使用） */
  label: { type: String, default: '' },
  /** 列宽度 */
  width: { type: [String, Number] as PropType<string | number>, default: undefined },
  /** 列最小宽度 */
  minWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
  /** 固定列 */
  fixed: { type: String as PropType<'left' | 'right'>, default: undefined }
})

const slots = useSlots()
const instance = getCurrentInstance()
const id = `bee-col-${instance!.uid}`

interface RegisterContext {
  registerColumn: (col: Record<string, unknown>) => void
  unregisterColumn: (id: string) => void
}

const tableContext = inject<RegisterContext>('BeeTableContext')

const columnConfig = {
  id,
  label: props.label,
  prop: props.prop,
  width: props.width,
  minWidth: props.minWidth,
  fixed: props.fixed,
  slots: { ...slots }
}

onMounted(() => {
  tableContext?.registerColumn(columnConfig)
})

onUnmounted(() => {
  tableContext?.unregisterColumn(id)
})
</script>
