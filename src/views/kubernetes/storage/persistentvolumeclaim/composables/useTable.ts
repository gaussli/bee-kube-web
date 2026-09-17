import { ref } from 'vue'

import type { PersistentVolumeClaimListVo } from '@/types/kubernetes/storage/persistentvolumeclaim'

import BeeTable from '@/components/BeeTable/index.vue'

/**
 * 持久卷声明表格状态组合式函数
 */
export function usePersistentVolumeClaimTable() {
  /** BeeTable 实例引用 */
  const tableRef = ref<InstanceType<typeof BeeTable>>()
  /** 列表加载态 */
  const loading = ref(false)
  /** 选中当前行 */
  const selectedRow = ref<PersistentVolumeClaimListVo>()
  /** 选中多行数据 */
  const selectedRows = ref<PersistentVolumeClaimListVo[]>([])

  /**
   * 表格选中行变化
   * @param rows
   */
  function handleSelectionChange(rows: Record<string, unknown>[]) {
    selectedRows.value = rows as unknown as PersistentVolumeClaimListVo[]
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
