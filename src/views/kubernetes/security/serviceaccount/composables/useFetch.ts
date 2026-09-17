import { reactive, ref, type Ref } from 'vue'

import type { ServiceAccountListVo, ServiceAccountQueryForm } from '@/types/kubernetes/security/serviceaccount'

import type { PageEntity } from '@/types'

import { getServiceAccountList } from '@/api/kubernetes/security/serviceaccount'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 服务账号列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useServiceAccountFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<ServiceAccountQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 服务账号列表数据 */
  const serviceAccounts = ref<ServiceAccountListVo[]>([])

  /**
   * 请求服务账号列表数据
   */
  async function fetchServiceAccounts() {
    if (!clusterUid.value) {
      serviceAccounts.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getServiceAccountList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      serviceAccounts.value = list as ServiceAccountListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchServiceAccounts]', err)
      BeeMessage.error('加载服务账号列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    serviceAccounts,
    // ==================== Fetch Method ====================
    fetchServiceAccounts,
  }
}
