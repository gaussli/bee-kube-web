import { ref } from 'vue'

import type { DaemonSetListVo } from '@/types/kubernetes/workload/daemonset'

import BeeTable from '@/components/BeeTable/index.vue'

/**
 * 守护进程集表格状态组合式函数
 */
export function useDaemonSetTable() {
  /** BeeTable 实例引用 */
  const tableRef = ref<InstanceType<typeof BeeTable>>()
  /** 列表加载态 */
  const loading = ref(false)
  /** 选中当前行 */
  const selectedRow = ref<DaemonSetListVo>()
  /** 选中多行数据 */
  const selectedRows = ref<DaemonSetListVo[]>([])

  /**
   * 表格选中行变化
   * @param rows
   */
  function handleSelectionChange(rows: Record<string, unknown>[]) {
    selectedRows.value = rows as unknown as DaemonSetListVo[]
  }

  return {
    // ==================== Reactive State ====================
    tableRef,
    loading,
    selectedRow,
    selectedRows,
    // ==================== BeeTable Handler ====================
    handleSelectionChange,
  }
}
