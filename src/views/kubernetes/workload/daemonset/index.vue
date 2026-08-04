<template>
  <BeePage class="daemonset-page">
    <!-- 页面标题 -->
    <BeeCard class="daemonset-page__header">
      <BeePageTitle
        icon="kubernetes-namespace"
        title="守护应用"
        description="守护应用（DaemonSet）是 Kubernetes 中用于确保每个节点运行一个 Pod 副本的控制器，常用于日志采集、监控代理、存储驱动等节点级守护服务。"
      />
    </BeeCard>

    <!-- 页面内容 -->
    <BeeCard class="daemonset-page__body">
      <!-- 查询表单 -->
      <div class="table-toolbar">
        <BeeInputSearch v-model="searchKey" placeholder="按 ID / 名称搜索" class="table-toolbar__search" />
        <BeeSelect
          v-model="queryForm.namespace"
          placeholder="命名空间筛选"
          :options="namespaceOptions"
          :width="300"
          :menu-height="300"
        />
        <BeeSelect v-model="queryForm.status" placeholder="状态筛选" :options="DAEMONSET_STATUS_OPTIONS" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <BeeButton
          v-if="hasPermission('kubernetes:workload:daemonset:create')"
          type="primary"
          icon="basic-create"
          @click="handleCreate"
        >
          新增
        </BeeButton>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <BeeTable :data="tableData" :loading="loading" selectable @selection-change="handleSelectionChange">
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <BeeWorkloadInfoCell
                :uid="row.uid"
                :name="row.name"
                :description="row.description"
                :icon-size="32"
                icon="kubernetes-namespace"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :text="row.namespace" subtext="命名空间" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeStatusCell :status="row.status" :status-msg="row.statusMessage" :options="DAEMONSET_STATUS_OPTIONS" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeTableCommonCell
                :text="`${row.numberReady} / ${row.desiredNumberScheduled}`"
                subtext="就绪 / 期望节点"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeTableCommonCell :text="row.updateStrategy" :subtext="updateStrategyLabel(row.updateStrategy)" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAuditCell :username="row.createBy" :datetime="row.createAt" field-name="创建人 / 时间" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAuditCell :username="row.updateBy" :datetime="row.updateAt" field-name="更新人 / 时间" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="150" fixed="right">
            <template #default="{ row }">
              <BeeActionCell :actions="getActions(row)" />
            </template>
          </BeeTableColumn>
        </BeeTable>
      </div>

      <!-- 表格底部 -->
      <div class="table-footer">
        <div>
          <BeeButton
            v-if="hasPermission('kubernetes:workload:daemonset:delete')"
            type="danger"
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            批量删除 ({{ selectedRows.length }})
          </BeeButton>
        </div>
        <BeePagination
          v-model="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          @change="loadData"
        />
      </div>
    </BeeCard>

    <!-- 单个删除 Dialog -->
    <BeeDialog v-model="deleteDialogVisible" title="确认删除" @confirm="handleConfirmDelete">
      <div class="dialog-content">
        <p>
          确定要删除 DaemonSet <strong>{{ currentTargetRow?.name }}</strong> 吗？
        </p>
      </div>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
      <div class="dialog-content">
        <p>
          确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个 DaemonSet 吗？
        </p>
        <div class="delete-daemonset-tags">
          <BeeTag v-for="row in selectedRows" :key="row.id">
            {{ row.name }}
          </BeeTag>
        </div>
      </div>
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
/**
 * DaemonSet 管理页面
 * @module views/kubernetes/workload/daemonset
 */
import { onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { ElMessage } from 'element-plus'

import type { NamespaceSimpleListResp } from '@/types/kubernetes/namespace'
import type {
  DaemonSetQueryReq,
  DaemonSetListResp,
  DaemonSetUpdateStrategyType,
} from '@/types/kubernetes/workload/daemonset'

import type { ActionItem } from '@/components/BeeActionCell/index.vue'

import { getNamespacePage } from '@/api/kubernetes/namespace'
import { getDaemonSetList, deleteDaemonSet, deleteDaemonSets } from '@/api/kubernetes/workload/daemonset'

import BeeActionCell from '@/components/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeePage from '@/components/BeePage/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'
import BeeStatusCell from '@/components/BeeStatusCell/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import BeeWorkloadInfoCell from '@/components/BeeWorkloadInfoCell/index.vue'

import { usePermission } from '@/composables/usePermission'
import { DAEMONSET_STATUS_OPTIONS } from '@/config/kubernetes'

defineOptions({ name: 'DaemonSetManage' })

// ==================== Composables & Route ====================

const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()

// ==================== Reactive State ====================

const clusterId = ref(route.params.clusterId as string)
const searchKey = ref('')
const loading = ref(false)
const tableData = ref<DaemonSetListResp[]>([])
const selectedRows = ref<DaemonSetListResp[]>([])
const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const currentTargetRow = ref<DaemonSetListResp | null>(null)

const queryForm = reactive<Partial<DaemonSetQueryReq>>({})
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

// ==================== Options ====================

/** 命名空间选项 */
const namespaceOptions = ref<{ label: string; value: string | undefined }[]>([
  { label: '全部命名空间', value: undefined },
])

/** 更新策略中文映射 */
const UPDATE_STRATEGY_LABEL: Record<DaemonSetUpdateStrategyType, string> = {
  RollingUpdate: '滚动更新',
  OnDelete: '手动删除',
}

/**
 * 获取更新策略中文名称
 * @param type - 更新策略枚举值
 * @returns 中文名称
 */
function updateStrategyLabel(type: DaemonSetUpdateStrategyType): string {
  return UPDATE_STRATEGY_LABEL[type] || type
}

// ==================== Data Loading ====================

/**
 * 加载命名空间选项
 * @remarks 通过 getNamespacePage mode=simple 获取简化列表，转换后填充下拉选项
 */
async function loadNamespaceOptions() {
  if (!clusterId.value) return
  try {
    const namespaces = (await getNamespacePage(clusterId.value, { mode: 'simple' })) as NamespaceSimpleListResp[]
    namespaceOptions.value = [
      { label: '全部命名空间', value: undefined },
      ...namespaces.map(ns => ({ label: ns.name, value: ns.name })),
    ]
  } catch {
    // 加载失败时保留默认选项
  }
}

/**
 * 加载 DaemonSet 列表数据
 * @remarks 根据当前查询条件与分页参数获取 DaemonSet 分页数据
 */
async function loadData() {
  if (!clusterId.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getDaemonSetList(clusterId.value, {
      ...queryForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

// ==================== Search & Reset ====================

/**
 * 搜索
 * @remarks 将 searchKey 同时映射到 id/name 字段进行模糊匹配
 */
function handleSearch() {
  queryForm.id = searchKey.value
  queryForm.name = searchKey.value
  pagination.page = 1
  void loadData()
}

/**
 * 重置搜索条件
 */
function handleReset() {
  queryForm.id = undefined
  queryForm.name = undefined
  queryForm.namespace = undefined
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
  selectedRows.value = rows as unknown as DaemonSetListResp[]
}

// ==================== CRUD: Create / Edit / View ====================

/** 跳转创建页面 */
function handleCreate() {
  router.push({ name: 'kubernetes:workload:daemonset:create', params: { clusterId: clusterId.value } }).catch(() => {})
}

/**
 * 跳转编辑页面
 * @param row
 */
function handleEdit(row: DaemonSetListResp) {
  router
    .push({
      name: 'kubernetes:workload:daemonset:edit',
      params: { clusterId: row.clusterId },
      query: { namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 跳转详情页面
 * @param row
 */
function handleViewDetail(row: DaemonSetListResp) {
  router
    .push({
      name: 'kubernetes:workload:daemonset:detail',
      params: { clusterId: row.clusterId },
      query: { namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 重启
 * @param row
 */
function handleRestart(row: DaemonSetListResp) {
  ElMessage.info(`重启: ${row.name}`)
}

/**
 * 编辑 YAML
 * @param row
 */
function handleEditYaml(row: DaemonSetListResp) {
  ElMessage.info(`编辑 YAML: ${row.name}`)
}

// ==================== CRUD: Delete ====================

/**
 * 打开删除确认弹窗
 * @param row
 */
function handleDelete(row: DaemonSetListResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

/** 确认单个删除 */
async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteDaemonSet(
      currentTargetRow.value.clusterId,
      currentTargetRow.value.namespace,
      currentTargetRow.value.name,
    )
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
    currentTargetRow.value = null
    await loadData()
  } catch (err) {
    console.error('[handleConfirmDelete]', err)
  }
}

/** 打开批量删除确认弹窗 */
function handleBatchDelete() {
  batchDeleteDialogVisible.value = true
}

/** 确认批量删除 */
async function handleConfirmBatchDelete() {
  if (selectedRows.value.length === 0) return
  const targetClusterId = selectedRows.value[0].clusterId
  const targetNamespace = selectedRows.value[0].namespace
  const names = selectedRows.value.map(row => row.name)
  try {
    await deleteDaemonSets(targetClusterId, targetNamespace, names)
    ElMessage.success(`成功删除 ${names.length} 个 DaemonSet`)
    batchDeleteDialogVisible.value = false
    selectedRows.value = []
    await loadData()
  } catch (err) {
    console.error('[handleConfirmBatchDelete]', err)
  }
}

// ==================== Row Actions ====================

/** 页面级权限缓存，避免每个 row 都重复调用 hasPermission */
const perm: Record<string, boolean> = {
  edit: hasPermission('kubernetes:workload:daemonset:edit'),
  view: hasPermission('kubernetes:workload:daemonset:view'),
  delete: hasPermission('kubernetes:workload:daemonset:delete'),
}

/**
 * 构建行操作数组
 * @param row - 当前行数据
 * @returns 操作项数组
 * @remarks 按权限和 row.deletable 条件过滤，由调用方负责
 */
function getActions(row: DaemonSetListResp): ActionItem[] {
  const actions: ActionItem[] = []
  // 查看权限
  if (perm.view) {
    actions.push({ value: 'view', label: '详情', icon: 'basic-view', handler: () => handleViewDetail(row) })
  }
  // 编辑权限：编辑、重启、编辑 YAML
  if (perm.edit) {
    actions.push(
      { value: 'edit', label: '编辑', icon: 'basic-edit', handler: () => handleEdit(row) },
      { value: 'yamledit', label: '编辑 YAML', icon: 'basic-code', handler: () => handleEditYaml(row) },
      { value: 'restart', label: '重启', icon: 'basic-refresh', handler: () => handleRestart(row) },
    )
  }
  // 删除权限 + deletable 条件
  if (perm.delete && row.deletable !== false) {
    actions.push({ value: 'delete', label: '删除', icon: 'basic-delete', handler: () => handleDelete(row) })
  }

  return actions
}

// ==================== Lifecycle ====================

onMounted(() => {
  void loadNamespaceOptions()
  void loadData()
})
</script>

<style lang="scss" scoped>
.daemonset-page {
  .daemonset-page__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;

    .table-toolbar {
      display: flex;
      gap: $spacing-8;
      align-items: center;
      padding: $spacing-16 0;

      &__search {
        flex: 1;
        min-width: 0;
      }
    }

    .table-body {
      flex: 1;
      min-height: 0;
    }

    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-16 0;
    }
  }
}

.dialog-content {
  strong {
    color: $color-primary;
  }
}

.delete-daemonset-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
}
</style>
