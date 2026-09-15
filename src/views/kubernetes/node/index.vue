<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeePageHeader v-bind="NODE_PAGE_META" />

    <!-- 页面 Body -->
    <BeeCard class="page-body">
      <!-- 工具栏 -->
      <div class="page-body__toolbar">
        <BeeInputSearch
          v-model="searchKey"
          class="page-body__toolbar-search"
          placeholder="按 UID / 名称 / IP 搜索"
          @search="handleSearch"
        />
        <BeeSelect v-model="queryForm.status" :options="NODE_STATUS_OPTIONS" placeholder="节点状态" />
        <BeeButton icon="basic-search" @click="handleSearch">搜索</BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset">重置</BeeButton>
      </div>

      <!-- 表格 -->
      <div class="page-body__table">
        <BeeTable :data="tableData" :loading="loading" selectable>
          <!-- 节点信息列 -->
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <NodeInfoCell :description="row.description" :ip="row.ip" :name="row.name" :uid="row.uid" />
            </template>
          </BeeTableColumn>
          <!-- 状态列 -->
          <BeeTableColumn :width="180">
            <template #default="{ row }">
              <BeeStatusCell :options="NODE_STATUS_OPTIONS" :status="row.status" :status-msg="row.statusMsg" />
            </template>
          </BeeTableColumn>
          <!-- CPU 用量列 -->
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeResourceUsageCell
                field-name="CPU"
                :percentage="
                  calcPercentage(
                    toMillicoresOfQuantity(row.resource.usage.cpu),
                    toMillicoresOfQuantity(row.resource.allocation.cpu),
                  )
                "
              />
            </template>
          </BeeTableColumn>
          <!-- 内存用量列 -->
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeResourceUsageCell
                field-name="内存"
                :percentage="
                  calcPercentage(
                    toBytesOfQuantity(row.resource.usage.memory),
                    toBytesOfQuantity(row.resource.allocation.memory),
                  )
                "
              />
            </template>
          </BeeTableColumn>
          <!-- Pod 数列 -->
          <BeeTableColumn :width="120">
            <template #default="{ row }">
              <BeeTableCommonCell :label="String(row.resource.usage.pods.value)" sublabel="Pod 数" />
            </template>
          </BeeTableColumn>
          <!-- Kubelet 版本列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="row.kubeletVersion" sublabel="Kubelet 版本" />
            </template>
          </BeeTableColumn>
          <!-- 创建信息列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAuditCell :datetime="row.createAt" field-name="创建人 / 时间" :username="row.createBy" />
            </template>
          </BeeTableColumn>
          <!-- 更新信息列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAuditCell :datetime="row.updateAt" field-name="更新人 / 时间" :username="row.updateBy" />
            </template>
          </BeeTableColumn>
          <!-- 操作列 -->
          <BeeTableColumn fixed="right" :width="136">
            <template #default="{ row }">
              <BeeActionCell :actions="getActions(row)" />
            </template>
          </BeeTableColumn>
        </BeeTable>
      </div>

      <!-- 底栏 -->
      <div class="page-body__footer">
        <div class="page-body__footer-actions">
          <BeeButton v-if="perm.view" :icon="'basic-export'" @click="handleExport">导出</BeeButton>
        </div>
        <BeePagination
          v-model:page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          @change="loadData"
        />
      </div>
    </BeeCard>

    <!-- 单个封锁 Dialog -->
    <BeeDialog
      v-model="cordonDialogVisible"
      icon="kubernetes-cordon"
      title="封锁节点"
      type="primary"
      @confirm="handleConfirmCordon"
    >
      <span>
        您确认要将节点 <strong>{{ selectedRow?.name || '' }}</strong> 标记为不可调度（封锁）吗？
      </span>
    </BeeDialog>

    <!-- 单个解封 Dialog -->
    <BeeDialog
      v-model="uncordonDialogVisible"
      icon="kubernetes-uncordon"
      title="解封节点"
      type="primary"
      @confirm="handleConfirmUncordon"
    >
      <span>
        您确认要将节点 <strong>{{ selectedRow?.name || '' }}</strong> 标记为可调度（解封）吗？
      </span>
    </BeeDialog>

    <!-- 单个排空 Dialog -->
    <BeeDialog
      v-model="drainDialogVisible"
      icon="kubernetes-drain"
      title="排空节点"
      type="primary"
      @confirm="handleConfirmDrain"
    >
      <span>
        您确认要排空节点 <strong>{{ selectedRow?.name || '' }}</strong> 上的所有 Pod 吗？
      </span>
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { NodeListVo, NodeQueryForm } from '@/types/kubernetes/node'

