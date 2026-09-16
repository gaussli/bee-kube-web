import { reactive, ref, type Ref } from 'vue'

import type { DeploymentListVo, DeploymentQueryForm } from '@/types/kubernetes/workload/deployment'

import type { PageEntity } from '@/types'

import { getDeploymentList } from '@/api/kubernetes/workload/deployment'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 *
 * @param clusterUid
 * @param tableLoading
 */
export function useDeploymentFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<DeploymentQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 无状态应用列表数据 */
  const deployments = ref<DeploymentListVo[]>([])

  /**
   * 请求无状态应用列表数据
   */
  async function fetchDeployments() {
    if (!clusterUid.value) {
      deployments.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getDeploymentList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      deployments.value = list as DeploymentListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchDeployments]', err)
      BeeMessage.error('加载无状态应用列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    deployments,
    // ==================== Fetch Method ====================
    fetchDeployments,
  }
}
