import { computed, reactive, ref, type Reactive, type Ref } from 'vue'

import { useRouter } from 'vue-router'

import type { CronJobQueryForm } from '@/types/kubernetes/workload/cronjob'

import type { ActionItem } from '@/components/business/BeeActionCell/index.vue'

import type { PageEntity } from '@/types'

import {
  deleteCronJob,
  deleteCronJobs,
  pauseCronJob,
  resumeCronJob,
  triggerCronJob,
} from '@/api/kubernetes/workload/cronjob'

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
  suspend: boolean
}

/**
 * 定时任务行操作与弹框组合式函数
 * @param clusterUid
 * @param permissionMap
 * @param queryForm
 * @param pageData
 * @param fetchCronJobs
 * @param tableRef
 * @param dialogData
 * @param dialogDataList
 */
export function useCronJobAction<T extends dialogData>(
  clusterUid: Ref<string>,
  permissionMap: Record<string, boolean>,
  queryForm: Reactive<Partial<CronJobQueryForm>>,
  pageData: Reactive<PageEntity>,
  fetchCronJobs: () => Promise<void>,
  tableRef: Ref<InstanceType<typeof BeeTable> | undefined>,
  dialogData: Ref<T | undefined>,
  dialogDataList: Ref<T[]>,
) {
  const router = useRouter()

  /** 搜索关键词 */
  const searchKey = ref('')

  const triggerDialogConfig = reactive<DialogConfig>({
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
        { value: 'trigger', label: '手动触发', icon: 'kubernetes-trigger', handler: () => handleTrigger(row) },
      )
      if (row.suspend) {
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
    void fetchCronJobs()
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
    void fetchCronJobs()
  }

  /**
   * 创建定时任务
   */
  function handleCreate() {
    router.push({ name: KubernetesRouteNames.CronJob.Create, params: { clusterUid: clusterUid.value } }).catch(() => {})
  }

  /**
   * 创建定时任务（YAML）
   */
  function handleCreateYaml() {
    router
      .push({ name: KubernetesRouteNames.CronJob.CreateYaml, params: { clusterUid: clusterUid.value } })
      .catch(() => {})
  }

  /**
   * 查看定时任务详情
   * @param row - 当前行数据
   */
  function handleViewDetail(row: T) {
    router
      .push({
        name: KubernetesRouteNames.CronJob.Detail,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 编辑定时任务
   * @param row - 当前行数据
   */
  function handleEdit(row: T) {
    router
      .push({
        name: KubernetesRouteNames.CronJob.Edit,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置定时任务标签
   * @param row - 当前行数据
   */
  function handleLabels(row: T) {
    router
      .push({
        name: KubernetesRouteNames.CronJob.ManageLabels,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置定时任务注解
   * @param row - 当前行数据
   */
  function handleAnnotations(row: T) {
    router
      .push({
        name: KubernetesRouteNames.CronJob.ManageAnnotations,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 手动触发定时任务
   * @param row - 当前行数据
   */
  function handleTrigger(row: T) {
    dialogData.value = row
    triggerDialogConfig.visible = true
  }

  /**
   * 恢复定时任务更新
   * @param row - 当前行数据
   */
  function handleResume(row: T) {
    dialogData.value = row
    resumeDialogConfig.visible = true
  }

  /**
   * 暂停定时任务更新
   * @param row - 当前行数据
   */
  function handlePause(row: T) {
    dialogData.value = row
    pauseDialogConfig.visible = true
  }

  /**
   * 删除定时任务
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
      BeeMessage.warning('选中的定时任务均不可删除')
      return
    }
    batchDeleteDialogConfig.visible = true
  }

  /**
   * 导出 CronJob
   * @remarks 功能开发中
   */
  function handleExport() {
    BeeMessage.info('功能开发中')
  }

  /**
   * 导入 CronJob
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
   * 二次确认手动触发定时任务
   */
  async function handleConfirmTrigger() {
    if (!dialogData.value) {
      triggerDialogConfig.loading = false
      triggerDialogConfig.visible = false
      return
    }
    const { namespace, name } = dialogData.value
    try {
      triggerDialogConfig.loading = true
      await triggerCronJob(clusterUid.value, namespace, name)
      BeeMessage.success(`成功触发定时任务【${name}】`)
      void fetchCronJobs()
    } catch (err) {
      console.error('[handleConfirmTrigger]', err)
      BeeMessage.error(`触发定时任务【${name}】失败`)
    } finally {
      triggerDialogConfig.loading = false
      triggerDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认恢复定时任务更新
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
      await resumeCronJob(clusterUid.value, namespace, name)
      BeeMessage.success(`成功恢复定时任务【${name}】更新`)
      void fetchCronJobs()
    } catch (err) {
      console.error('[handleConfirmResume]', err)
      BeeMessage.error(`恢复定时任务【${name}】更新失败`)
    } finally {
      resumeDialogConfig.loading = false
      resumeDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认暂停定时任务更新
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
      await pauseCronJob(clusterUid.value, namespace, name)
      BeeMessage.success(`成功暂停定时任务【${name}】更新`)
      void fetchCronJobs()
    } catch (err) {
      console.error('[handleConfirmPause]', err)
      BeeMessage.error(`暂停定时任务【${name}】更新失败`)
    } finally {
      pauseDialogConfig.loading = false
      pauseDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认删除定时任务
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
      await deleteCronJob(clusterUid.value, namespace, name)
      BeeMessage.success(`成功删除定时任务【${name}】`)
      void fetchCronJobs()
    } catch (err) {
      console.error('[handleConfirmDelete]', err)
      BeeMessage.error(`删除定时任务【${name}】失败`)
    } finally {
      deleteDialogConfig.loading = false
      deleteDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认批量删除定时任务
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
      await deleteCronJobs(clusterUid.value, uids)
      BeeMessage.success(`成功删除 ${uids.length} 个定时任务`)
      void fetchCronJobs()
    } catch (err) {
      console.error('[handleConfirmBatchDelete]', err)
      BeeMessage.error('批量删除定时任务失败')
    } finally {
      batchDeleteDialogConfig.loading = false
      batchDeleteDialogConfig.visible = false
      dialogDataList.value = []
    }
  }

  return {
    // ==================== Reactive State ====================
    searchKey,
    triggerDialogConfig,
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
    handleConfirmTrigger,
    handleConfirmResume,
    handleConfirmPause,
    handleConfirmDelete,
    handleConfirmBatchDelete,
  }
}
