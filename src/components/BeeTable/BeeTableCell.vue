<script lang="ts">
/**
 * BeeTable 单元格渲染器
 * 按列配置渲染单个单元格：优先使用列的 default 插槽，否则按 prop 从行数据取值。
 *
 * @remarks
 * 独立成组件是为了让单元格 vnode 的 type 保持为**稳定的模块级组件对象**，从而让 Vue 复用组件实例。
 * 若在 BeeTable 模板中直接使用 `<component :is="cellRenderer(col, row)" />`，每次渲染都会得到一个新函数，
 * Vue 判定 vnode type 变化后会卸载并重建整棵子树，导致单元格内的有状态组件（下拉、Tooltip）状态丢失。
 *
 * @module components/BeeTable/BeeTableCell
 */
import { defineComponent, h } from 'vue'

import type { PropType } from 'vue'

import type { ColumnConfig } from '@/components/BeeTable/index.vue'

export default defineComponent({
  name: 'BeeTableCell',
  props: {
    /** 列配置 */
    col: { type: Object as PropType<ColumnConfig>, required: true },
    /** 行数据 */
    row: { type: Object as PropType<Record<string, unknown>>, required: true },
  },
  setup(props) {
    return () => {
      const defaultSlot = props.col.slots.default
      if (defaultSlot) {
        return defaultSlot({ row: props.row })
      }
      return h('span', (props.row[props.col.prop] ?? '') as string)
    }
  },
})
</script>
