import { computed, reactive, ref, type Reactive, type Ref } from 'vue'

import { useRouter } from 'vue-router'

import type { ClusterRoleBindingQueryForm } from '@/types/kubernetes/security/clusterrolebinding'

import type { ActionItem } from '@/components/business/BeeActionCell/index.vue'

import type { PageEntity } from '@/types'

import { deleteClusterRoleBinding, deleteClusterRoleBindings } from '@/api/kubernetes/security/clusterrolebinding'

import { KubernetesRouteNames } from '@/router/names'

import { BeeMessage } from '@/components/base/BeeMessage'
import BeeTable from '@/components/BeeTable/index.vue'

type DialogConfig = {
  visible: boolean
  loading: boolean
}

type dialogData = {
  uid: string
  name: string
  deletable: boolean
}

/**
 * 集群角色绑定行操作与弹框组合式函数
 * @param clusterUid
 * @param permissionMap
 * @param queryForm
 * @param pageData
 * @param fetchClusterRoleBindings
 * @param tableRef
 * @param dialogData
 * @param dialogDataList
 */
export function useClusterRoleBindingAction<T extends dialogData>(
  clusterUid: Ref<string>,
  permissionMap: Record<string, boolean>,
  queryForm: Reactive<Partial<ClusterRoleBindingQueryForm>>,
  pageData: Reactive<PageEntity>,
  fetchClusterRoleBindings: () => Promise<void>,
  tableRef: Ref<InstanceType<typeof BeeTable> | undefined>,
  dialogData: Ref<T | undefined>,
  dialogDataList: Ref<T[]>,
) {
  const router = useRouter()

  /** 搜索关键词 */
  const searchKey = ref('')

  /** 单个删除弹框配置 */
  const deleteDialogConfig = reactive<DialogConfig>({
    visible: false,
    loading: false,
  })

  /** 批量删除弹框配置 */
  const batchDeleteDialogConfig = reactive<DialogConfig>({
    visible: false,
    loading: false,
  })

  /** 选中数据中可删除列表 */
  const deletableRows = computed(() => dialogDataList.value.filter(row => row.deletable))

  /**
   * 构建行操作数组
   * @param row - 当前行数据
   * @returns 操作项数组
   */
  function getActions(row: T): ActionItem[] {
    const actions: ActionItem[] = []
    if (permissionMap.view) {
      actions.push({ value: 'view', label: '详情', icon: 'basic-view', handler: () => handleViewDetail(row) })
    }
    if (permissionMap.edit) {
      actions.push(
        { value: 'edit', label: '编辑', icon: 'basic-edit', handler: () => handleEdit(row) },
        { value: 'label', label: '配置标签', icon: 'kubernetes-label', handler: () => handleLabels(row) },
        {
          value: 'annotation',
          label: '配置注解',
          icon: 'kubernetes-annotation',
          handler: () => handleAnnotations(row),
        },
      )
    }
    if (permissionMap.delete && row.deletable) {
      actions.push({ value: 'delete', label: '删除', icon: 'basic-delete', handler: () => handleDelete(row) })
    }
    return actions
  }

  /**
   * 搜索
   * @description 关键词同时匹配 UID 与名称
   */
  function handleSearch() {
    queryForm.uid = searchKey.value
    queryForm.name = searchKey.value
    pageData.page = 1
    void fetchClusterRoleBindings()
  }

  /**
   * 重置搜索条件
   */
  function handleReset() {
    queryForm.uid = undefined
    queryForm.name = undefined
    pageData.page = 1
    pageData.pageSize = 10
    searchKey.value = ''
    void fetchClusterRoleBindings()
  }

  /**
   * 创建集群角色绑定
   */
  function handleCreate() {
    router
      .push({ name: KubernetesRouteNames.ClusterRoleBinding.Create, params: { clusterUid: clusterUid.value } })
      .catch(() => {})
  }

  /**
   * 创建集群角色绑定（YAML）
   */
  function handleCreateYaml() {
    router
      .push({ name: KubernetesRouteNames.ClusterRoleBinding.CreateYaml, params: { clusterUid: clusterUid.value } })
      .catch(() => {})
  }

  /**
   * 查看集群角色绑定详情
   * @param row - 当前行数据
   */
  function handleViewDetail(row: T) {
    router
      .push({
        name: KubernetesRouteNames.ClusterRoleBinding.Detail,
        params: { clusterUid: clusterUid.value, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 编辑集群角色绑定
   * @param row - 当前行数据
   */
  function handleEdit(row: T) {
    router
      .push({
        name: KubernetesRouteNames.ClusterRoleBinding.Edit,
        params: { clusterUid: clusterUid.value, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置集群角色绑定标签
   * @param row - 当前行数据
   */
  function handleLabels(row: T) {
    router
      .push({
        name: KubernetesRouteNames.ClusterRoleBinding.ManageLabels,
        params: { clusterUid: clusterUid.value, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置集群角色绑定注解
   * @param row - 当前行数据
   */
  function handleAnnotations(row: T) {
    router
      .push({
        name: KubernetesRouteNames.ClusterRoleBinding.ManageAnnotations,
        params: { clusterUid: clusterUid.value, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 删除集群角色绑定
   * @param row - 当前行数据
   */
  function handleDelete(row: T) {
    dialogData.value = row
    deleteDialogConfig.visible = true
  }

  /**
   * 打开批量删除确认弹窗
   */
  function handleBatchDelete() {
    if (deletableRows.value.length === 0) {
      BeeMessage.warning('选中的集群角色绑定均不可删除')
      return
    }
    batchDeleteDialogConfig.visible = true
  }

  /**
   * 导出集群角色绑定
   * @remarks 功能开发中
   */
  function handleExport() {
    BeeMessage.info('功能开发中')
  }

  /**
   * 导入集群角色绑定
   * @remarks 功能开发中
   */
  function handleImport() {
    BeeMessage.info('功能开发中')
  }

  /**
   * 清空选中数据
   */
  function handleClearSelection() {
    tableRef.value?.clearSelection()
  }

  /**
   * 二次确认删除集群角色绑定
   */
  async function handleConfirmDelete() {
    if (!dialogData.value) {
      deleteDialogConfig.loading = false
      deleteDialogConfig.visible = false
      return
    }
    const { name } = dialogData.value
    try {
      deleteDialogConfig.loading = true
      await deleteClusterRoleBinding(clusterUid.value, name)
      BeeMessage.success(`成功删除集群角色绑定【${name}】`)
      void fetchClusterRoleBindings()
    } catch (err) {
      console.error('[handleConfirmDelete]', err)
      BeeMessage.error(`删除集群角色绑定【${name}】失败`)
    } finally {
      deleteDialogConfig.loading = false
      deleteDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认批量删除集群角色绑定
   */
  async function handleConfirmBatchDelete() {
    if (deletableRows.value.length === 0) {
      batchDeleteDialogConfig.loading = false
      batchDeleteDialogConfig.visible = false
      return
    }
    const uids = deletableRows.value.map(row => row.uid)
    try {
      batchDeleteDialogConfig.loading = true
      await deleteClusterRoleBindings(clusterUid.value, uids)
      BeeMessage.success(`成功删除 ${uids.length} 个集群角色绑定`)
      void fetchClusterRoleBindings()
    } catch (err) {
      console.error('[handleConfirmBatchDelete]', err)
      BeeMessage.error('批量删除集群角色绑定失败')
    } finally {
      batchDeleteDialogConfig.loading = false
      batchDeleteDialogConfig.visible = false
      dialogDataList.value = []
    }
  }

  return {
    // ==================== Reactive State ====================
    searchKey,
    deleteDialogConfig,
    batchDeleteDialogConfig,
    // ==================== Row Action Generator ====================
    getActions,
    // ==================== Handler ====================
    handleSearch,
    handleReset,
    handleCreate,
    handleCreateYaml,
    handleBatchDelete,
    handleImport,
    handleExport,
    handleClearSelection,
    // ==================== Dialog Confirm Handler ====================
    handleConfirmDelete,
    handleConfirmBatchDelete,
  }
}
