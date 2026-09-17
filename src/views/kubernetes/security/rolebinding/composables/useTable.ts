import { ref } from 'vue'

import type { RoleBindingListVo } from '@/types/kubernetes/security/rolebinding'

import BeeTable from '@/components/BeeTable/index.vue'

/**
 * 角色绑定表格状态组合式函数
 */
export function useRoleBindingTable() {
  /** BeeTable 实例引用 */
  const tableRef = ref<InstanceType<typeof BeeTable>>()
  /** 列表加载态 */
  const loading = ref(false)
  /** 选中当前行 */
  const selectedRow = ref<RoleBindingListVo>()
  /** 选中多行数据 */
  const selectedRows = ref<RoleBindingListVo[]>([])

  /**
   * 表格选中行变化
   * @param rows
   */
  function handleSelectionChange(rows: Record<string, unknown>[]) {
    selectedRows.value = rows as unknown as RoleBindingListVo[]
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
