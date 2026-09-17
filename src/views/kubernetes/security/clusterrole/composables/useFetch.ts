import { reactive, ref, type Ref } from 'vue'

import type { ClusterRoleListVo, ClusterRoleQueryForm } from '@/types/kubernetes/security/clusterrole'

import type { PageEntity } from '@/types'

import { getClusterRoleList } from '@/api/kubernetes/security/clusterrole'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 集群角色列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useClusterRoleFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<ClusterRoleQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 集群角色列表数据 */
  const clusterRoles = ref<ClusterRoleListVo[]>([])

  /**
   * 请求集群角色列表数据
   */
  async function fetchClusterRoles() {
    if (!clusterUid.value) {
      clusterRoles.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getClusterRoleList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      clusterRoles.value = list as ClusterRoleListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchClusterRoles]', err)
      BeeMessage.error('加载集群角色列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    clusterRoles,
    // ==================== Fetch Method ====================
    fetchClusterRoles,
  }
}
