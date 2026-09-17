import { reactive, ref, type Ref } from 'vue'

import type { RoleListVo, RoleQueryForm } from '@/types/kubernetes/security/role'

import type { PageEntity } from '@/types'

import { getRoleList } from '@/api/kubernetes/security/role'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 角色列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useRoleFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<RoleQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 角色列表数据 */
  const roles = ref<RoleListVo[]>([])

  /**
   * 请求角色列表数据
   */
  async function fetchRoles() {
    if (!clusterUid.value) {
      roles.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getRoleList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      roles.value = list as RoleListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchRoles]', err)
      BeeMessage.error('加载角色列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    roles,
    // ==================== Fetch Method ====================
    fetchRoles,
  }
}
