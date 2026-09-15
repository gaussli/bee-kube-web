<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeePageHeader v-bind="JOB_PAGE_META" />

    <!-- 页面 Body -->
    <BeeCard class="page-body">
      <!-- 工具栏 -->
      <div class="page-body__toolbar">
        <BeeInputSearch v-model="searchKey" class="page-body__toolbar-search" placeholder="按 UID / 名称搜索" />
        <BeeSelect v-model="queryForm.namespace" :options="namespaceOptions" placeholder="命名空间筛选" />
        <BeeSelect v-model="queryForm.status" :options="JOB_STATUS_OPTIONS" placeholder="状态筛选" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <div v-if="perm.create" class="page-body__toolbar-separator"></div>
        <BeeButton v-if="perm.create" icon="basic-create" type="primary" @click="handleCreate"> 新增 </BeeButton>
        <BeeButton v-if="perm.create" icon="basic-create" type="primary" @click="handleCreateYaml"> YAML </BeeButton>
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
          <!-- 任务信息列 -->
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <WorkloadInfoCell
                :description="row.description"
                :icon="JOB_PAGE_META.icon"
                :name="row.name"
                :uid="row.uid"
              />
            </template>
          </BeeTableColumn>
          <!-- 命名空间列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="row.namespace" sublabel="命名空间" />
            </template>
          </BeeTableColumn>
          <!-- 状态列 -->
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeStatusCell :options="JOB_STATUS_OPTIONS" :status="row.status" :status-msg="row.statusMsg" />
            </template>
          </BeeTableColumn>
          <!-- 完成进度列 -->
          <BeeTableColumn :width="120">
            <template #default="{ row }">
              <BeeTableCommonCell :label="`${row.succeeded} / ${row.completions}`" sublabel="完成进度" />
            </template>
          </BeeTableColumn>
          <!-- 并行度列 -->
          <BeeTableColumn :width="120">
            <template #default="{ row }">
              <BeeTableCommonCell :label="`${row.active} / ${row.parallelism}`" sublabel="并行度" />
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
          <BeeButton :disabled="selectedRows.length === 0" icon="basic-clear" @click="handleClearSelection">
            清空
          </BeeButton>
          <BeeButton
            v-if="perm.delete"
            :disabled="selectedRows.length === 0"
            icon="basic-delete"
            type="danger"
            @click="handleBatchDelete"
          >
            删除 ({{ selectedRows.length }})
          </BeeButton>
          <BeeButton v-if="perm.view" icon="basic-export" @click="handleExport"> 导出 </BeeButton>
          <BeeButton v-if="perm.create" icon="basic-import" @click="handleImport"> 导入 </BeeButton>
        </div>
        <BeePagination
          v-model:page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          @change="loadData"
        />
      </div>
    </BeeCard>

    <!-- 重跑确认 Dialog -->
    <BeeDialog
      v-model="rerunDialogVisible"
      icon="kubernetes-rerun"
      title="重跑任务"
      type="primary"
      @confirm="handleConfirmRerun"
    >
      <span>
        您确认重跑 <strong>{{ selectedRow?.name || '' }}</strong> 任务吗？
      </span>
    </BeeDialog>

    <!-- 恢复更新确认 Dialog -->
    <BeeDialog
      v-model="resumeDialogVisible"
      icon="kubernetes-resume"
      title="恢复任务更新"
      type="primary"
      @confirm="handleConfirmResume"
    >
      <span>
        您确认恢复 <strong>{{ selectedRow?.name || '' }}</strong> 任务的更新吗？
      </span>
    </BeeDialog>

    <!-- 暂停更新确认 Dialog -->
    <BeeDialog
      v-model="pauseDialogVisible"
      icon="kubernetes-pause"
      title="暂停任务更新"
      type="primary"
      @confirm="handleConfirmPause"
    >
      <span>
        您确认暂停 <strong>{{ selectedRow?.name || '' }}</strong> 任务的更新吗？
      </span>
    </BeeDialog>

    <!-- 单个删除 Dialog -->
    <BeeDialog
      v-model="deleteDialogVisible"
      icon="basic-delete"
      title="删除任务"
      type="danger"
      @confirm="handleConfirmDelete"
    >
      <span>
        您确认删除 <strong>{{ selectedRow?.name || '' }}</strong> 任务吗？
      </span>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog
      v-model="batchDeleteDialogVisible"
      icon="basic-delete"
      title="批量删除任务"
      type="danger"
      @confirm="handleConfirmBatchDelete"
    >
      <BeeBatchDeleteDialogContent :delete-data="selectedRows" resource-type="任务" />
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { JobListVo, JobQueryForm } from '@/types/kubernetes/workload/job'

import { getNamespaceList } from '@/api/kubernetes/namespace/namespace'
import { getJobList, deleteJob, deleteJobs, rerunJob, resumeJob, pauseJob } from '@/api/kubernetes/workload/job'

