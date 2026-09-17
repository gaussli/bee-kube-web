import { reactive, ref, type Ref } from 'vue'

import type { PersistentVolumeListVo, PersistentVolumeQueryForm } from '@/types/kubernetes/storage/persistentvolume'

import type { PageEntity } from '@/types'

import { getPersistentVolumeList } from '@/api/kubernetes/storage/persistentvolume'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 持久卷列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function usePersistentVolumeFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<PersistentVolumeQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 持久卷列表数据 */
  const persistentVolumes = ref<PersistentVolumeListVo[]>([])

  /**
   * 请求持久卷列表数据
   */
  async function fetchPersistentVolumes() {
    if (!clusterUid.value) {
      persistentVolumes.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getPersistentVolumeList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      persistentVolumes.value = list as PersistentVolumeListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchPersistentVolumes]', err)
      BeeMessage.error('加载持久卷列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    persistentVolumes,
    // ==================== Fetch Method ====================
    fetchPersistentVolumes,
  }
}
