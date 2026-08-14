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
          placeholder="按 UID / 名称搜索"
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
        <BeeButton icon="basic-reset" @click="handleReset">重置</BeeButton>
      </div>
      <!-- 表格 -->
      <div class="page-body__table">
        <BeeTable
          ref="tableRef"
          :data="tableData"
          :loading="loading"
          row-key="uid"
          selectable
          @selection-change="handleSelectionChange"
        >
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
                :percentage="calcPercentage(row.resource.usage.cpu, row.resource.allocation.cpu)"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn label="内存" :width="160">
            <template #default="{ row }">
              <BeeResourceUsageCell
                field-name="内存"
                :percentage="calcPercentage(row.resource.usage.memory, row.resource.allocation.memory)"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn label="Pod 数" :width="120">
            <template #default="{ row }">
              <BeeTableCommonCell subtext="运行 Pod" :text="String(row.podCount)" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn label="Kubelet 版本" :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :text="row.kubeletVersion" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn label="创建信息" :width="200">
            <template #default="{ row }">
              <BeeAuditCell :datetime="row.createAt" field-name="创建人 / 时间" :username="row.createBy" />
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
          <BeeButton v-if="selectedRows.length" text @click="handleClearSelection">取消选择</BeeButton>
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

    <!-- 隔离 Dialog -->
    <BeeDialog v-model="cordonDialogVisible" title="隔离节点" @confirm="handleConfirmCordon">
      <p>
        确定要将节点 <strong>{{ currentTargetRow?.name }}</strong> 标记为不可调度（隔离）吗？
      </p>
    </BeeDialog>
    <!-- 恢复 Dialog -->
    <BeeDialog v-model="uncordonDialogVisible" title="恢复节点" @confirm="handleConfirmUncordon">
      <p>
        确定要恢复节点 <strong>{{ currentTargetRow?.name }}</strong> 为可调度状态吗？
      </p>
    </BeeDialog>
    <!-- 驱逐 Dialog -->
    <BeeDialog v-model="drainDialogVisible" title="驱逐节点" @confirm="handleConfirmDrain">
      <p>
        确定要驱逐节点 <strong>{{ currentTargetRow?.name }}</strong> 上的所有 Pod 吗？
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

import type { NodeListResp, NodeQueryForm } from '@/types/kubernetes/node'

import { cordonNode, drainNode, getNodeList } from '@/api/kubernetes/node'

import { useKubernetesStore } from '@/stores/kubernetes'

import BeeActionCell, { type ActionItem } from '@/components/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import { BeeMessage } from '@/components/BeeMessage'
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
const tableData = ref<NodeListResp[]>([])
const tableRef = ref<InstanceType<typeof BeeTable>>()
// --- 查询条件
const searchKey = ref('')
const queryForm = reactive<Partial<NodeQueryForm>>({})
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
// --- 选中逻辑
const selectedRows = ref<NodeListResp[]>([])
// --- 对话框
const cordonDialogVisible = ref(false)
const uncordonDialogVisible = ref(false)
const drainDialogVisible = ref(false)
const currentTargetRow = ref<NodeListResp>()

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
  queryForm.id = searchKey.value || undefined
  queryForm.name = searchKey.value || undefined
  pagination.page = 1
  void loadData()
}

/**
 * 重置搜索条件
 * @remarks 清空所有筛选字段、搜索关键词、分页参数，重新加载数据
 */
function handleReset() {
  queryForm.id = undefined
  queryForm.name = undefined
  queryForm.status = undefined
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  void loadData()
}

// ==================== Selection ====================
/**
 * 表格选中行变化
 * @param rows
 * @remarks BeeTable 的 selection-change 事件固定返回 Record<string, unknown>[]，需通过 unknown 桥接断言为目标类型
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as NodeListResp[]
}

/** 取消全部选中 */
function handleClearSelection() {
  tableRef.value?.clearSelection()
}

// ==================== CRUD ====================
/**
 * 查看详情
 * @param row
 */
function handleViewDetail(row: NodeListResp) {
  router
    .push({ name: 'kubernetes:node:detail', params: { clusterUid: clusterUid.value, uid: row.uid } })
    .catch(() => {})
}

/**
 * 编辑节点
 * @param row
 */
