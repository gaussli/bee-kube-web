import { reactive, ref, type Ref } from 'vue'

import type { DaemonSetListVo, DaemonSetQueryForm } from '@/types/kubernetes/workload/daemonset'

import type { PageEntity } from '@/types'

import { getDaemonSetList } from '@/api/kubernetes/workload/daemonset'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 守护进程集列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useDaemonSetFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<DaemonSetQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 守护进程集列表数据 */
  const daemonSets = ref<DaemonSetListVo[]>([])

  /**
   * 请求守护进程集列表数据
   */
  async function fetchDaemonSets() {
    if (!clusterUid.value) {
      daemonSets.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getDaemonSetList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      daemonSets.value = list as DaemonSetListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchDaemonSets]', err)
      BeeMessage.error('加载守护进程集列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    daemonSets,
    // ==================== Fetch Method ====================
    fetchDaemonSets,
  }
}