import { KubernetesRouteNames } from '@/router/names'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeDialog from '@/components/base/BeeDialog/index.vue'
import BeeInputSearch from '@/components/base/BeeInputSearch/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeeSelect from '@/components/base/BeeSelect/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeActionCell, { type ActionItem } from '@/components/business/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/business/BeeAuditCell/index.vue'
import BeeBatchDeleteDialogContent from '@/components/business/BeeDialogContent/BeeBatchDeleteDialogContent.vue'
import BeePageHeader from '@/components/business/BeePageHeader/index.vue'
import BeeStatusCell from '@/components/business/BeeStatusCell/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import WorkloadInfoCell from '@/views/kubernetes/workload/components/WorkloadInfoCell/index.vue'

import { usePermission } from '@/composables/usePermission'
import { JOB_PAGE_META, JOB_STATUS_OPTIONS } from '@/config/kubernetes/workload/job.ts'
import { useKubernetesStore } from '@/stores'

defineOptions({ name: 'JobPage' })

// ==================== Composables & Route ====================
const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()

// ==================== Reactive State ====================
// ---------- 查询条件 ----------
/** 搜索关键词 */
const searchKey = ref('')
/** 查询条件 */
const queryForm = reactive<Partial<JobQueryForm>>({})
/** 分页条件请求 / 响应 */
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
// ---------- 表格数据 ----------
/** BeeTable 实例引用 */
const tableRef = ref<InstanceType<typeof BeeTable>>()
/** 列表加载态 */
const loading = ref(false)
/** 列表数据 */
const tableData = ref<JobListVo[]>([])
// ---------- 选中逻辑 ----------
/** 当前行数据 */
const selectedRow = ref<JobListVo>()
/** 多选选中数据 */
const selectedRows = ref<JobListVo[]>([])
// ---------- 对话框 ----------
/** 重跑确认弹框显隐 */
const rerunDialogVisible = ref(false)
/** 恢复更新确认弹框显隐 */
const resumeDialogVisible = ref(false)
/** 暂停更新确认弹框显隐 */
const pauseDialogVisible = ref(false)
/** 单个删除弹框显隐 */
const deleteDialogVisible = ref(false)
/** 批量删除弹框显隐 */
const batchDeleteDialogVisible = ref(false)

// --- 选项数据
/** 命名空间选项 */
const namespaceOptions = ref<{ label: string; value: string | undefined }[]>([
  { label: '全部命名空间', value: undefined },
])

// ==================== Computed ====================
/** 当前集群 UID */
const clusterUid = computed(() => (route.params.clusterUid as string) || useKubernetesStore().activeClusterUid || '')
/** 多选选中数据中可删除列表 */
const deletableRows = computed(() => selectedRows.value.filter(row => row.deletable))

// ==================== Permission ====================
/** 页面级权限缓存，避免模板/循环中重复调用 hasPermission */
const perm: Record<string, boolean> = {
  create: hasPermission('kubernetes:workload:job:create'),
  edit: hasPermission('kubernetes:workload:job:edit'),
  view: hasPermission('kubernetes:workload:job:view'),
  delete: hasPermission('kubernetes:workload:job:delete'),
}

// ==================== Row Actions Generate ====================
/**
 * 构建行操作数组
 * @param row - 当前行数据
 * @returns 操作项数组
 */
