import { reactive, ref, type Ref } from 'vue'

import type { SecretListVo, SecretQueryForm } from '@/types/kubernetes/config/secret'

import type { PageEntity } from '@/types'

import { getSecretList } from '@/api/kubernetes/config/secret'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 密钥列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useSecretFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<SecretQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 密钥列表数据 */
  const secrets = ref<SecretListVo[]>([])

  /**
   * 请求密钥列表数据
   */
  async function fetchSecrets() {
    if (!clusterUid.value) {
      secrets.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getSecretList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      secrets.value = list as SecretListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchSecrets]', err)
      BeeMessage.error('加载密钥列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    secrets,
    // ==================== Fetch Method ====================
    fetchSecrets,
  }
}
