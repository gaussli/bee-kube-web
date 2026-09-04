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
        <BeeSelect
          v-model="queryForm.status"
          clearable
          :options="NODE_STATUS_OPTIONS"
          placeholder="节点状态"
          @change="handleSearch"
        />
        <BeeButton icon="basic-search" @click="handleSearch">搜索</BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset">重置</BeeButton>
      </div>

      <!-- 表格 -->
      <div class="page-body__table">
        <BeeTable :data="tableData" :loading="loading" row-key="uid">
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <BeeNodeInfoCell
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
              <BeeTableCommonCell subtext="Pod 数" :text="row.resource.usage.pods.value" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn label="Kubelet 版本" :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell subtext="Kubelet 版本" :text="row.kubeletVersion" />
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
          <BeeTableColumn fixed="right" label="操作" :width="160">
            <template #default="{ row }">
              <BeeActionCell :actions="getActions(row)" />
            </template>
          </BeeTableColumn>
        </BeeTable>
      </div>

      <!-- 底栏 -->
      <div class="page-body__footer">
        <div class="page-body__footer-actions">
          <BeeButton :icon="'basic-export'" @click="handleExport">导出</BeeButton>
        </div>
        <BeePagination
          v-model="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          @change="loadData"
        />
      </div>
    </BeeCard>

    <!-- 封锁 Dialog -->
    <BeeDialog v-model="cordonDialogVisible" title="封锁节点" @confirm="handleConfirmCordon">
      <p>
        确定要将节点 <strong>{{ currentTargetRow?.name }}</strong> 标记为不可调度（封锁）吗？
      </p>
    </BeeDialog>
    <!-- 解封 Dialog -->
    <BeeDialog v-model="uncordonDialogVisible" title="解封节点" @confirm="handleConfirmUncordon">
      <p>
        确定要将节点 <strong>{{ currentTargetRow?.name }}</strong> 标记为可调度（解封）吗？
      </p>
    </BeeDialog>
    <!-- 排空 Dialog -->
    <BeeDialog v-model="drainDialogVisible" title="排空节点" @confirm="handleConfirmDrain">
      <p>
        确定要排空节点 <strong>{{ currentTargetRow?.name }}</strong> 上的所有 Pod 吗？
      </p>
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
/**
 * Node 管理页面
 * @module views/kubernetes/node
 */
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { NodeListVo, NodeQueryForm } from '@/types/kubernetes/node'

import { cordonNode, drainNode, getNodeList } from '@/api/kubernetes/node'

import { useKubernetesStore } from '@/stores/kubernetes'

import BeeButton from '@/components/base/BeeButton/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeeActionCell, { type ActionItem } from '@/components/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeeNodeInfoCell from '@/components/BeeNodeInfoCell/index.vue'
import BeePage from '@/components/BeePage/index.vue'
import BeePageHeader from '@/components/BeePageHeader/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeResourceUsageCell from '@/components/BeeResourceUsageCell/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'
import BeeStatusCell from '@/components/BeeStatusCell/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'

import { usePermission } from '@/composables/usePermission'
import { NODE_PAGE_META, NODE_STATUS_OPTIONS } from '@/config/kubernetes/node'
import { calcPercentage, toBytesOfQuantity, toMillicoresOfQuantity } from '@/utils'

defineOptions({ name: 'NodePage' })

// ==================== Composables & Route ====================
const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()
const kubernetesStore = useKubernetesStore()
const clusterUid = computed(() => (route.params.clusterUid as string) || kubernetesStore.activeClusterUid || '')

// ==================== Reactive State ====================
// --- 表格数据
const loading = ref(false)
const tableData = ref<NodeListVo[]>([])
// --- 查询条件
const searchKey = ref('')
const queryForm = reactive<Partial<NodeQueryForm>>({})
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
// --- 对话框
const cordonDialogVisible = ref(false)
const uncordonDialogVisible = ref(false)
const drainDialogVisible = ref(false)
const currentTargetRow = ref<NodeListVo>()

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
 * @remarks 将 searchKey 同时映射到 id/name 字段进行搜索匹配，并重置页码
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

// ==================== 页面操作 ====================
/**
 * 查看详情
 * @param row
 */
function handleViewDetail(row: NodeListVo) {
  router
    .push({ name: 'kubernetes:node:detail', params: { clusterUid: clusterUid.value, name: row.name } })
    .catch(() => {})
}

/**
 * 配置节点标签
 * @param row
 */
function handleLabel(row: NodeListVo) {
  router
    .push({ name: 'kubernetes:node:edit:labels', params: { clusterUid: clusterUid.value, name: row.name } })
    .catch(() => {})
}

/**
 * 配置节点注解
 * @param row
 */
function handleAnnotation(row: NodeListVo) {
  router
    .push({ name: 'kubernetes:node:edit:annotations', params: { clusterUid: clusterUid.value, name: row.name } })
    .catch(() => {})
}

/**
 * 配置节点拓扑
 * @param row
 */
function handleTopology(row: NodeListVo) {
  router
    .push({ name: 'kubernetes:node:edit:topologies', params: { clusterUid: clusterUid.value, name: row.name } })
    .catch(() => {})
}

/**
 * 封锁节点
 * @param row
 */
function handleCordon(row: NodeListVo) {
  currentTargetRow.value = row
  cordonDialogVisible.value = true
}

/**
 * 解封节点
 * @param row
 */
function handleUncordon(row: NodeListVo) {
  currentTargetRow.value = row
  uncordonDialogVisible.value = true
}

/**
 * 排空节点
 * @param row
 */
function handleDrain(row: NodeListVo) {
  currentTargetRow.value = row
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
  if (!currentTargetRow.value) return
  await cordonNode(clusterUid.value, currentTargetRow.value.uid, { cordon: true })
  BeeMessage.success('封锁节点完成')
  cordonDialogVisible.value = false
  currentTargetRow.value = undefined
  void loadData()
}

/**
 * 解封节点确认
 */
async function handleConfirmUncordon() {
  if (!currentTargetRow.value) return
  await cordonNode(clusterUid.value, currentTargetRow.value.name, { cordon: false })
  BeeMessage.success('解封节点完成')
  uncordonDialogVisible.value = false
  currentTargetRow.value = undefined
  void loadData()
}

/**
 * 排空节点确认
 */
async function handleConfirmDrain() {
  if (!currentTargetRow.value) return
  await drainNode(clusterUid.value, currentTargetRow.value.uid)
  BeeMessage.success('排空节点完成')
  drainDialogVisible.value = false
  currentTargetRow.value = undefined
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
  gap: $spacing-16;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: $spacing-16;
  overflow: hidden;

  &__toolbar {
    display: flex;
    gap: $spacing-8;
    flex-direction: row;
    align-items: center;

    &-search {
      flex: 1;
      min-width: 0;
    }
  }

  &__table {
    flex: 1;
    min-height: 0;
  }

  &__footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &-actions {
      display: flex;
      gap: $spacing-8;
      flex-direction: row;
      align-items: center;
    }
  }
}
</style>
