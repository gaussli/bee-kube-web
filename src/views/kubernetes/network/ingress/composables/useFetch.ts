import { reactive, ref, type Ref } from 'vue'

import type { IngressListVo, IngressQueryForm } from '@/types/kubernetes/network/ingress'

import type { PageEntity } from '@/types'

import { getIngressList } from '@/api/kubernetes/network/ingress'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 入口列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useIngressFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<IngressQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 入口列表数据 */
  const ingresses = ref<IngressListVo[]>([])

  /**
   * 请求入口列表数据
   */
  async function fetchIngresses() {
    if (!clusterUid.value) {
      ingresses.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getIngressList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      ingresses.value = list as IngressListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchIngresses]', err)
      BeeMessage.error('加载入口列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    ingresses,
    // ==================== Fetch Method ====================
    fetchIngresses,
  }
}