import { cordonNode, drainNode, getNodeList } from '@/api/kubernetes/node'

import { KubernetesRouteNames } from '@/router/names.ts'

import { useKubernetesStore } from '@/stores/kubernetes'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeDialog from '@/components/base/BeeDialog/index.vue'
import BeeInputSearch from '@/components/base/BeeInputSearch/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeeSelect from '@/components/base/BeeSelect/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeResourceUsageCell from '@/components/BeeResourceUsageCell/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeActionCell, { type ActionItem } from '@/components/business/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/business/BeeAuditCell/index.vue'
import BeePageHeader from '@/components/business/BeePageHeader/index.vue'
import BeeStatusCell from '@/components/business/BeeStatusCell/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { usePermission } from '@/composables/usePermission'
import { NODE_PAGE_META, NODE_STATUS_OPTIONS } from '@/config/kubernetes/node'
import { calcPercentage, toBytesOfQuantity, toMillicoresOfQuantity } from '@/utils'

import NodeInfoCell from './components/NodeInfoCell.vue'

defineOptions({ name: 'NodePage' })

// ==================== Composables & Route & Store ====================
const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()

// ==================== Reactive State ====================
// ---------- 查询条件 ----------
/** 搜索关键词 */
const searchKey = ref('')
/** 查询条件 */
const queryForm = reactive<Partial<NodeQueryForm>>({})
/** 分页条件请求 / 响应 */
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
// ---------- 表格数据 ----------
/** 列表加载态 */
const loading = ref(false)
/** 列表数据 */
const tableData = ref<NodeListVo[]>([])
// ---------- 选中数据 ----------
/** 当前行数据 */
const selectedRow = ref<NodeListVo>()
// ---------- 对话框 ----------
/** 封锁弹框显隐 */
const cordonDialogVisible = ref(false)
/** 解封弹框显隐 */
const uncordonDialogVisible = ref(false)
/** 排空弹框显隐 */
const drainDialogVisible = ref(false)

// ==================== Computed ====================
/** 当前集群 UID */
const clusterUid = computed(() => (route.params.clusterUid as string) || useKubernetesStore().activeClusterUid || '')

// ==================== Permission ====================
/** 页面级权限缓存，避免模板/循环中重复调用 hasPermission */
const perm: Record<string, boolean> = {
  view: hasPermission('kubernetes:node:view'),
  edit: hasPermission('kubernetes:node:edit'),
}

// ==================== Row Actions Generate ====================
/**
 * 构建行操作数组
 * @param row - 当前行数据
 * @returns 操作项数组
 */
function getActions(row: NodeListVo): ActionItem[] {
  const actions: ActionItem[] = []
  if (perm.view) {
    actions.push({ value: 'view', label: '详情', icon: 'basic-view', handler: () => handleViewDetail(row) })
  }
  if (perm.edit) {
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
      actions.push({ value: 'cordon', label: '封锁节点', icon: 'kubernetes-cordon', handler: () => handleCordon(row) })
    }
    actions.push({ value: 'drain', label: '排空节点', icon: 'kubernetes-drain', handler: () => handleDrain(row) })
  }
  return actions
}

// ==================== Data Loading ====================
/**
 * 请求节点列表数据
 */
