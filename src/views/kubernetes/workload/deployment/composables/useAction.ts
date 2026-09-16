import { computed, reactive, ref, type Reactive, type Ref } from 'vue'

import { useRouter } from 'vue-router'

import type { DeploymentQueryForm } from '@/types/kubernetes/workload/deployment'

import type { ActionItem } from '@/components/business/BeeActionCell/index.vue'

import type { PageEntity } from '@/types'

import {
  deleteDeployment,
  deleteDeployments,
  pauseDeployment,
  restartDeployment,
  resumeDeployment,
  scaleDeployment,
} from '@/api/kubernetes/workload/deployment'

import { KubernetesRouteNames } from '@/router/names'

import { BeeMessage } from '@/components/base/BeeMessage'
import BeeTable from '@/components/BeeTable/index.vue'

const router = useRouter()

type DialogConfig = {
  visiable: boolean
  loading: boolean
}

type dialogData = {
  uid: string
  namespace: string
  name: string
  replicas: number
  deletable: boolean
  paused: boolean
}

/**
 *
 * @param clusterUid
 * @param permissionMap
 * @param queryForm
 * @param pageData
 * @param fetchDeployments
 * @param tableRef
 * @param dialogData
 * @param dialogDataList
 */
export function useDeploymentAction<T extends dialogData>(
  clusterUid: Ref<string>,
  permissionMap: Record<string, boolean>,
  queryForm: Reactive<Partial<DeploymentQueryForm>>,
  pageData: Reactive<PageEntity>,
  fetchDeployments: () => Promise<void>,
  tableRef: Ref<InstanceType<typeof BeeTable> | undefined>,
  dialogData: Ref<T | undefined>,
  dialogDataList: Ref<T[]>,
) {
  /** 搜索关键词 */
  const searchKey = ref('')

  const scaleDialogConfig = reactive<DialogConfig>({
    visiable: false,
    loading: false,
  })

  const restartDialogConfig = reactive<DialogConfig>({
    visiable: false,
    loading: false,
  })

  const resumeDialogConfig = reactive<DialogConfig>({
    visiable: false,
    loading: false,
  })

  const pauseDialogConfig = reactive<DialogConfig>({
    visiable: false,
    loading: false,
  })

  const deleteDialogConfig = reactive<DialogConfig>({
    visiable: false,
    loading: false,
  })

  const batchDeleteDialogConfig = reactive<DialogConfig>({
    visiable: false,
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
        { value: 'scale', label: '扩缩容', icon: 'kubernetes-scale', handler: () => handleScale(row) },
        { value: 'restart', label: '重启', icon: 'basic-refresh', handler: () => handleRestart(row) },
        { value: 'rollback', label: '回滚', icon: 'kubernetes-rollback', handler: () => handleRollback(row) },
      )
      if (row.paused) {
        actions.push({
          value: 'resume',
          label: '恢复更新',
          icon: 'kubernetes-resume',
          handler: () => handleResume(row),
        })
      } else {
        actions.push({
          value: 'pause',
          label: '暂停更新',
          icon: 'kubernetes-pause',
          handler: () => handlePause(row),
        })
      }
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
    void fetchDeployments()
  }

  /**
   * 重置搜索条件
   */
  function handleReset() {
    queryForm.uid = undefined
    queryForm.name = undefined
    queryForm.namespace = undefined
    queryForm.status = undefined
    pageData.page = 1
    pageData.pageSize = 10
    searchKey.value = ''
    void fetchDeployments()
  }

  /**
   * 创建无状态应用
   */
  function handleCreate() {
    router
      .push({ name: KubernetesRouteNames.Deployment.Create, params: { clusterUid: clusterUid.value } })
      .catch(() => {})
  }

  /**
   * 创建无状态应用（YAML）
   */
  function handleCreateYaml() {
    router
      .push({ name: KubernetesRouteNames.Deployment.CreateYaml, params: { clusterUid: clusterUid.value } })
      .catch(() => {})
  }

  /**
   * 查看无状态应用详情
   * @param row - 当前行数据
   */
  function handleViewDetail(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Deployment.Detail,
        params: { clusterId: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 编辑无状态应用
   * @param row
   */
  function handleEdit(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Deployment.Edit,
        params: { clusterId: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置无状态应用标签
   * @param row - 当前行数据
   */
  function handleLabels(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Deployment.ManageLabels,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置无状态应用注解
   * @param row - 当前行数据
   */
  function handleAnnotations(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Deployment.ManageAnnotations,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 回滚无状态应用
   * @param row - 当前行数据
   */
  function handleRollback(row: T) {
    BeeMessage.info(`回滚: ${row.name}`)
  }

  /**
   * 扩缩容无状态应用
   * @param row - 当前行数据
   * @param row.namespace
   * @param row.name
   */
  function handleScale(row: T) {
    dialogData.value = row
    scaleDialogConfig.visiable = true
  }

  /**
   * 重启无状态应用
   * @param row - 当前行数据
   */
  function handleRestart(row: T) {
    dialogData.value = row
    restartDialogConfig.visiable = true
  }

  /**
   * 恢复无状态应用更新
   * @param row - 当前行数据
   */
  function handleResume(row: T) {
    dialogData.value = row
    resumeDialogConfig.visiable = true
  }

  /**
   * 暂停无状态应用更新
   * @param row - 当前行数据
   */
  function handlePause(row: T) {
    dialogData.value = row
    pauseDialogConfig.visiable = true
  }

  /**
   * 删除无状态应用
   * @param row
   */
  function handleDelete(row: T) {
    dialogData.value = row
    deleteDialogConfig.visiable = true
  }

  /**
   * 打开批量删除确认弹窗
   */
  function handleBatchDelete() {
    if (deletableRows.value.length === 0) {
      BeeMessage.warning('选中的无状态应用均不可删除')
      return
    }
    batchDeleteDialogConfig.visiable = true
  }

  /**
   * 导出 Deployment
   * @remarks 功能开发中
   */
  function handleExport() {
    BeeMessage.info('功能开发中')
  }

  /**
   * 导入 Deployment
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
   * 二次确认扩缩容无状态应用
   * @param newReplicas
   */
  async function handleConfirmScale(newReplicas: number) {
    if (!dialogData.value) {
      scaleDialogConfig.loading = false
      scaleDialogConfig.visiable = false
      return
    }
    const { namespace, name, replicas } = dialogData.value
    try {
      scaleDialogConfig.loading = true
      await scaleDeployment(clusterUid.value, namespace, name, { replicas: newReplicas })
      if (replicas > newReplicas) BeeMessage.success(`成功缩容无状态应用【${name}】`)
      else BeeMessage.success(`成功扩容无状态应用【${name}】`)
      void fetchDeployments()
    } catch (err) {
      console.error('[handleRestart]', err)
      BeeMessage.error(`扩缩容无状态应用【${name}】失败`)
    } finally {
      scaleDialogConfig.loading = false
      scaleDialogConfig.visiable = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认重启无状态应用
   */
  async function handleConfirmRestart() {
    if (!dialogData.value) {
      restartDialogConfig.loading = false
      restartDialogConfig.visiable = false
      return
    }
    const { namespace, name } = dialogData.value
    try {
      restartDialogConfig.loading = true
      await restartDeployment(clusterUid.value, namespace, name)
      BeeMessage.success(`成功重启无状态应用【${name}】`)
      void fetchDeployments()
    } catch (err) {
      console.error('[handleRestart]', err)
      BeeMessage.error(`重启无状态应用【${name}】失败`)
    } finally {
      restartDialogConfig.loading = false
      restartDialogConfig.visiable = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认恢复无状态应用更新
   */
  async function handleConfirmResume() {
    if (!dialogData.value) {
      resumeDialogConfig.loading = false
      resumeDialogConfig.visiable = false
      return
    }
    const { namespace, name } = dialogData.value
    try {
      resumeDialogConfig.loading = true
      await resumeDeployment(clusterUid.value, namespace, name)
      BeeMessage.success(`成功恢复无状态应用【${name}】更新`)
      void fetchDeployments()
    } catch (err) {
      console.error('[handleResume]', err)
      BeeMessage.error(`恢复无状态应用【${name}】更新失败`)
    } finally {
      resumeDialogConfig.loading = false
      resumeDialogConfig.visiable = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认暂停无状态应用更新
   */
  async function handleConfirmPause() {
    if (!dialogData.value) {
      pauseDialogConfig.loading = false
      pauseDialogConfig.visiable = false
      return
    }
    const { namespace, name } = dialogData.value
    try {
      pauseDialogConfig.loading = true
      await pauseDeployment(clusterUid.value, namespace, name)
      BeeMessage.success(`成功暂停无状态应用【${name}】更新`)
      void fetchDeployments()
    } catch (err) {
      console.error('[handlePause]', err)
      BeeMessage.error(`暂停无状态应用【${name}】更新失败`)
    } finally {
      pauseDialogConfig.loading = false
      pauseDialogConfig.visiable = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认删除无状态应用
   */
  async function handleConfirmDelete() {
    if (!dialogData.value) {
      deleteDialogConfig.loading = false
      deleteDialogConfig.visiable = false
      return
    }
    const { namespace, name } = dialogData.value
    try {
      deleteDialogConfig.loading = true
      await deleteDeployment(clusterUid.value, namespace, name)
      BeeMessage.success(`成功删除无状态应用【${name}】`)
      void fetchDeployments()
    } catch (err) {
      console.error('[handleConfirmDelete]', err)
      BeeMessage.error(`删除无状态应用【${name}】失败`)
    } finally {
      deleteDialogConfig.loading = false
      deleteDialogConfig.visiable = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认批量删除无状态应用
   */
  async function handleConfirmBatchDelete() {
    if (deletableRows.value.length === 0) {
      batchDeleteDialogConfig.loading = false
      batchDeleteDialogConfig.visiable = false
      return
    }
    const uids = deletableRows.value.map(row => row.uid)
    try {
      deleteDialogConfig.loading = true
      await deleteDeployments(clusterUid.value, uids)
      BeeMessage.success(`成功删除 ${uids.length} 个无状态应用`)
      void fetchDeployments()
    } catch (err) {
      console.error('[handleConfirmBatchDelete]', err)
      BeeMessage.error('批量删除无状态应用失败')
    } finally {
      batchDeleteDialogConfig.loading = false
      batchDeleteDialogConfig.visiable = false
      dialogDataList.value = []
    }
  }

  return {
    // ==================== Reactive State ====================
    searchKey,
    scaleDialogConfig,
    restartDialogConfig,
    resumeDialogConfig,
    pauseDialogConfig,
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
    handleConfirmScale,
    handleConfirmRestart,
    handleConfirmResume,
    handleConfirmPause,
    handleConfirmDelete,
    handleConfirmBatchDelete,
  }
}
