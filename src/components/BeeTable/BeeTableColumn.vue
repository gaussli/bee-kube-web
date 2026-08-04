<!-- eslint-disable vue/valid-template-root -->
<template><!-- renderless: column definition only --></template>

<script setup lang="ts">
/**
 * BeeTable 列定义组件（renderless）
 * 通过 provide/inject 向父级 BeeTable 注册列配置
 * @module components/BeeTable/BeeTableColumn
 */
import { getCurrentInstance, inject, onMounted, onUnmounted, useSlots } from 'vue'
import type { ColumnConfig } from '@/components/BeeTable/index.vue'

defineOptions({ name: 'BeeTableColumn' })

const props = defineProps<{
  /** 列标识，对应数据字段名 */
  prop?: string
  /** 列宽度(px) */
  width?: number
  /** 列最小宽度(px) */
  minWidth?: number
  /** 固定列 */
  fixed?: 'left' | 'right'
}>()

/** 当前实例的插槽集合 */
const slots = useSlots()
/** 组件实例 */
const instance = getCurrentInstance()
/** 列唯一标识，基于组件 uid 生成 */
const id = `bee-col-${instance?.uid ?? Math.random().toString(36).slice(2)}`

/** BeeTable 提供的注册上下文 */
interface RegisterContext {
  /** 注册列配置 */
  registerColumn: (col: ColumnConfig) => void
  /** 注销列配置 */
  unregisterColumn: (id: string) => void
}

/** 通过 inject 获取父级 BeeTable 的注册能力 */
const tableContext = inject<RegisterContext>('BeeTableContext')

/** 列配置对象，组件挂载时注册到 BeeTable */
const columnConfig: ColumnConfig = {
  id,
  prop: props.prop || '',
  width: props.width,
  minWidth: props.minWidth,
  fixed: props.fixed,
  slots: { ...slots } as ColumnConfig['slots']
}

onMounted(() => {
  tableContext?.registerColumn(columnConfig)
})

onUnmounted(() => {
  tableContext?.unregisterColumn(id)
})
</script>
