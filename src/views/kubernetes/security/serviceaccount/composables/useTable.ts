import { ref } from 'vue'

import type { ServiceAccountListVo } from '@/types/kubernetes/security/serviceaccount'

import BeeTable from '@/components/BeeTable/index.vue'

/**
 * 服务账号表格状态组合式函数
 */
export function useServiceAccountTable() {
  /** BeeTable 实例引用 */
  const tableRef = ref<InstanceType<typeof BeeTable>>()
  /** 列表加载态 */
  const loading = ref(false)
  /** 选中当前行 */
  const selectedRow = ref<ServiceAccountListVo>()
  /** 选中多行数据 */
  const selectedRows = ref<ServiceAccountListVo[]>([])

  /**
   * 表格选中行变化
   * @param rows
   */
  function handleSelectionChange(rows: Record<string, unknown>[]) {
    selectedRows.value = rows as unknown as ServiceAccountListVo[]
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
