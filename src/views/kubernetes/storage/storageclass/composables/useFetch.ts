import { reactive, ref, type Ref } from 'vue'

import type { StorageClassListVo, StorageClassQueryForm } from '@/types/kubernetes/storage/storageclass'

import type { PageEntity } from '@/types'

import { getStorageClassList } from '@/api/kubernetes/storage/storageclass'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 存储类列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useStorageClassFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<StorageClassQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 存储类列表数据 */
  const storageClasses = ref<StorageClassListVo[]>([])

  /**
   * 请求存储类列表数据
   */
  async function fetchStorageClasses() {
    if (!clusterUid.value) {
      storageClasses.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getStorageClassList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      storageClasses.value = list as StorageClassListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchStorageClasses]', err)
      BeeMessage.error('加载存储类列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    storageClasses,
    // ==================== Fetch Method ====================
    fetchStorageClasses,
  }
}
