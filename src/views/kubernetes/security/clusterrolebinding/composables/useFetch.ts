import { reactive, ref, type Ref } from 'vue'

import type {
  ClusterRoleBindingListVo,
  ClusterRoleBindingQueryForm,
} from '@/types/kubernetes/security/clusterrolebinding'

import type { PageEntity } from '@/types'

import { getClusterRoleBindingList } from '@/api/kubernetes/security/clusterrolebinding'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 集群角色绑定列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useClusterRoleBindingFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<ClusterRoleBindingQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 集群角色绑定列表数据 */
  const clusterRoleBindings = ref<ClusterRoleBindingListVo[]>([])

  /**
   * 请求集群角色绑定列表数据
   */
  async function fetchClusterRoleBindings() {
    if (!clusterUid.value) {
      clusterRoleBindings.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getClusterRoleBindingList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      clusterRoleBindings.value = list as ClusterRoleBindingListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchClusterRoleBindings]', err)
      BeeMessage.error('加载集群角色绑定列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    clusterRoleBindings,
    // ==================== Fetch Method ====================
    fetchClusterRoleBindings,
  }
}
