import { reactive, ref, type Ref } from 'vue'

import type { NodeListVo, NodeQueryForm } from '@/types/kubernetes/node'

import type { PageEntity } from '@/types'

import { getNodeList } from '@/api/kubernetes/node'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 节点列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useNodeFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<NodeQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 节点列表数据 */
  const nodes = ref<NodeListVo[]>([])

  /**
   * 请求节点列表数据
   */
  async function fetchNodes() {
    if (!clusterUid.value) {
      nodes.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getNodeList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      nodes.value = list
      pageData.total = total
    } catch (err) {
      console.error('[fetchNodes]', err)
      BeeMessage.error('加载节点列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    nodes,
    // ==================== Fetch Method ====================
    fetchNodes,
  }
}
