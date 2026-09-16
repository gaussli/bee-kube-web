import { ref } from 'vue'

import type { DeploymentListVo } from '@/types/kubernetes/workload/deployment'

import BeeTable from '@/components/BeeTable/index.vue'

/**
 *
 */
export function useDeploymentTable() {
  /** BeeTable 实例引用 */
  const tableRef = ref<InstanceType<typeof BeeTable>>()
  /** 列表加载态 */
  const loading = ref(false)
  /** 选中当前行 */
  const selectedRow = ref<DeploymentListVo>()
  /** 选中多行数据 */
  const selectedRows = ref<DeploymentListVo[]>([])

  /**
   * 表格选中行变化
   * @param rows
   */
  function handleSelectionChange(rows: Record<string, unknown>[]) {
    selectedRows.value = rows as unknown as DeploymentListVo[]
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
