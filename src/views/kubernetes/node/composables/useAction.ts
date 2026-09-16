import { reactive, ref, type Reactive, type Ref } from 'vue'

import { useRouter } from 'vue-router'

import type { NodeQueryForm } from '@/types/kubernetes/node'

import type { ActionItem } from '@/components/business/BeeActionCell/index.vue'

import type { PageEntity } from '@/types'

import { cordonNode, drainNode } from '@/api/kubernetes/node'

import { KubernetesRouteNames } from '@/router/names'

import { BeeMessage } from '@/components/base/BeeMessage'

type DialogConfig = {
  visible: boolean
  loading: boolean
}

type dialogData = {
  uid: string
  name: string
  unschedulable: boolean
}

/**
 * 节点行操作与弹框组合式函数
 * @param clusterUid
 * @param permissionMap
 * @param queryForm
 * @param pageData
 * @param fetchNodes
 * @param dialogData
 */
export function useNodeAction<T extends dialogData>(
  clusterUid: Ref<string>,
  permissionMap: Record<string, boolean>,
  queryForm: Reactive<Partial<NodeQueryForm>>,
  pageData: Reactive<PageEntity>,
  fetchNodes: () => Promise<void>,
  dialogData: Ref<T | undefined>,
) {
  const router = useRouter()

  /** 搜索关键词 */
  const searchKey = ref('')

  /** 封锁弹框配置 */
  const cordonDialogConfig = reactive<DialogConfig>({
    visible: false,
    loading: false,
  })

  /** 解封弹框配置 */
  const uncordonDialogConfig = reactive<DialogConfig>({
    visible: false,
    loading: false,
  })

  /** 排空弹框配置 */
  const drainDialogConfig = reactive<DialogConfig>({
    visible: false,
    loading: false,
  })

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
        { value: 'label', label: '配置标签', icon: 'kubernetes-label', handler: () => handleLabel(row) },
        { value: 'annotation', label: '配置注解', icon: 'kubernetes-annotation', handler: () => handleAnnotation(row) },
        { value: 'topology', label: '配置拓扑', icon: 'kubernetes-topology', handler: () => handleTopology(row) },
      )
      if (row.unschedulable) {
        actions.push({
          value: 'uncordon',
          label: '解封节点',
          icon: 'kubernetes-uncordon',
          handler: () => handleUncordon(row),
        })
      } else {
        actions.push({
          value: 'cordon',
          label: '封锁节点',
          icon: 'kubernetes-cordon',
          handler: () => handleCordon(row),
        })
      }
      actions.push({ value: 'drain', label: '排空节点', icon: 'kubernetes-drain', handler: () => handleDrain(row) })
    }
    return actions
  }

  /**
   * 搜索
   */
  function handleSearch() {
    queryForm.uid = searchKey.value
    queryForm.name = searchKey.value
    queryForm.ip = searchKey.value
    pageData.page = 1
    void fetchNodes()
  }

  /**
   * 重置搜索条件
   */
  function handleReset() {
    queryForm.uid = undefined
    queryForm.name = undefined
    queryForm.ip = undefined
    queryForm.status = undefined
    pageData.page = 1
    pageData.pageSize = 10
    searchKey.value = ''
    void fetchNodes()
  }

  /**
   * 查看节点详情
   * @param row - 当前行数据
   */
  function handleViewDetail(row: T) {
    router
      .push({ name: KubernetesRouteNames.Node.Detail, params: { clusterUid: clusterUid.value, name: row.name } })
      .catch(() => {})
  }

  /**
   * 配置节点标签
   * @param row - 当前行数据
   */
  function handleLabel(row: T) {
    router
      .push({ name: KubernetesRouteNames.Node.ManageLabels, params: { clusterUid: clusterUid.value, name: row.name } })
      .catch(() => {})
  }

  /**
   * 配置节点注解
   * @param row - 当前行数据
   */
  function handleAnnotation(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Node.ManageAnnotations,
        params: { clusterUid: clusterUid.value, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 配置节点拓扑
   * @param row - 当前行数据
   */
  function handleTopology(row: T) {
    router
      .push({
        name: KubernetesRouteNames.Node.ManageTopologies,
        params: { clusterUid: clusterUid.value, name: row.name },
      })
      .catch(() => {})
  }

  /**
   * 封锁节点
   * @param row - 当前行数据
   */
  function handleCordon(row: T) {
    dialogData.value = row
    cordonDialogConfig.visible = true
  }

  /**
   * 解封节点
   * @param row - 当前行数据
   */
  function handleUncordon(row: T) {
    dialogData.value = row
    uncordonDialogConfig.visible = true
  }

  /**
   * 排空节点
   * @param row - 当前行数据
   */
  function handleDrain(row: T) {
    dialogData.value = row
    drainDialogConfig.visible = true
  }

  /**
   * 导出节点
   * @remarks 功能开发中
   */
  function handleExport() {
    BeeMessage.info('功能开发中')
  }

  /**
   * 二次确认封锁节点
   */
  async function handleConfirmCordon() {
    if (!dialogData.value) {
      cordonDialogConfig.loading = false
      cordonDialogConfig.visible = false
      return
    }
    const { name } = dialogData.value
    try {
      cordonDialogConfig.loading = true
      await cordonNode(clusterUid.value, name, { cordon: true })
      BeeMessage.success(`成功封锁节点【${name}】`)
      void fetchNodes()
    } catch (err) {
      console.error('[handleConfirmCordon]', err)
      BeeMessage.error(`封锁节点【${name}】失败`)
    } finally {
      cordonDialogConfig.loading = false
      cordonDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认解封节点
   */
  async function handleConfirmUncordon() {
    if (!dialogData.value) {
      uncordonDialogConfig.loading = false
      uncordonDialogConfig.visible = false
      return
    }
    const { name } = dialogData.value
    try {
      uncordonDialogConfig.loading = true
      await cordonNode(clusterUid.value, name, { cordon: false })
      BeeMessage.success(`成功解封节点【${name}】`)
      void fetchNodes()
    } catch (err) {
      console.error('[handleConfirmUncordon]', err)
      BeeMessage.error(`解封节点【${name}】失败`)
    } finally {
      uncordonDialogConfig.loading = false
      uncordonDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  /**
   * 二次确认排空节点
   */
  async function handleConfirmDrain() {
    if (!dialogData.value) {
      drainDialogConfig.loading = false
      drainDialogConfig.visible = false
      return
    }
    const { name } = dialogData.value
    try {
      drainDialogConfig.loading = true
      await drainNode(clusterUid.value, name)
      BeeMessage.success(`成功排空节点【${name}】`)
      void fetchNodes()
    } catch (err) {
      console.error('[handleConfirmDrain]', err)
      BeeMessage.error(`排空节点【${name}】失败`)
    } finally {
      drainDialogConfig.loading = false
      drainDialogConfig.visible = false
      dialogData.value = undefined
    }
  }

  return {
    // ==================== Reactive State ====================
    searchKey,
    cordonDialogConfig,
    uncordonDialogConfig,
    drainDialogConfig,
    // ==================== Row Action Generator ====================
    getActions,
    // ==================== Handler ====================
    handleSearch,
    handleReset,
    handleExport,
    // ==================== Dialog Confirm Handler ====================
    handleConfirmCordon,
    handleConfirmUncordon,
    handleConfirmDrain,
  }
}
