import { ref } from 'vue'

import type { NodeListVo } from '@/types/kubernetes/node'

/**
 * 节点表格状态组合式函数
 * @remarks 节点列表无多选与批量操作，故不提供 tableRef / selectedRows
 */
export function useNodeTable() {
  /** 列表加载态 */
  const loading = ref(false)
  /** 选中当前行 */
  const selectedRow = ref<NodeListVo>()

  return {
    // ==================== Reactive State ====================
    loading,
    selectedRow,
  }
}
