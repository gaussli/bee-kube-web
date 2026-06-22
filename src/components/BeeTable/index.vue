<template>
  <div class="bee-table" :class="{ 'is-loading': loading }">
    <!-- 加载遮罩 -->
    <div v-if="loading" class="bee-table__loading-mask">
      <BeeIcon name="basic-loading" :size="24" class="bee-table__loading-icon" />
    </div>

    <!-- 滚动容器 -->
    <div ref="wrapperRef" class="bee-table__wrapper">
      <!-- 内层容器：保证表头与表体同步横向滚动 -->
      <div class="bee-table__inner">
        <!-- 表头行（纵向 sticky），无 label/header 插槽时视觉隐藏，保留 DOM 以维持列宽对齐 -->
        <div class="bee-table__row bee-table__row--header" :class="{ 'bee-table__row--header-hidden': !hasHeaderContent }">
          <div v-for="(col, colIndex) in columnList" :key="col.id" class="bee-table__cell bee-table__cell--header" :class="getFixedClass(col)" :style="getColumnStyle(col, colIndex)">
            <template v-if="col.slots.header">
              <component :is="headerRenderers[colIndex]" />
            </template>
            <span v-else>{{ col.label }}</span>
          </div>
        </div>

        <!-- 表体 -->
        <div class="bee-table__body" :style="{ gap: 'var(--bee-table-row-gap, 8px)' }">
          <div
            v-for="(row, rowIndex) in data"
            :key="getRowKey(row, rowIndex)"
            class="bee-table__row"
            :class="{
              'bee-table__row--divided': divider,
              'bee-table__row--selected': selectable && isRowSelected(row, rowIndex)
            }"
            :style="{ cursor: selectable ? 'pointer' : undefined }"
            @click="selectable && handleRowClick(row, rowIndex)"
          >
            <div
              v-for="(col, colIndex) in columnList"
              :key="col.id"
              class="bee-table__cell"
              :class="[getFixedClass(col), { 'bee-table__cell--divided': divider }]"
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
 * 接受 BeeTableColumn 作为列定义，通过 provide/inject 收集列配置并渲染表头与表体。
 * 支持 loading、固定列、分割线、CSS 变量定制等。
 * @module components/BeeTable
 */
import { computed, provide, ref } from 'vue'
import type { VNode } from 'vue'
import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeTable' })

interface ColumnConfig {
  id: string
  label: string
  prop: string
  width?: string | number
  minWidth?: string | number
  fixed?: 'left' | 'right'
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
    /** 是否展示行分割线 */
    divider?: boolean
    /** 是否启用多选 */
    selectable?: boolean
  }>(),
  {
    data: () => [],
    loading: false,
    rowKey: 'id',
    divider: false,
    selectable: false
  }
)

const emit = defineEmits<{
  /** 选中行变化时触发 */
  (e: 'selection-change', rows: Record<string, unknown>[]): void
}>()

const wrapperRef = ref<HTMLElement>()

// ---- 列注册 ----

const columnList = ref<ColumnConfig[]>([])

/** 是否有表头内容需要展示（任一列有 label 或 header 插槽） */
const hasHeaderContent = computed(() => columnList.value.some(col => col.label || col.slots.header))

function registerColumn(config: ColumnConfig) {
  columnList.value.push(config)
}

function unregisterColumn(id: string) {
  const idx = columnList.value.findIndex(c => c.id === id)
  if (idx > -1) columnList.value.splice(idx, 1)
}

provide('BeeTableContext', { registerColumn, unregisterColumn })

// ---- 表头渲染器 ----

const headerRenderers = computed(() =>
  columnList.value.map(col => {
    if (col.slots.header) {
      return () => col.slots.header?.()
    }
    return null
  })
)

// ---- 单元格渲染器 ----

function cellRenderer(col: ColumnConfig, row: Record<string, unknown>) {
  return () => col.slots.default?.({ row }) ?? row[col.prop] ?? ''
}

// ---- 行 key ----

function getRowKey(row: Record<string, unknown>, index: number): string {
  return (row[props.rowKey] as string) ?? `bee-row-${index}`
}

// ---- 行点击选中 ----

const selectedRowKeys = ref(new Set<string>())

function isRowSelected(row: Record<string, unknown>, index: number): boolean {
  return selectedRowKeys.value.has(getRowKey(row, index))
}

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

function emitSelectionChange() {
  const selected = props.data.filter((row, i) => selectedRowKeys.value.has(getRowKey(row, i)))
  emit('selection-change', selected)
}

// ---- 固定列样式 ----

function getFixedClass(col: ColumnConfig) {
  if (!col.fixed) return {}
  return {
    'bee-table__cell--fixed-left': col.fixed === 'left',
    'bee-table__cell--fixed-right': col.fixed === 'right'
  }
}

/** 将列宽值统一转为带 px 单位的 CSS 值 */
function toCssWidth(val: string | number): string {
  const num = typeof val === 'number' ? val : Number(val)
  return Number.isNaN(num) ? String(val) : `${num}px`
}

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
        if (w) leftPx += typeof w === 'number' ? w : parseInt(w, 10)
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
        if (w) rightPx += typeof w === 'number' ? w : parseInt(w, 10)
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
    background: rgb(0 0 0 / 8%);
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
    overflow: auto;
  }

  // ---- 内层容器：表头 + 表体同步横向滚动 ----
  &__inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: fit-content;
  }

  // ---- 表体（纵向 flex，gap 为行间距） ----
  &__body {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  // ---- 行通用 ----
  &__row {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    width: 100%;
    border-radius: var(--bee-table-row-radius);
    background: var(--bee-table-row-bg);

    // contain: paint;

    &:hover:not(&--header, &--selected) {
      background: var(--bee-table-row-hover-bg);
    }

    &--selected {
      --bee-row-selected-icon-color: #{$color-primary};

      background: var(--bee-table-row-selected-bg);
    }

    &--header {
      position: sticky;
      top: 0;
      z-index: 2;
    }

    &--header-hidden {
      flex-shrink: 0;
      height: 1px;
      min-height: 0;
      overflow: hidden;
      visibility: hidden;
    }

    &--divided {
      border-bottom: 1px solid $color-border-primary;
      border-radius: 0;
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

    &--header {
      font-weight: 600;
    }

    // 固定列
    &--fixed-left,
    &--fixed-right {
      position: sticky;
      z-index: 1;
      background: inherit;
    }

    // 分割线模式：单元格分割
    &--divided {
      border-right: 1px solid $color-border-primary;

      &:last-child {
        border-right: none;
      }
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
