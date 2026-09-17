import { reactive, ref, type Ref } from 'vue'

import type { RoleBindingListVo, RoleBindingQueryForm } from '@/types/kubernetes/security/rolebinding'

import type { PageEntity } from '@/types'

import { getRoleBindingList } from '@/api/kubernetes/security/rolebinding'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 角色绑定列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useRoleBindingFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<RoleBindingQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 角色绑定列表数据 */
  const roleBindings = ref<RoleBindingListVo[]>([])

  /**
   * 请求角色绑定列表数据
   */
  async function fetchRoleBindings() {
    if (!clusterUid.value) {
      roleBindings.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getRoleBindingList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      roleBindings.value = list as RoleBindingListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchRoleBindings]', err)
      BeeMessage.error('加载角色绑定列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    roleBindings,
    // ==================== Fetch Method ====================
    fetchRoleBindings,
  }
}
