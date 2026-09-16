import { ref } from 'vue'

import type { ServiceListVo } from '@/types/kubernetes/network/service'

import BeeTable from '@/components/BeeTable/index.vue'

/**
 * 服务表格状态组合式函数
 */
export function useServiceTable() {
  /** BeeTable 实例引用 */
  const tableRef = ref<InstanceType<typeof BeeTable>>()
  /** 列表加载态 */
  const loading = ref(false)
  /** 选中当前行 */
  const selectedRow = ref<ServiceListVo>()
  /** 选中多行数据 */
  const selectedRows = ref<ServiceListVo[]>([])

  /**
   * 表格选中行变化
   * @param rows
   */
  function handleSelectionChange(rows: Record<string, unknown>[]) {
    selectedRows.value = rows as unknown as ServiceListVo[]
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
