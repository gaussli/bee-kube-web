import { ref } from 'vue'

import type { CronJobListVo } from '@/types/kubernetes/workload/cronjob'

import BeeTable from '@/components/BeeTable/index.vue'

/**
 * 定时任务表格状态组合式函数
 */
export function useCronJobTable() {
  /** BeeTable 实例引用 */
  const tableRef = ref<InstanceType<typeof BeeTable>>()
  /** 列表加载态 */
  const loading = ref(false)
  /** 选中当前行 */
  const selectedRow = ref<CronJobListVo>()
  /** 选中多行数据 */
  const selectedRows = ref<CronJobListVo[]>([])

  /**
   * 表格选中行变化
   * @param rows
   */
  function handleSelectionChange(rows: Record<string, unknown>[]) {
    selectedRows.value = rows as unknown as CronJobListVo[]
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
