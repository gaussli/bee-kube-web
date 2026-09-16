import { reactive, ref, type Ref } from 'vue'

import type { ServiceListVo, ServiceQueryForm } from '@/types/kubernetes/network/service'

import type { PageEntity } from '@/types'

import { getServiceList } from '@/api/kubernetes/network/service'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 服务列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useServiceFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<ServiceQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 服务列表数据 */
  const services = ref<ServiceListVo[]>([])

  /**
   * 请求服务列表数据
   */
  async function fetchServices() {
    if (!clusterUid.value) {
      services.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getServiceList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      services.value = list as ServiceListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchServices]', err)
      BeeMessage.error('加载服务列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    services,
    // ==================== Fetch Method ====================
    fetchServices,
  }
}