function handleEdit(row: NodeListResp) {
  router.push({ name: 'kubernetes:node:edit', params: { clusterUid: clusterUid.value, uid: row.uid } }).catch(() => {})
}

/**
 * 编辑 YAML
 * @param row
 */
function handleEditYaml(row: NodeListResp) {
  router
    .push({ name: 'kubernetes:node:edit:yaml', params: { clusterUid: clusterUid.value, uid: row.uid } })
    .catch(() => {})
}

/**
 * 隔离节点
 * @param row
 */
function handleCordon(row: NodeListResp) {
  currentTargetRow.value = row
  cordonDialogVisible.value = true
}

/**
 * 隔离确认
 */
async function handleConfirmCordon() {
  if (!currentTargetRow.value) return
  await cordonNode(clusterUid.value, currentTargetRow.value.uid, { cordon: true })
  BeeMessage.success('节点已隔离')
  cordonDialogVisible.value = false
  currentTargetRow.value = undefined
  void loadData()
}

/**
 * 恢复节点调度
 * @param row
 * @remarks 复用 cordon 接口，cordon=false 即恢复
 */
function handleUncordon(row: NodeListResp) {
  currentTargetRow.value = row
  uncordonDialogVisible.value = true
}

/**
 * 恢复确认
 */
async function handleConfirmUncordon() {
  if (!currentTargetRow.value) return
  await cordonNode(clusterUid.value, currentTargetRow.value.uid, { cordon: false })
  BeeMessage.success('节点已恢复调度')
  uncordonDialogVisible.value = false
  currentTargetRow.value = undefined
  void loadData()
}

/**
 * 驱逐节点
 * @param row
 */
function handleDrain(row: NodeListResp) {
  currentTargetRow.value = row
  drainDialogVisible.value = true
}

/**
 * 驱逐确认
 */
async function handleConfirmDrain() {
  if (!currentTargetRow.value) return
  await drainNode(clusterUid.value, currentTargetRow.value.uid)
  BeeMessage.success('节点驱逐完成')
  drainDialogVisible.value = false
  currentTargetRow.value = undefined
  void loadData()
}

// ==================== Other Actions ====================
/**
 * 计算资源使用百分比
 * @param used - 已使用量
 * @param total - 总量
 * @returns 百分比（0-100，总量为 0 时返回 0）
 */
function calcPercentage(used: number | string, total: number | string): number {
  const usedNum = typeof used === 'string' ? parseToNumber(used) : used
  const totalNum = typeof total === 'string' ? parseToNumber(total) : total
  if (!totalNum) return 0
  return Math.min(100, Math.round((usedNum / totalNum) * 100))
}

/**
 * 解析带单位的资源数值（支持 m/Ki/Mi/Gi 后缀）
 * @param value - 资源字符串
 * @returns 数值
 */
function parseToNumber(value: string): number {
  if (value.endsWith('m')) return parseInt(value) / 1000
  if (value.endsWith('Ki')) return parseInt(value) / 1024
  if (value.endsWith('Mi')) return parseInt(value) / 1024 / 1024
  if (value.endsWith('Gi')) return parseInt(value) / 1024 / 1024 / 1024
  return parseFloat(value) || 0
}

/**
 * 导出 Node
 * @remarks 功能开发中
 */
function handleExport() {
  BeeMessage.info('正在导出节点数据...')
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
 * @remarks Node 无删除功能，因此不含 delete 操作
 */
function getActions(row: NodeListResp): ActionItem[] {
  const actions: ActionItem[] = []
  if (perm.view) {
    actions.push({ value: 'view', label: '详情', icon: 'basic-view', handler: () => handleViewDetail(row) })
  }
  if (perm.edit) {
    actions.push(
      { value: 'edit', label: '编辑', icon: 'basic-edit', handler: () => handleEdit(row) },
      { value: 'yamledit', label: '编辑 YAML', icon: 'basic-yaml', handler: () => handleEditYaml(row) },
      { value: 'cordon', label: '隔离', icon: 'kubernetes-cordon', handler: () => handleCordon(row) },
      { value: 'uncordon', label: '恢复', icon: 'kubernetes-uncordon', handler: () => handleUncordon(row) },
      { value: 'drain', label: '驱逐', icon: 'kubernetes-drain', handler: () => handleDrain(row) },
    )
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
