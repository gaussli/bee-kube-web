<template>
  <div class="bee-table">
    <!-- 加载遮罩 -->
    <div v-if="loading" class="bee-table__loading-mask">
      <BeeIcon name="basic-loading" :size="24" class="bee-table__loading-icon" />
    </div>

    <!-- 滚动容器 -->
    <div class="bee-table__wrapper">
      <div class="bee-table__inner">
        <!-- 表体 -->
        <div class="bee-table__body" :style="{ gap: 'var(--bee-table-row-gap, 8px)' }">
          <div
            v-for="(row, rowIndex) in data"
            :key="getRowKey(row, rowIndex)"
            class="bee-table__row"
            :class="{
              'bee-table__row--selected': selectable && isRowSelected(row, rowIndex),
            }"
            :style="{ cursor: selectable ? 'pointer' : undefined }"
            @click="selectable && handleRowClick(row, rowIndex)"
          >
            <div
              v-for="(col, colIndex) in columnList"
              :key="col.id"
              class="bee-table__cell"
              :class="getFixedClass(col)"
              :style="getColumnStyle(col, colIndex)"
            >
              <template v-if="col.slots.default">
                <component :is="cellRenderer(col, row)" />
              </template>
              <span v-else>{{ row[col.prop] ?? '' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 渲染 slot 以触发 BeeTableColumn 实例化（renderless，不可见） -->
    <div style="display: none"><slot /></div>
  </div>
</template>

<script setup lang="ts">
/**
 * BeeTable 表格组件
 * 接受 BeeTableColumn 作为列定义，通过 provide/inject 收集列配置并渲染表体。
 * 支持 loading、固定列、CSS 变量定制等。
 * @module components/BeeTable
 */
import { provide, ref } from 'vue'

import type { VNode } from 'vue'

import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeTable' })

/** 列配置 */
export interface ColumnConfig {
  /** 列唯一标识 */
  id: string
  /** 数据字段名 */
  prop: string
  /** 列固定宽度(px)，不传则弹性分配 */
  width?: number
  /** 列最小宽度(px) */
  minWidth?: number
  /** 固定列方向 */
  fixed?: 'left' | 'right'
  /** 插槽映射，key 为 slot 名称 */
  slots: Record<string, (...args: any[]) => VNode[]>
}

const props = withDefaults(
  defineProps<{
    /** 表格数据 */
    data?: Record<string, unknown>[]
    /** 是否加载中 */
    loading?: boolean
    /** 行唯一标识字段名，默认使用 "id" */
    rowKey?: string
    /** 是否启用多选 */
    selectable?: boolean
  }>(),
  {
    data: () => [],
    loading: false,
    rowKey: 'id',
    selectable: false,
  },
)

const emit = defineEmits<{
  /** 选中行变化时触发 */
  (e: 'selection-change', rows: Record<string, unknown>[]): void
}>()

// ---- 列注册 ----

/** 列配置列表 */
const columnList = ref<ColumnConfig[]>([])

/**
 * 注册列配置
 * @param config - 列配置
 */
function registerColumn(config: ColumnConfig) {
  columnList.value.push(config)
}

/**
 * 注销列配置
 * @param id - 列唯一标识
 */
function unregisterColumn(id: string) {
  const idx = columnList.value.findIndex(c => c.id === id)
  if (idx > -1) columnList.value.splice(idx, 1)
}

provide('BeeTableContext', { registerColumn, unregisterColumn })

// ---- 单元格渲染器 ----

/**
 * 获取单元格渲染函数
 * 优先使用列的自定义插槽，否则按 prop 从行数据取值
 * @param col - 列配置
 * @param row - 行数据
 * @returns 渲染函数
 */
function cellRenderer(col: ColumnConfig, row: Record<string, unknown>) {
  return () => col.slots.default?.({ row }) ?? row[col.prop] ?? ''
}

// ---- 行 key ----

/**
 * 获取行唯一标识
 * 优先使用 rowKey 指定的字段值，不存在时使用索引生成
 * @param row - 行数据
 * @param index - 行索引
 * @returns 行唯一标识
 */
function getRowKey(row: Record<string, unknown>, index: number): string {
  return (row[props.rowKey] as string) ?? `bee-row-${index}`
}

// ---- 行点击选中 ----

/** 已选中行的 key 集合 */
const selectedRowKeys = ref(new Set<string>())

/**
 * 判断行是否已选中
 * @param row - 行数据
 * @param index - 行索引
 * @returns 是否选中
 */
function isRowSelected(row: Record<string, unknown>, index: number): boolean {
  return selectedRowKeys.value.has(getRowKey(row, index))
}

/**
 * 处理行点击，切换选中状态
 * @param row - 行数据
 * @param index - 行索引
 */
function handleRowClick(row: Record<string, unknown>, index: number) {
  const key = getRowKey(row, index)
  const next = new Set(selectedRowKeys.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  selectedRowKeys.value = next
  emitSelectionChange()
}

/** 触发选中行变化事件 */
function emitSelectionChange() {
  const selected = props.data.filter((row, i) => selectedRowKeys.value.has(getRowKey(row, i)))
  emit('selection-change', selected)
}

/** 清除所有选中行 */
function clearSelection() {
  selectedRowKeys.value = new Set()
  emitSelectionChange()
}

defineExpose({ clearSelection })

// ---- 固定列样式 ----

/**
 * 获取固定列的 class
 * @param col - 列配置
 * @returns class 对象
 */
function getFixedClass(col: ColumnConfig) {
  if (!col.fixed) return {}
  return {
    'bee-table__cell--fixed-left': col.fixed === 'left',
    'bee-table__cell--fixed-right': col.fixed === 'right',
  }
}

/**
 * 将数值转为带 px 单位的 CSS 值
 * @param val
 */
function toCssWidth(val: number): string {
  return `${val}px`
}

/**
 * 计算列的内联样式，包括宽度和固定列偏移
 * @param col - 列配置
 * @param index - 列索引
 * @returns 样式对象
 */
function getColumnStyle(col: ColumnConfig, index: number) {
  const styles: Record<string, string> = {}

  // 列宽
  if (col.width) {
    styles.width = toCssWidth(col.width)
    styles.flexShrink = '0'
  } else if (col.minWidth) {
    styles.minWidth = toCssWidth(col.minWidth)
    styles.flex = '1'
  } else {
    styles.flex = '1'
    styles.minWidth = '0'
  }

  // 固定列 left 偏移（计算前方固定列宽度的累加）
  if (col.fixed === 'left') {
    let leftPx = 0
    for (let i = 0; i < index; i++) {
      const prev = columnList.value[i]
      if (prev.fixed === 'left') {
        const w = prev.width ?? prev.minWidth
        if (w) leftPx += w
      }
    }
    styles.left = `${leftPx}px`
  }

  // 固定列 right 偏移（计算后方固定列宽度的累加）
  if (col.fixed === 'right') {
    let rightPx = 0
    for (let i = columnList.value.length - 1; i > index; i--) {
      const next = columnList.value[i]
      if (next.fixed === 'right') {
        const w = next.width ?? next.minWidth
        if (w) rightPx += w
      }
    }
    styles.right = `${rightPx}px`
  }

  return styles
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-table {
  --bee-table-bg: transparent;
  --bee-table-row-bg: #{$color-bg-elevated};
  --bee-table-row-gap: 8px;
  --bee-table-row-hover-bg: #{map.get($colors, 'primary', 'bg')};
  --bee-table-row-padding: 16px;
  --bee-table-row-radius: 8px;
  --bee-table-row-selected-bg: #{map.get($colors, 'primary', 10)};

  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: var(--bee-table-bg);

  // ---- 加载遮罩 ----
  &__loading-mask {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-8;
    background: $color-bg-mask;
  }

  &__loading-icon {
    color: $color-primary;
    animation: bee-table-rotating 2s linear infinite;
  }

  // ---- 滚动容器 ----
  &__wrapper {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: $radius-8;
    overflow: auto;
  }

  // ---- 内层容器 ----
  &__inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: fit-content;
    border-radius: $radius-8;
  }

  // ---- 表体（纵向 flex，gap 为行间距） ----
  &__body {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: $radius-8;
  }

  // ---- 行通用 ----
  &__row {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    width: 100%;
    border-radius: var(--bee-table-row-radius);
    background: var(--bee-table-row-bg);

    &:hover:not(&--selected) {
      background: var(--bee-table-row-hover-bg);
    }

    &--selected {
      --bee-row-selected-icon-color: #{$color-primary};

      background: var(--bee-table-row-selected-bg);
    }
  }

  // ---- 单元格通用 ----
  &__cell {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-width: 0;
    padding: var(--bee-table-row-padding);
    overflow: hidden;
    font-size: $font-size-14;
    color: $color-text-primary;

    // 固定列
    &--fixed-left,
    &--fixed-right {
      position: sticky;
      z-index: 1;
      background: inherit;
    }
  }
}

@keyframes bee-table-rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
