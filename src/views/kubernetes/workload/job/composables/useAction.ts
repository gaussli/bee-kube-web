import { computed, reactive, ref, type Reactive, type Ref } from 'vue'

import { useRouter } from 'vue-router'

import type { JobQueryForm } from '@/types/kubernetes/workload/job'

import type { ActionItem } from '@/components/business/BeeActionCell/index.vue'

import type { PageEntity } from '@/types'

import { deleteJob, deleteJobs, pauseJob, rerunJob, resumeJob } from '@/api/kubernetes/workload/job'

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
 * 任务行操作与弹框组合式函数
 * @param clusterUid
 * @param permissionMap
 * @param queryForm
 * @param pageData
 * @param fetchJobs
 * @param tableRef
 * @param dialogData
 * @param dialogDataList
 */
export function useJobAction<T extends dialogData>(
  clusterUid: Ref<string>,
  permissionMap: Record<string, boolean>,
  queryForm: Reactive<Partial<JobQueryForm>>,
  pageData: Reactive<PageEntity>,
  fetchJobs: () => Promise<void>,
  tableRef: Ref<InstanceType<typeof BeeTable> | undefined>,
  dialogData: Ref<T | undefined>,
  dialogDataList: Ref<T[]>,
) {
  const router = useRouter()

  /** 搜索关键词 */
  const searchKey = ref('')

  const rerunDialogConfig = reactive<DialogConfig>({
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
        { value: 'rerun', label: '重跑', icon: 'kubernetes-rerun', handler: () => handleRerun(row) },
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
    void fetchJobs()
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
    void fetchJobs()
  }

  /**
   * 创建任务
   */
  function handleCreate() {
    router.push({ name: KubernetesRouteNames.Job.Create, params: { clusterUid: clusterUid.value } }).catch(() => {})
  }

  /**
   * 创建任务（YAML）
   */
  function handleCreateYaml() {
    router.push({ name: KubernetesRouteNames.Job.CreateYaml, params: { clusterUid: clusterUid.value } }).catch(() => {})
  }

  /**
   * 查看任务详情
   * @param row - 当前行数据
   */
  function handleViewDetail(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Job.Detail,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 编辑任务
   * @param row
   */
  function handleEdit(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Job.Edit,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置任务标签
   * @param row - 当前行数据
   */
  function handleLabels(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Job.ManageLabels,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置任务注解
   * @param row - 当前行数据
   */
  function handleAnnotations(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Job.ManageAnnotations,
        params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 重跑任务
   * @param row - 当前行数据
   */
  function handleRerun(row: T) {
    dialogData.value = row
    rerunDialogConfig.visible = true
  }

  /**
   * 恢复任务更新
   * @param row - 当前行数据
   */
  function handleResume(row: T) {
    dialogData.value = row
    resumeDialogConfig.visible = true
  }

  /**
   * 暂停任务更新
   * @param row - 当前行数据
   */
  function handlePause(row: T) {
    dialogData.value = row
    pauseDialogConfig.visible = true
  }

  /**
   * 删除任务
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
      BeeMessage.warning('选中的任务均不可删除')
      return
    }
    batchDeleteDialogConfig.visible = true
  }

  /**
   * 导出 Job
   * @remarks 功能开发中
   */
  function handleExport() {
    BeeMessage.info('功能开发中')
  }

  /**
   * 导入 Job
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
   * 二次确认重跑任务
   */
  async function handleConfirmRerun() {
    if (!dialogData.value) {
      rerunDialogConfig.loading = false
      rerunDialogConfig.visible = false
      return
    }
    const { namespace, name } = dialogData.value
    try {
      rerunDialogConfig.loading = true
      await rerunJob(clusterUid.value, namespace, name)
      BeeMessage.success(`成功重跑任务【${name}】`)
      void fetchJobs()
    } catch (err) {
      console.error('[handleConfirmRerun]', err)
      BeeMessage.error(`重跑任务【${name}】失败`)
    } finally {
      rerunDialogConfig.loading = false
      rerunDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认恢复任务更新
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
      await resumeJob(clusterUid.value, namespace, name)
      BeeMessage.success(`成功恢复任务【${name}】更新`)
      void fetchJobs()
    } catch (err) {
      console.error('[handleConfirmResume]', err)
      BeeMessage.error(`恢复任务【${name}】更新失败`)
    } finally {
      resumeDialogConfig.loading = false
      resumeDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认暂停任务更新
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
      await pauseJob(clusterUid.value, namespace, name)
      BeeMessage.success(`成功暂停任务【${name}】更新`)
      void fetchJobs()
    } catch (err) {
      console.error('[handleConfirmPause]', err)
      BeeMessage.error(`暂停任务【${name}】更新失败`)
    } finally {
      pauseDialogConfig.loading = false
      pauseDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认删除任务
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
      await deleteJob(clusterUid.value, namespace, name)
      BeeMessage.success(`成功删除任务【${name}】`)
      void fetchJobs()
    } catch (err) {
      console.error('[handleConfirmDelete]', err)
      BeeMessage.error(`删除任务【${name}】失败`)
    } finally {
      deleteDialogConfig.loading = false
      deleteDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认批量删除任务
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
      await deleteJobs(clusterUid.value, uids)
      BeeMessage.success(`成功删除 ${uids.length} 个任务`)
      void fetchJobs()
    } catch (err) {
      console.error('[handleConfirmBatchDelete]', err)
      BeeMessage.error('批量删除任务失败')
    } finally {
      batchDeleteDialogConfig.loading = false
      batchDeleteDialogConfig.visible = false
      dialogDataList.value = []
    }
  }

  return {
    // ==================== Reactive State ====================
    searchKey,
    rerunDialogConfig,
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
    handleConfirmRerun,
    handleConfirmResume,
    handleConfirmPause,
    handleConfirmDelete,
    handleConfirmBatchDelete,
  }
}
