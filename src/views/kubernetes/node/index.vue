<!--
  NodePage 节点管理列表页

  展示集群下所有节点的运行状态与资源占用（CPU / 内存 / Pod 数），支持按 UID / 名称 / IP 搜索、
  按状态筛选，并提供详情查看、标签 / 注解 / 拓扑配置，以及调度控制（封锁 / 解封 / 排空）。

  集群 UID 取自路由参数 `clusterUid`，缺失时回退到 Pinia 中的激活集群；两者都为空时不发起列表请求。
-->
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
        <BeeTable :data="tableData" :loading="loading">
          <!-- 节点信息列：图标 + UID / IP / 名称（可复制）/ 描述 -->
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <NodeInfoCell
                :description="row.description"
                icon="kubernetes-node"
                :ip="row.ip"
                :name="row.name"
                :uid="row.uid"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn label="状态" :width="180">
            <template #default="{ row }">
              <BeeStatusCell :options="NODE_STATUS_OPTIONS" :status="row.status" :status-msg="row.statusMsg" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn label="CPU" :width="160">
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
          <BeeTableColumn label="内存" :width="160">
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
          <BeeTableColumn label="Pod 数" :width="120">
            <template #default="{ row }">
              <BeeTableCommonCell :label="String(row.resource.usage.pods.value)" sublabel="Pod 数" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn label="Kubelet 版本" :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="row.kubeletVersion" sublabel="Kubelet 版本" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn label="创建信息" :width="200">
            <template #default="{ row }">
              <BeeAuditCell :datetime="row.createAt" field-name="创建人 / 时间" :username="row.createBy" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn label="更新信息" :width="200">
            <template #default="{ row }">
              <BeeAuditCell :datetime="row.updateAt" field-name="更新人 / 时间" :username="row.updateBy" />
            </template>
          </BeeTableColumn>
          <!-- 操作列：依据权限与节点是否被封锁动态生成操作项 -->
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
/**
 * NodePage 节点管理列表页
 * @module views/kubernetes/node
 * @description 列表页容器：负责筛选、分页、行操作及调度控制弹窗，列表数据来自 getNodeList
 */
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { NodeListVo, NodeQueryForm } from '@/types/kubernetes/node'

import { cordonNode, drainNode, getNodeList } from '@/api/kubernetes/node'

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
const kubernetesStore = useKubernetesStore()
/** 当前集群 UID：优先取路由参数，回退到 Pinia 中的激活集群 */
const clusterUid = computed(() => (route.params.clusterUid as string) || kubernetesStore.activeClusterUid || '')

// ==================== Reactive State ====================
// --- 查询条件
/** 搜索关键词，提交时同时映射到 uid / name / ip 三个查询字段 */
const searchKey = ref('')
/** 除搜索外的筛选条件（如状态） */
const queryForm = reactive<Partial<NodeQueryForm>>({})
/** 分页参数，与 BeePagination 双向绑定 */
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
// --- 表格数据
/** 列表加载态 */
const loading = ref(false)
/** 列表数据 */
const tableData = ref<NodeListVo[]>([])
// --- 选中数据
/** 当前操作的行数据，供三个调度弹窗取值 */
const selectedRow = ref<NodeListVo>()
// --- 对话框
/** 封锁弹窗显隐 */
const cordonDialogVisible = ref(false)
/** 解封弹窗显隐 */
const uncordonDialogVisible = ref(false)
/** 排空弹窗显隐 */
const drainDialogVisible = ref(false)

// ==================== Data Loading ====================
/**
 * 加载 Node 列表数据
 * @remarks 根据当前查询条件与分页参数获取 Node 分页数据
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
  } finally {
    loading.value = false
  }
}

// ==================== Search & Reset ====================
/**
 * 搜索
 * @remarks 将 searchKey 同时映射到 uid / name / ip 三个查询字段，并重置页码
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
 * @remarks 清空所有筛选字段、搜索关键词、分页参数，重新加载数据
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

// ==================== Handlers ====================
/**
 * 查看详情
 * @remarks 跳转到节点详情页
 * @param row - 当前行数据
 */
function handleViewDetail(row: NodeListVo) {
  router
    .push({ name: 'kubernetes:node:detail', params: { clusterUid: clusterUid.value, name: row.name } })
    .catch(() => {})
}

/**
 * 配置节点标签
 * @remarks 跳转到标签配置页
 * @param row - 当前行数据
 */
function handleLabel(row: NodeListVo) {
  router
    .push({ name: 'kubernetes:node:edit:labels', params: { clusterUid: clusterUid.value, name: row.name } })
    .catch(() => {})
}

/**
 * 配置节点注解
 * @remarks 跳转到注解配置页
 * @param row - 当前行数据
 */
function handleAnnotation(row: NodeListVo) {
  router
    .push({ name: 'kubernetes:node:edit:annotations', params: { clusterUid: clusterUid.value, name: row.name } })
    .catch(() => {})
}

/**
 * 配置节点拓扑
 * @remarks 跳转到拓扑配置页
 * @param row - 当前行数据
 */
function handleTopology(row: NodeListVo) {
  router
    .push({ name: 'kubernetes:node:edit:topologies', params: { clusterUid: clusterUid.value, name: row.name } })
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

/**
 * 封锁节点确认
 */
async function handleConfirmCordon() {
  if (!selectedRow.value) return
  await cordonNode(clusterUid.value, selectedRow.value.uid, { cordon: true })
  BeeMessage.success('封锁节点完成')
  cordonDialogVisible.value = false
  selectedRow.value = undefined
  void loadData()
}

/**
 * 解封节点确认
 */
async function handleConfirmUncordon() {
  if (!selectedRow.value) return
  await cordonNode(clusterUid.value, selectedRow.value.name, { cordon: false })
  BeeMessage.success('解封节点完成')
  uncordonDialogVisible.value = false
  selectedRow.value = undefined
  void loadData()
}

/**
 * 排空节点确认
 */
async function handleConfirmDrain() {
  if (!selectedRow.value) return
  await drainNode(clusterUid.value, selectedRow.value.uid)
  BeeMessage.success('排空节点完成')
  drainDialogVisible.value = false
  selectedRow.value = undefined
  void loadData()
}

// ==================== Row Actions ====================
/** 页面级权限缓存，避免模板/循环中重复调用 hasPermission */
const perm: Record<string, boolean> = {
  view: hasPermission('kubernetes:node:view'),
  edit: hasPermission('kubernetes:node:edit'),
}

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
