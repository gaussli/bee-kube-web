import { computed, reactive, ref, type Reactive, type Ref } from 'vue'

import { useRouter } from 'vue-router'

import type { DaemonSetQueryForm } from '@/types/kubernetes/workload/daemonset'

import type { ActionItem } from '@/components/business/BeeActionCell/index.vue'

import type { PageEntity } from '@/types'

import {
  deleteDaemonSet,
  deleteDaemonSets,
  pauseDaemonSet,
  restartDaemonSet,
  resumeDaemonSet,
} from '@/api/kubernetes/workload/daemonset'

import { KubernetesRouteNames } from '@/router/names'

import { BeeMessage } from '@/components/base/BeeMessage'
import BeeTable from '@/components/BeeTable/index.vue'

type DialogConfig = {
  visible: boolean
  loading: boolean
}

type dialogData = {
  uid: string
  namespace: string
  name: string
  deletable: boolean
  paused: boolean
}

/**
 * 守护进程集行操作与弹框组合式函数
 * @param clusterUid
 * @param permissionMap
 * @param queryForm
 * @param pageData
 * @param fetchDaemonSets
 * @param tableRef
 * @param dialogData
 * @param dialogDataList
 */
export function useDaemonSetAction<T extends dialogData>(
  clusterUid: Ref<string>,
  permissionMap: Record<string, boolean>,
  queryForm: Reactive<Partial<DaemonSetQueryForm>>,
  pageData: Reactive<PageEntity>,
  fetchDaemonSets: () => Promise<void>,
  tableRef: Ref<InstanceType<typeof BeeTable> | undefined>,
  dialogData: Ref<T | undefined>,
  dialogDataList: Ref<T[]>,
) {
  const router = useRouter()

  /** 搜索关键词 */
  const searchKey = ref('')

  const restartDialogConfig = reactive<DialogConfig>({
    visible: false,
    loading: false,
  })

  const resumeDialogConfig = reactive<DialogConfig>({
    visible: false,
    loading: false,
  })

  const pauseDialogConfig = reactive<DialogConfig>({
    visible: false,
    loading: false,
  })

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
    void fetchDaemonSets()
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
    void fetchDaemonSets()
  }

  /**
   * 创建守护进程集
   */
  function handleCreate() {
    router
      .push({ name: KubernetesRouteNames.DaemonSet.Create, params: { clusterUid: clusterUid.value } })
      .catch(() => {})
  }

  /**
   * 创建守护进程集（YAML）
   */
  function handleCreateYaml() {
    router
      .push({ name: KubernetesRouteNames.DaemonSet.CreateYaml, params: { clusterUid: clusterUid.value } })
      .catch(() => {})
  }

  /**
   * 查看守护进程集详情
   * @param row - 当前行数据
   */
  function handleViewDetail(row: T) {
    router
      .push({
        name: KubernetesRouteNames.DaemonSet.Detail,
        params: { clusterId: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 编辑守护进程集
   * @param row
   */
  function handleEdit(row: T) {
    router
      .push({
        name: KubernetesRouteNames.DaemonSet.Edit,
        params: { clusterId: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置守护进程集标签
   * @param row - 当前行数据
   */
  function handleLabels(row: T) {
    router
      .push({
        name: KubernetesRouteNames.DaemonSet.ManageLabels,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置守护进程集注解
   * @param row - 当前行数据
   */
  function handleAnnotations(row: T) {
    router
      .push({
        name: KubernetesRouteNames.DaemonSet.ManageAnnotations,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 回滚守护进程集
   * @param row - 当前行数据
   */
  function handleRollback(row: T) {
    BeeMessage.info(`回滚: ${row.name}`)
  }

  /**
   * 重启守护进程集
   * @param row - 当前行数据
   */
  function handleRestart(row: T) {
    dialogData.value = row
    restartDialogConfig.visible = true
  }

  /**
   * 恢复守护进程集更新
   * @param row - 当前行数据
   */
  function handleResume(row: T) {
    dialogData.value = row
    resumeDialogConfig.visible = true
  }

  /**
   * 暂停守护进程集更新
   * @param row - 当前行数据
   */
  function handlePause(row: T) {
    dialogData.value = row
    pauseDialogConfig.visible = true
  }

  /**
   * 删除守护进程集
   * @param row
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
      BeeMessage.warning('选中的守护进程集均不可删除')
      return
    }
    batchDeleteDialogConfig.visible = true
  }

  /**
   * 导出 DaemonSet
   * @remarks 功能开发中
   */
  function handleExport() {
    BeeMessage.info('功能开发中')
  }

  /**
   * 导入 DaemonSet
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
   * 二次确认重启守护进程集
   */
  async function handleConfirmRestart() {
    if (!dialogData.value) {
      restartDialogConfig.loading = false
      restartDialogConfig.visible = false
      return
    }
    const { namespace, name } = dialogData.value
    try {
      restartDialogConfig.loading = true
      await restartDaemonSet(clusterUid.value, namespace, name)
      BeeMessage.success(`成功重启守护进程集【${name}】`)
      void fetchDaemonSets()
    } catch (err) {
      console.error('[handleConfirmRestart]', err)
      BeeMessage.error(`重启守护进程集【${name}】失败`)
    } finally {
      restartDialogConfig.loading = false
      restartDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认恢复守护进程集更新
   */
  async function handleConfirmResume() {
    if (!dialogData.value) {
      resumeDialogConfig.loading = false
      resumeDialogConfig.visible = false
      return
    }
    const { namespace, name } = dialogData.value
    try {
      resumeDialogConfig.loading = true
      await resumeDaemonSet(clusterUid.value, namespace, name)
      BeeMessage.success(`成功恢复守护进程集【${name}】更新`)
      void fetchDaemonSets()
    } catch (err) {
      console.error('[handleConfirmResume]', err)
      BeeMessage.error(`恢复守护进程集【${name}】更新失败`)
    } finally {
      resumeDialogConfig.loading = false
      resumeDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认暂停守护进程集更新
   */
  async function handleConfirmPause() {
    if (!dialogData.value) {
      pauseDialogConfig.loading = false
      pauseDialogConfig.visible = false
      return
    }
    const { namespace, name } = dialogData.value
    try {
      pauseDialogConfig.loading = true
      await pauseDaemonSet(clusterUid.value, namespace, name)
      BeeMessage.success(`成功暂停守护进程集【${name}】更新`)
      void fetchDaemonSets()
    } catch (err) {
      console.error('[handleConfirmPause]', err)
      BeeMessage.error(`暂停守护进程集【${name}】更新失败`)
    } finally {
      pauseDialogConfig.loading = false
      pauseDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认删除守护进程集
   */
  async function handleConfirmDelete() {
    if (!dialogData.value) {
      deleteDialogConfig.loading = false
      deleteDialogConfig.visible = false
      return
    }
    const { namespace, name } = dialogData.value
    try {
      deleteDialogConfig.loading = true
      await deleteDaemonSet(clusterUid.value, namespace, name)
      BeeMessage.success(`成功删除守护进程集【${name}】`)
      void fetchDaemonSets()
    } catch (err) {
      console.error('[handleConfirmDelete]', err)
      BeeMessage.error(`删除守护进程集【${name}】失败`)
    } finally {
      deleteDialogConfig.loading = false
      deleteDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认批量删除守护进程集
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
      await deleteDaemonSets(clusterUid.value, uids)
      BeeMessage.success(`成功删除 ${uids.length} 个守护进程集`)
      void fetchDaemonSets()
    } catch (err) {
      console.error('[handleConfirmBatchDelete]', err)
      BeeMessage.error('批量删除守护进程集失败')
    } finally {
      batchDeleteDialogConfig.loading = false
      batchDeleteDialogConfig.visible = false
      dialogDataList.value = []
    }
  }

  return {
    // ==================== Reactive State ====================
    searchKey,
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
    handleConfirmRestart,
    handleConfirmResume,
    handleConfirmPause,
    handleConfirmDelete,
    handleConfirmBatchDelete,
  }
}
