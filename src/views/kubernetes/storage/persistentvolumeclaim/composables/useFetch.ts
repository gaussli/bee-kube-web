import { reactive, ref, type Ref } from 'vue'

import type {
  PersistentVolumeClaimListVo,
  PersistentVolumeClaimQueryForm,
} from '@/types/kubernetes/storage/persistentvolumeclaim'

import type { PageEntity } from '@/types'

import { getPersistentVolumeClaimList } from '@/api/kubernetes/storage/persistentvolumeclaim'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 持久卷声明列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function usePersistentVolumeClaimFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<PersistentVolumeClaimQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 持久卷声明列表数据 */
  const persistentVolumeClaims = ref<PersistentVolumeClaimListVo[]>([])

  /**
   * 请求持久卷声明列表数据
   */
  async function fetchPersistentVolumeClaims() {
    if (!clusterUid.value) {
      persistentVolumeClaims.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getPersistentVolumeClaimList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      persistentVolumeClaims.value = list as PersistentVolumeClaimListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchPersistentVolumeClaims]', err)
      BeeMessage.error('加载持久卷声明列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    persistentVolumeClaims,
    // ==================== Fetch Method ====================
    fetchPersistentVolumeClaims,
  }
}
