import { reactive, ref, type Ref } from 'vue'

import type { NetworkPolicyListVo, NetworkPolicyQueryForm } from '@/types/kubernetes/network/networkpolicy'

import type { PageEntity } from '@/types'

import { getNetworkPolicyList } from '@/api/kubernetes/network/networkpolicy'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 网络策略列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useNetworkPolicyFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<NetworkPolicyQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 网络策略列表数据 */
  const networkPolicies = ref<NetworkPolicyListVo[]>([])

  /**
   * 请求网络策略列表数据
   */
  async function fetchNetworkPolicies() {
    if (!clusterUid.value) {
      networkPolicies.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getNetworkPolicyList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      networkPolicies.value = list as NetworkPolicyListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchNetworkPolicies]', err)
      BeeMessage.error('加载网络策略列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    networkPolicies,
    // ==================== Fetch Method ====================
    fetchNetworkPolicies,
  }
}
