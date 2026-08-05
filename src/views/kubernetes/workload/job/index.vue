<template>
  <BeePage class="job-page">
    <!-- 页面标题 -->
    <BeeCard class="job-page__header">
      <BeePageHeader :icon="JOB_PAGE_META.icon" :title="JOB_PAGE_META.title" :description="JOB_PAGE_META.description" />
    </BeeCard>

    <!-- 页面内容 -->
    <BeeCard class="job-page__body">
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
        <BeeSelect v-model="queryForm.status" placeholder="状态筛选" :options="JOB_STATUS_OPTIONS" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <BeeButton v-if="perm.create" type="primary" icon="basic-create" @click="handleCreate"> 新增 </BeeButton>
        <BeeButton v-if="perm.create" type="primary" icon="basic-create" @click="handleCreateYaml"> YAML </BeeButton>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <BeeTable
          ref="tableRef"
          :data="tableData"
          :loading="loading"
          selectable
          @selection-change="handleSelectionChange"
        >
          <BeeTableColumn :width="400">
            <template #default="{ row }">
              <BeeWorkloadInfoCell
                :uid="row.uid"
                :name="row.name"
                :description="row.description"
                :icon-size="32"
                icon="kubernetes-job"
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
              <BeeStatusCell :status="row.status" :status-msg="row.statusMessage" :options="JOB_STATUS_OPTIONS" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeTableCommonCell :text="`${row.succeeded} / ${row.completions}`" subtext="成功 / 目标" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="140">
            <template #default="{ row }">
              <BeeTableCommonCell :text="`${row.active} / ${row.parallelism}`" subtext="活动 / 并行" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeTableCommonCell :text="formatDuration(row)" subtext="运行时长" />
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
        <div class="table-footer__actions">
          <BeeButton :disabled="selectedRows.length === 0" @click="handleClearSelection"> 取消选择 </BeeButton>
          <BeeButton v-if="perm.delete" type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            批量删除 ({{ selectedRows.length }})
          </BeeButton>
          <BeeButton v-if="perm.view" icon="basic-create" @click="handleExport"> 导出 </BeeButton>
          <BeeButton v-if="perm.create" icon="basic-create" @click="handleImport"> 导入 </BeeButton>
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
          确定要删除 Job <strong>{{ currentTargetRow?.name }}</strong> 吗？
        </p>
      </div>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
      <div class="dialog-content">
        <p>
          确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个 Job 吗？
        </p>
        <div class="delete-job-tags">
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
 * Job 管理页面
 * @module views/kubernetes/workload/job
 */
import { onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { NamespaceSimpleListResp } from '@/types/kubernetes/namespace'
import type { JobQueryReq, JobListResp } from '@/types/kubernetes/workload/job'

import { getNamespacePage } from '@/api/kubernetes/namespace'
import { getJobList, deleteJob, deleteJobs } from '@/api/kubernetes/workload/job'

import BeeActionCell, { type ActionItem } from '@/components/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import { BeeMessage } from '@/components/BeeMessage'
import BeePage from '@/components/BeePage/index.vue'
import BeePageHeader from '@/components/BeePageHeader/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'
import BeeStatusCell from '@/components/BeeStatusCell/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import BeeWorkloadInfoCell from '@/components/BeeWorkloadInfoCell/index.vue'

import { usePermission } from '@/composables/usePermission'
import { JOB_PAGE_META, JOB_STATUS_OPTIONS } from '@/config/kubernetes/workload/job'

defineOptions({ name: 'JobManage' })

// ==================== Composables & Route ====================

const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()

// ==================== Reactive State ====================

const clusterUid = ref(route.params.clusterUid as string)
const searchKey = ref('')
const loading = ref(false)
const tableData = ref<JobListResp[]>([])
const tableRef = ref<InstanceType<typeof BeeTable>>()
const selectedRows = ref<JobListResp[]>([])
const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const currentTargetRow = ref<JobListResp | null>(null)

const queryForm = reactive<Partial<JobQueryReq>>({})
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

// ==================== Options ====================

/** 命名空间选项 */
const namespaceOptions = ref<{ label: string; value: string | undefined }[]>([
  { label: '全部命名空间', value: undefined },
])

// ==================== Data Loading ====================

/**
 * 加载命名空间选项
 * @remarks 通过 getNamespacePage mode=simple 获取简化列表，转换后填充下拉选项
 */
async function loadNamespaceOptions() {
  if (!clusterUid.value) return
  try {
    const namespaces = (await getNamespacePage(clusterUid.value, { mode: 'simple' })) as NamespaceSimpleListResp[]
    namespaceOptions.value = [
      { label: '全部命名空间', value: undefined },
      ...namespaces.map(ns => ({ label: ns.name, value: ns.name })),
    ]
  } catch {
    // 加载失败时保留默认选项
  }
}

/**
 * 格式化运行时长
 * @param row - Job 列表项
 * @returns 格式化的时长字符串
 */
function formatDuration(row: JobListResp): string {
  if (!row.startTime) return '-'
  const start = new Date(row.startTime).getTime()
  const end = row.completionTime ? new Date(row.completionTime).getTime() : Date.now()
  const diffMs = end - start
  if (diffMs <= 0) return '刚刚启动'
  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  if (hours > 0) {
    const remainMin = minutes % 60
    return remainMin > 0 ? `${hours}小时${remainMin}分钟` : `${hours}小时`
  }
  if (minutes > 0) {
    const remainSec = seconds % 60
    return remainSec > 0 ? `${minutes}分钟${remainSec}秒` : `${minutes}分钟`
  }
  return `${seconds}秒`
}

/**
 * 加载 Job 列表数据
 * @remarks 根据当前查询条件与分页参数获取 Job 分页数据
 */
async function loadData() {
  if (!clusterUid.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getJobList(clusterUid.value, {
      name: queryForm.name,
      namespace: queryForm.namespace || undefined,
      status: queryForm.status,
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
 * @remarks 将 searchKey 映射到 name 字段进行模糊匹配
 */
function handleSearch() {
  queryForm.name = searchKey.value
  pagination.page = 1
  void loadData()
}

/**
 * 重置搜索条件
 */
function handleReset() {
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
  selectedRows.value = rows as unknown as JobListResp[]
}

/** 取消全部选中 */
function handleClearSelection() {
  tableRef.value?.clearSelection()
}

// ==================== CRUD: Create / Edit / View ====================

/** 跳转创建页面 */
function handleCreate() {
  router.push({ name: 'kubernetes:workload:job:create', params: { clusterUid: clusterUid.value } }).catch(() => {})
}

/** YAML 方式创建 */
function handleCreateYaml() {
  router.push({ name: 'kubernetes:workload:job:create:yaml', params: { clusterUid: clusterUid.value } }).catch(() => {})
}

/** 导出 Job（功能开发中） */
function handleExport() {
  BeeMessage.info('功能开发中')
}

/** 导入 Job（功能开发中） */
function handleImport() {
  BeeMessage.info('功能开发中')
}

/**
 * 跳转编辑页面
 * @param row
 */
function handleEdit(row: JobListResp) {
  router
    .push({
      name: 'kubernetes:workload:job:edit',
      params: { clusterUid: row.clusterUid, namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 编辑 YAML
 * @param row
 */
function handleEditYaml(row: JobListResp) {
  router
    .push({
      name: 'kubernetes:workload:job:edit:yaml',
      params: { clusterUid: row.clusterUid, namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 跳转详情页面
 * @param row
 */
function handleViewDetail(row: JobListResp) {
  router
    .push({
      name: 'kubernetes:workload:job:detail',
      params: { clusterUid: row.clusterUid, namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

// ==================== CRUD: Delete ====================

/**
 * 打开删除确认弹窗
 * @param row
 */
function handleDelete(row: JobListResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

/** 确认单个删除 */
async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteJob(currentTargetRow.value.clusterUid, currentTargetRow.value.namespace, currentTargetRow.value.name)
    BeeMessage.success('删除成功')
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
  const targetClusterId = selectedRows.value[0].clusterUid
  const targetNamespace = selectedRows.value[0].namespace
  const names = selectedRows.value.map(row => row.name)
  try {
    await deleteJobs(targetClusterId, targetNamespace, names)
    BeeMessage.success(`成功删除 ${names.length} 个 Job`)
    batchDeleteDialogVisible.value = false
    selectedRows.value = []
    await loadData()
  } catch (err) {
    console.error('[handleConfirmBatchDelete]', err)
  }
}

// ==================== Row Actions ====================

/** 页面级权限缓存，避免模板/循环中重复调用 hasPermission */
const perm: Record<string, boolean> = {
  create: hasPermission('kubernetes:workload:job:create'),
  edit: hasPermission('kubernetes:workload:job:edit'),
  view: hasPermission('kubernetes:workload:job:view'),
  delete: hasPermission('kubernetes:workload:job:delete'),
}

/**
 * 构建行操作数组
 * @param row - 当前行数据
 * @returns 操作项数组
 * @remarks 按权限和 row.deletable 条件过滤，由调用方负责
 */
function getActions(row: JobListResp): ActionItem[] {
  const actions: ActionItem[] = []
  // 查看权限
  if (perm.view) {
    actions.push({ value: 'view', label: '详情', icon: 'basic-view', handler: () => handleViewDetail(row) })
  }
  // 编辑权限：编辑、编辑 YAML
  if (perm.edit) {
    actions.push(
      { value: 'edit', label: '编辑', icon: 'basic-edit', handler: () => handleEdit(row) },
      { value: 'yamledit', label: '编辑 YAML', icon: 'basic-code', handler: () => handleEditYaml(row) },
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
.job-page {
  .job-page__body {
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

      &__actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }
    }
  }
}

.dialog-content {
  strong {
    color: $color-primary;
  }
}

.delete-job-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
}
</style>
