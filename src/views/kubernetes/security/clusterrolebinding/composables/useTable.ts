import { ref } from 'vue'

import type { ClusterRoleBindingListVo } from '@/types/kubernetes/security/clusterrolebinding'

import BeeTable from '@/components/BeeTable/index.vue'

/**
 * 集群角色绑定表格状态组合式函数
 */
export function useClusterRoleBindingTable() {
  /** BeeTable 实例引用 */
  const tableRef = ref<InstanceType<typeof BeeTable>>()
  /** 列表加载态 */
  const loading = ref(false)
  /** 选中当前行 */
  const selectedRow = ref<ClusterRoleBindingListVo>()
  /** 选中多行数据 */
  const selectedRows = ref<ClusterRoleBindingListVo[]>([])

  /**
   * 表格选中行变化
   * @param rows
   */
  function handleSelectionChange(rows: Record<string, unknown>[]) {
    selectedRows.value = rows as unknown as ClusterRoleBindingListVo[]
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
