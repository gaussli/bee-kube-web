import { ref } from 'vue'

import type { StorageClassListVo } from '@/types/kubernetes/storage/storageclass'

import BeeTable from '@/components/BeeTable/index.vue'

/**
 * 存储类表格状态组合式函数
 */
export function useStorageClassTable() {
  /** BeeTable 实例引用 */
  const tableRef = ref<InstanceType<typeof BeeTable>>()
  /** 列表加载态 */
  const loading = ref(false)
  /** 选中当前行 */
  const selectedRow = ref<StorageClassListVo>()
  /** 选中多行数据 */
  const selectedRows = ref<StorageClassListVo[]>([])

  /**
   * 表格选中行变化
   * @param rows
   */
  function handleSelectionChange(rows: Record<string, unknown>[]) {
    selectedRows.value = rows as unknown as StorageClassListVo[]
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
