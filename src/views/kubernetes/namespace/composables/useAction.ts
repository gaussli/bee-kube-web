import { computed, reactive, ref, type Reactive, type Ref } from 'vue'

import { useRouter } from 'vue-router'

import type { NamespaceQueryForm } from '@/types/kubernetes/namespace'

import type { ActionItem } from '@/components/business/BeeActionCell/index.vue'

import type { PageEntity } from '@/types'

import { deleteNamespace, deleteNamespaces } from '@/api/kubernetes/namespace/namespace'

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
 * 命名空间行操作与弹框组合式函数
 * @param clusterUid
 * @param permissionMap
 * @param queryForm
 * @param pageData
 * @param fetchNamespaces
 * @param tableRef
 * @param dialogData
 * @param dialogDataList
 */
export function useNamespaceAction<T extends dialogData>(
  clusterUid: Ref<string>,
  permissionMap: Record<string, boolean>,
  queryForm: Reactive<Partial<NamespaceQueryForm>>,
  pageData: Reactive<PageEntity>,
  fetchNamespaces: () => Promise<void>,
  tableRef: Ref<InstanceType<typeof BeeTable> | undefined>,
  dialogData: Ref<T | undefined>,
  dialogDataList: Ref<T[]>,
) {
  const router = useRouter()

  /** 搜索关键词 */
  const searchKey = ref('')

  const deleteDialogConfig = reactive<DialogConfig>({
    visible: false,
    loading: false,
  })

  const batchDeleteDialogConfig = reactive<DialogConfig>({
    visible: false,
    loading: false,
  })

  /** 数据中可删除列表 */
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
        { value: 'labels', label: '配置标签', icon: 'kubernetes-label', handler: () => handleLabels(row) },
        {
          value: 'annotations',
          label: '配置注解',
          icon: 'kubernetes-annotation',
          handler: () => handleAnnotations(row),
        },
      )
    }
    if (permissionMap.resourceQuotaView) {
      actions.push({
        value: 'resourcequota',
        label: '资源配额',
        icon: 'kubernetes-resource-quota',
        handler: () => handleResourceQuota(row),
      })
    }
    if (permissionMap.limitRangeView) {
      actions.push({
        value: 'limitrange',
        label: '资源限制',
        icon: 'kubernetes-limit-range',
        handler: () => handleLimitRange(row),
      })
    }
    if (permissionMap.delete && row.deletable) {
      actions.push({ value: 'delete', label: '删除', icon: 'basic-delete', handler: () => handleDelete(row) })
    }
    return actions
  }

  /**
   * 搜索
   */
  function handleSearch() {
    queryForm.uid = searchKey.value
    queryForm.name = searchKey.value
    pageData.page = 1
    void fetchNamespaces()
  }

  /**
   * 重置搜索条件
   */
  function handleReset() {
    queryForm.uid = undefined
    queryForm.name = undefined
    queryForm.status = undefined
    pageData.page = 1
    pageData.pageSize = 10
    searchKey.value = ''
    void fetchNamespaces()
  }

  /**
   * 创建命名空间
   */
  function handleCreate() {
    router
      .push({ name: KubernetesRouteNames.Namespace.Create, params: { clusterUid: clusterUid.value } })
      .catch(() => {})
  }

  /**
   * 创建命名空间（YAML）
   */
  function handleCreateYaml() {
    router
      .push({ name: KubernetesRouteNames.Namespace.CreateYaml, params: { clusterUid: clusterUid.value } })
      .catch(() => {})
  }

  /**
   * 查看命名空间详情
   * @param row - 当前行数据
   */
  function handleViewDetail(row: T) {
    router
      .push({ name: KubernetesRouteNames.Namespace.Detail, params: { clusterUid: clusterUid.value, name: row.name } })
      .catch(() => {})
  }

  /**
   * 编辑命名空间
   * @param row - 当前行数据
   */
  function handleEdit(row: T) {
    router
      .push({ name: KubernetesRouteNames.Namespace.Edit, params: { clusterUid: clusterUid.value, name: row.name } })
      .catch(() => {})
  }

  /**
   * 配置命名空间标签
   * @param row - 当前行数据
   */
  function handleLabels(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Namespace.ManageLabels,
        params: { clusterUid: clusterUid.value, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置命名空间注解
   * @param row - 当前行数据
   */
  function handleAnnotations(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Namespace.ManageAnnotations,
        params: { clusterUid: clusterUid.value, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 查看命名空间的资源配额
   * @param row - 当前行数据
   */
  function handleResourceQuota(row: T) {
    router
      .push({
        name: KubernetesRouteNames.ResourceQuota.List,
        query: { clusterUid: clusterUid.value, namespace: row.name },
      })
      .catch(() => {})
  }

  /**
   * 查看命名空间的资源限制
   * @param row - 当前行数据
   */
  function handleLimitRange(row: T) {
    router
      .push({
        name: KubernetesRouteNames.LimitRange.List,
        query: { clusterUid: clusterUid.value, namespace: row.name },
      })
      .catch(() => {})
  }

  /**
   * 删除命名空间
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
      BeeMessage.warning('选中的命名空间均不可删除')
      return
    }
    batchDeleteDialogConfig.visible = true
  }

  /**
   * 导出命名空间
   * @remarks 功能开发中
   */
  function handleExport() {
    BeeMessage.info('功能开发中')
  }

  /**
   * 导入命名空间
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
   * 二次确认删除命名空间
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
      await deleteNamespace(clusterUid.value, name)
      BeeMessage.success(`成功删除命名空间【${name}】`)
      void fetchNamespaces()
    } catch (err) {
      console.error('[handleConfirmDelete]', err)
      BeeMessage.error(`删除命名空间【${name}】失败`)
    } finally {
      deleteDialogConfig.loading = false
      deleteDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认批量删除命名空间
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
      await deleteNamespaces(clusterUid.value, uids)
      BeeMessage.success(`成功删除 ${uids.length} 个命名空间`)
      void fetchNamespaces()
    } catch (err) {
      console.error('[handleConfirmBatchDelete]', err)
      BeeMessage.error('批量删除命名空间失败')
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
    // ==================== Row Actioin Generator ====================
    getActions,
    // ==================== Hanlder ====================
    handleSearch,
    handleReset,
    handleCreate,
    handleCreateYaml,
    handleBatchDelete,
    handleImport,
    handleExport,
    handleClearSelection,
    // ==================== Dialog Confirm Hanlder ====================
    handleConfirmDelete,
    handleConfirmBatchDelete,
  }
}