function getActions(row: JobListVo): ActionItem[] {
  const actions: ActionItem[] = []
  if (perm.view) {
    actions.push({ value: 'view', label: '详情', icon: 'basic-view', handler: () => handleViewDetail(row) })
  }
  if (perm.edit) {
    actions.push(
      { value: 'edit', label: '编辑', icon: 'basic-edit', handler: () => handleEdit(row) },
      { value: 'labels', label: '配置标签', icon: 'kubernetes-label', handler: () => handleLabels(row) },
      { value: 'annotations', label: '配置注解', icon: 'kubernetes-annotation', handler: () => handleAnnotations(row) },
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
  if (perm.delete && row.deletable) {
    actions.push({ value: 'delete', label: '删除', icon: 'basic-delete', handler: () => handleDelete(row) })
  }
  return actions
}

// ==================== Data Loading ====================
/**
 * 请求命名空间选项列表数据
 */
async function loadNamespaceOptions() {
  if (!clusterUid.value) return
  try {
    const { list } = await getNamespaceList(clusterUid.value, { mode: 'Simple' })
    namespaceOptions.value = [
      { label: '全部命名空间', value: undefined },
      ...list.map(ns => ({ label: ns.name, value: ns.name })),
    ]
  } catch (err) {
    console.error('[loadNamespaceOptions]', err)
    BeeMessage.error('加载命名空间选项失败，请稍后再试')
  }
}

/**
 * 请求任务列表数据
 */
async function loadData() {
  if (!clusterUid.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const { list, total } = await getJobList(clusterUid.value, {
      ...queryForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = list
    pagination.total = total
  } catch (err) {
    console.error('[loadData]', err)
    BeeMessage.error('加载任务列表失败')
  } finally {
    loading.value = false
  }
}

// ==================== BeeTable Handler ====================
/**
 * 表格选中行变化
 * @param rows
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as JobListVo[]
}

// ==================== Handler ====================
/**
 * 搜索
 */
function handleSearch() {
  queryForm.uid = searchKey.value
  queryForm.name = searchKey.value
  pagination.page = 1
  void loadData()
}

/**
 * 重置搜索条件
 */
function handleReset() {
  queryForm.uid = undefined
  queryForm.name = undefined
  queryForm.namespace = undefined
  queryForm.status = undefined
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  void loadData()
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
function handleViewDetail(row: JobListVo) {
  router
    .push({
      name: KubernetesRouteNames.Job.Detail,
      params: { clusterId: clusterUid.value, namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 编辑任务
 * @param row
 */
function handleEdit(row: JobListVo) {
  router
    .push({
      name: KubernetesRouteNames.Job.Edit,
      params: { clusterId: clusterUid.value, namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 配置任务标签
 * @param row - 当前行数据
 */
function handleLabels(row: JobListVo) {
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
function handleAnnotations(row: JobListVo) {
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
async function handleRerun(row: JobListVo) {
  selectedRow.value = row
  rerunDialogVisible.value = true
}

/**
 * 恢复任务更新
 * @param row - 当前行数据
 */
async function handleResume(row: JobListVo) {
  selectedRow.value = row
  resumeDialogVisible.value = true
}

/**
 * 暂停任务更新
 * @param row - 当前行数据
 */
async function handlePause(row: JobListVo) {
  selectedRow.value = row
  pauseDialogVisible.value = true
}

/**
 * 删除任务
 * @param row
 */
function handleDelete(row: JobListVo) {
  selectedRow.value = row
  deleteDialogVisible.value = true
}
/**
 * 打开批量删除确认弹窗
 */
function handleBatchDelete() {
  if (deletableRows.value.length === 0) {
    BeeMessage.warning('选中的任务均不可删除')
    return
  }
  batchDeleteDialogVisible.value = true
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

// ==================== Dialog Confirm ====================
/**
 * 二次确认重跑任务
 */
async function handleConfirmRerun() {
  if (!selectedRow.value) return
  const { namespace, name } = selectedRow.value
  try {
    await rerunJob(clusterUid.value, namespace, name)
    BeeMessage.success(`成功重跑任务【${name}】`)
    selectedRow.value = undefined
    void loadData()
  } catch (err) {
    console.error('[handleRestart]', err)
    BeeMessage.error(`重跑任务【${name}】失败`)
  }
}

/**
 * 二次确认恢复任务更新
 */
async function handleConfirmResume() {
  if (!selectedRow.value) return
  const { namespace, name } = selectedRow.value
  try {
    await resumeJob(clusterUid.value, namespace, name)
    BeeMessage.success(`成功恢复任务【${name}】更新`)
    selectedRow.value = undefined
    void loadData()
  } catch (err) {
    console.error('[handleResume]', err)
    BeeMessage.error(`恢复任务【${name}】更新失败`)
  }
}

/**
 * 二次确认暂停任务更新
 */
async function handleConfirmPause() {
  if (!selectedRow.value) return
  const { namespace, name } = selectedRow.value
  try {
    await pauseJob(clusterUid.value, namespace, name)
    BeeMessage.success(`成功暂停任务【${name}】更新`)
    selectedRow.value = undefined
    void loadData()
  } catch (err) {
    console.error('[handlePause]', err)
    BeeMessage.error(`暂停任务【${name}】更新失败`)
  }
}
/**
 * 二次确认删除任务
 */
async function handleConfirmDelete() {
  if (!selectedRow.value) return
  const { namespace, name } = selectedRow.value
  try {
    await deleteJob(clusterUid.value, namespace, name)
    BeeMessage.success(`成功删除任务【${name}】`)
    selectedRow.value = undefined
    void loadData()
  } catch (err) {
    console.error('[handleConfirmDelete]', err)
    BeeMessage.error(`删除任务【${name}】失败`)
  }
}

/**
 * 二次确认批量删除任务
 */
async function handleConfirmBatchDelete() {
  if (deletableRows.value.length === 0) return
  const uids = deletableRows.value.map(row => row.uid)
  try {
    await deleteJobs(clusterUid.value, uids)
    BeeMessage.success(`成功删除 ${uids.length} 个任务`)
    selectedRows.value = []
    void loadData()
  } catch (err) {
    console.error('[handleConfirmBatchDelete]', err)
    BeeMessage.error('批量删除任务失败')
  }
}

// ==================== Lifecycle ====================
onMounted(() => {
  void loadNamespaceOptions()
  void loadData()
})
</script>

<style lang="scss" scoped>
.page-body {
  display: flex;
  gap: 16px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  flex: 1;
  width: 100%;
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

    &-separator {
      flex-shrink: 0;
      width: 1px;
      height: 16px;
      margin: 0 8px;
      background: $color-separator;
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
      justify-content: flex-start;
      align-items: center;
    }
  }
}
</style>
