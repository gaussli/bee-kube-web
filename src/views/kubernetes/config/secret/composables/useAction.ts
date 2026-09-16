import { computed, reactive, ref, type Reactive, type Ref } from 'vue'

import { useRouter } from 'vue-router'

import type { SecretQueryForm } from '@/types/kubernetes/config/secret'

import type { ActionItem } from '@/components/business/BeeActionCell/index.vue'

import type { PageEntity } from '@/types'

import { deleteSecret, deleteSecrets } from '@/api/kubernetes/config/secret'

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
  namespace: string
  deletable: boolean
}

/**
 * 密钥行操作与弹框组合式函数
 * @param clusterUid
 * @param permissionMap
 * @param queryForm
 * @param pageData
 * @param fetchSecrets
 * @param tableRef
 * @param dialogData
 * @param dialogDataList
 */
export function useSecretAction<T extends dialogData>(
  clusterUid: Ref<string>,
  permissionMap: Record<string, boolean>,
  queryForm: Reactive<Partial<SecretQueryForm>>,
  pageData: Reactive<PageEntity>,
  fetchSecrets: () => Promise<void>,
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
   */
  function handleSearch() {
    queryForm.uid = searchKey.value
    queryForm.name = searchKey.value
    pageData.page = 1
    void fetchSecrets()
  }

  /**
   * 重置搜索条件
   */
  function handleReset() {
    queryForm.uid = undefined
    queryForm.name = undefined
    queryForm.namespace = undefined
    queryForm.type = undefined
    pageData.page = 1
    pageData.pageSize = 10
    searchKey.value = ''
    void fetchSecrets()
  }

  /**
   * 创建密钥
   */
  function handleCreate() {
    router.push({ name: KubernetesRouteNames.Secret.Create, params: { clusterUid: clusterUid.value } }).catch(() => {})
  }

  /**
   * 创建密钥（YAML）
   */
  function handleCreateYaml() {
    router
      .push({ name: KubernetesRouteNames.Secret.CreateYaml, params: { clusterUid: clusterUid.value } })
      .catch(() => {})
  }

  /**
   * 查看密钥详情
   * @param row - 当前行数据
   */
  function handleViewDetail(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Secret.Detail,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 编辑密钥
   * @param row - 当前行数据
   */
  function handleEdit(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Secret.Edit,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置密钥标签
   * @param row - 当前行数据
   */
  function handleLabels(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Secret.ManageLabels,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置密钥注解
   * @param row - 当前行数据
   */
  function handleAnnotations(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Secret.ManageAnnotations,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 删除密钥
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
      BeeMessage.warning('选中的密钥均不可删除')
      return
    }
    batchDeleteDialogConfig.visible = true
  }

  /**
   * 导出密钥
   * @remarks 功能开发中
   */
  function handleExport() {
    BeeMessage.info('功能开发中')
  }

  /**
   * 导入密钥
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
   * 二次确认删除密钥
   */
  async function handleConfirmDelete() {
    if (!dialogData.value) {
      deleteDialogConfig.loading = false
      deleteDialogConfig.visible = false
      return
    }
    const { name, namespace } = dialogData.value
    try {
      deleteDialogConfig.loading = true
      await deleteSecret(clusterUid.value, namespace, name)
      BeeMessage.success(`成功删除密钥【${name}】`)
      void fetchSecrets()
      deleteDialogConfig.visible = false
      dialogData.value = undefined
    } catch (err) {
      console.error('[handleConfirmDelete]', err)
      BeeMessage.error(`删除密钥【${name}】失败`)
    } finally {
      deleteDialogConfig.loading = false
    }
  }

  /**
   * 二次确认批量删除密钥
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
      await deleteSecrets(clusterUid.value, uids)
      BeeMessage.success(`成功删除 ${uids.length} 个密钥`)
      void fetchSecrets()
    } catch (err) {
      console.error('[handleConfirmBatchDelete]', err)
      BeeMessage.error('批量删除密钥失败')
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