async function loadData() {
  if (!clusterUid.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const { list, total } = await getNodeList(clusterUid.value, {
      ...queryForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = list
    pagination.total = total
  } catch (err) {
    console.error('[loadData]', err)
    BeeMessage.error('加载节点列表失败')
  } finally {
    loading.value = false
  }
}

// ==================== Handler ====================
/**
 * 搜索
 */
function handleSearch() {
  queryForm.uid = searchKey.value || undefined
  queryForm.name = searchKey.value || undefined
  queryForm.ip = searchKey.value || undefined
  pagination.page = 1
  void loadData()
}

/**
 * 重置搜索条件
 */
function handleReset() {
  queryForm.uid = undefined
  queryForm.name = undefined
  queryForm.ip = undefined
  queryForm.status = undefined
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  void loadData()
}

/**
 * 查看节点详情
 * @param row - 当前行数据
 */
function handleViewDetail(row: NodeListVo) {
  router
    .push({ name: KubernetesRouteNames.Node.Detail, params: { clusterUid: clusterUid.value, name: row.name } })
    .catch(() => {})
}

/**
 * 配置节点标签
 * @param row - 当前行数据
 */
function handleLabel(row: NodeListVo) {
  router
    .push({ name: KubernetesRouteNames.Node.ManageLabels, params: { clusterUid: clusterUid.value, name: row.name } })
    .catch(() => {})
}

/**
 * 配置节点注解
 * @param row - 当前行数据
 */
function handleAnnotation(row: NodeListVo) {
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
function handleTopology(row: NodeListVo) {
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
function handleCordon(row: NodeListVo) {
  selectedRow.value = row
  cordonDialogVisible.value = true
}

/**
 * 解封节点
 * @param row - 当前行数据
 */
function handleUncordon(row: NodeListVo) {
  selectedRow.value = row
  uncordonDialogVisible.value = true
}

/**
 * 排空节点
 * @param row - 当前行数据
 */
function handleDrain(row: NodeListVo) {
  selectedRow.value = row
  drainDialogVisible.value = true
}

/**
 * 导出节点
 */
function handleExport() {
  BeeMessage.info('正在导出节点数据...')
}

// ==================== Dialog Confirm ====================
/**
 * 二次确认封锁节点
 */
async function handleConfirmCordon() {
  if (!selectedRow.value) return
  const { name } = selectedRow.value
  try {
    await cordonNode(clusterUid.value, name, { cordon: true })
    BeeMessage.success(`成功封锁节点【${name}】`)
    selectedRow.value = undefined
    void loadData()
  } catch (err) {
    console.error('[handleConfirmCordon]', err)
    BeeMessage.error(`封锁节点【${name}】失败`)
  }
}

/**
 * 二次确认解封节点
 */
async function handleConfirmUncordon() {
  if (!selectedRow.value) return
  const { name } = selectedRow.value
  try {
    await cordonNode(clusterUid.value, name, { cordon: false })
    BeeMessage.success(`成功解封节点【${name}】`)
    uncordonDialogVisible.value = false
    selectedRow.value = undefined
    void loadData()
  } catch (err) {
    console.error('[handleConfirmUncordon]', err)
    BeeMessage.error(`解封节点【${name}】失败`)
  }
}

/**
 * 二次确认排空节点
 */
async function handleConfirmDrain() {
  if (!selectedRow.value) return
  const { name } = selectedRow.value
  try {
    await drainNode(clusterUid.value, name)
    BeeMessage.success(`成功排空节点【${name}】`)
    drainDialogVisible.value = false
    selectedRow.value = undefined
    void loadData()
  } catch (err) {
    console.error('[handleConfirmDrain]', err)
    BeeMessage.error(`排空节点【${name}】失败`)
  }
}

// ==================== Lifecycle ====================
onMounted(() => {
  void loadData()
})
</script>

<style lang="scss" scoped>
.page-body {
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow: hidden;

  &__toolbar {
    display: flex;
    gap: 8px;
    flex-flow: row wrap;
    align-items: center;

    &-search {
      flex: 1;
      min-width: 100px;
    }
  }

  &__table {
    flex: 1;
    min-height: 0;
  }

  &__footer {
    display: flex;
    gap: 8px;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;

    &-actions {
      display: flex;
      gap: 8px;
      flex-flow: row wrap;
      align-items: center;
    }
  }
}
</style>
