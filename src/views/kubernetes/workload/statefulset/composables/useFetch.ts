import { reactive, ref, type Ref } from 'vue'

import type { StatefulSetListVo, StatefulSetQueryForm } from '@/types/kubernetes/workload/statefulset'

import type { PageEntity } from '@/types'

import { getStatefulSetList } from '@/api/kubernetes/workload/statefulset'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 有状态应用列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useStatefulSetFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<StatefulSetQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 有状态应用列表数据 */
  const statefulSets = ref<StatefulSetListVo[]>([])

  /**
   * 请求有状态应用列表数据
   */
  async function fetchStatefulSets() {
    if (!clusterUid.value) {
      statefulSets.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getStatefulSetList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      statefulSets.value = list as StatefulSetListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchStatefulSets]', err)
      BeeMessage.error('加载有状态应用列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    statefulSets,
    // ==================== Fetch Method ====================
    fetchStatefulSets,
  }
}
