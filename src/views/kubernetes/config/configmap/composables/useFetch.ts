import { reactive, ref, type Ref } from 'vue'

import type { ConfigMapListVo, ConfigMapQueryForm } from '@/types/kubernetes/config/configmap'

import type { PageEntity } from '@/types'

import { getConfigMapList } from '@/api/kubernetes/config/configmap'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 配置映射列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useConfigMapFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<ConfigMapQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 配置映射列表数据 */
  const configMaps = ref<ConfigMapListVo[]>([])

  /**
   * 请求配置映射列表数据
   */
  async function fetchConfigMaps() {
    if (!clusterUid.value) {
      configMaps.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getConfigMapList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      configMaps.value = list as ConfigMapListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchConfigMaps]', err)
      BeeMessage.error('加载配置映射列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    configMaps,
    // ==================== Fetch Method ====================
    fetchConfigMaps,
  }
}
