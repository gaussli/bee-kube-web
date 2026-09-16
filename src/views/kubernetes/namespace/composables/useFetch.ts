import { reactive, ref, type Ref } from 'vue'

import type { NamespaceListVo, NamespaceQueryForm } from '@/types/kubernetes/namespace'

import type { Option } from '@/config/kubernetes'
import type { PageEntity } from '@/types'

import { getNamespaceList } from '@/api/kubernetes/namespace/namespace'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 *
 * @param clusterUid
 */
export function useNamespaceFetch(clusterUid: Ref<string>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<NamespaceQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 命名空间列表数据 */
  const namespaces = ref<NamespaceListVo[]>([])
  /** 命名空间选项列表数据 */
  const namespaceOptions = ref<Option[]>([{ label: '全部命名空间', value: undefined }])

  /**
   * 请求命名空间列表数据
   * @param tableLoading
   */
  async function fetchNamespaces(tableLoading: Ref<boolean>) {
    if (!clusterUid.value) {
      namespaces.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getNamespaceList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      namespaces.value = list as NamespaceListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchNamespaces]', err)
      BeeMessage.error('加载命名空间列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  /**
   * 请求命名空间选项列表数据
   */
  async function fetchNamespaceOptions() {
    if (!clusterUid.value) return
    try {
      const { list } = await getNamespaceList(clusterUid.value, { mode: 'Simple' })
      namespaceOptions.value = [
        { label: '全部命名空间', value: undefined },
        ...list.map(ns => ({ label: ns.name, value: ns.name })),
      ]
    } catch (err) {
      console.error('[fetchNamespaceOptions]', err)
      BeeMessage.error('加载命名空间选项失败，请稍后再试')
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    namespaces,
    namespaceOptions,
    // ==================== Fetch Method ====================
    fetchNamespaces,
    fetchNamespaceOptions,
  }
}
