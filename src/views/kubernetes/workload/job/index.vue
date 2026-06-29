<template>
  <BeePage class="job-page">
    <!-- 页面标题 -->
    <BeeCard class="job-page__header">
      <BeePageTitle icon="kubernetes-namespace" title="任务" description="任务（Job）用于运行一次性批量任务，任务完成后 Pod 会自动终止，适用于数据处理、备份、定时计算等场景。" />
    </BeeCard>

    <!-- 页面内容 -->
    <BeeCard class="job-page__body">
      <!-- 查询表单 -->
      <div class="table-toolbar">
        <BeeInputSearch v-model="searchKey" placeholder="按 ID / 名称搜索" class="table-toolbar__search" />
        <BeeSelect v-model="queryForm.namespace" placeholder="命名空间选择" :options="namespaceOptions" :width="300" />
        <BeeSelect v-model="queryForm.status" placeholder="状态筛选" :options="JOB_STATUS_OPTIONS" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <BeeButton v-if="hasPermission('kubernetes:workload:job:create')" type="primary" icon="basic-create" @click="handleCreate"> 新增 </BeeButton>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <BeeTable :data="tableData" :loading="loading" selectable @selection-change="handleSelectionChange">
          <BeeTableColumn :width="400">
            <template #default="{ row }">
              <BeeWorkloadInfoCell :uid="row.uid" :name="row.name" :description="row.description" :icon-size="32" icon="kubernetes-namespace" />
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
              <div class="table-action">
                <BeeCircleButton v-if="hasPermission('kubernetes:workload:job:edit')" icon="basic-edit" tooltip="编辑" @click="handleEdit(row)" />
                <BeeCircleButton icon="basic-view" tooltip="详情" @click="handleViewDetail(row)" />
                <BeeDropdown trigger="click">
                  <BeeCircleButton icon="basic-more" tooltip="更多" />
                  <template #dropdown>
                    <BeeDropdownItem value="yamledit" label="编辑 YAML" icon="basic-code" @click="handleEditYaml(row)" />
                    <BeeDropdownItem v-if="hasPermission('kubernetes:workload:job:delete') && row.deletable !== false" value="delete" label="删除" icon="basic-delete" @click="handleDelete(row)" />
                  </template>
                </BeeDropdown>
              </div>
            </template>
          </BeeTableColumn>
        </BeeTable>
      </div>

      <!-- 表格底部 -->
      <div class="table-footer">
        <div>
          <BeeButton v-if="hasPermission('kubernetes:workload:job:delete')" type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            批量删除 ({{ selectedRows.length }})
          </BeeButton>
        </div>
        <BeePagination v-model="pagination.page" v-model:pageSize="pagination.pageSize" :total="pagination.total" :page-sizes="[10, 20, 50]" @change="loadData" />
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
import { ElMessage } from 'element-plus'
import type { JobQueryReq, JobListResp } from '@/types/kubernetes/workload/job'
import { getJobPage, deleteJob, deleteJobs } from '@/api/kubernetes/workload/job'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeCircleButton from '@/components/BeeCircleButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeDropdown from '@/components/BeeDropdown/index.vue'
import BeeDropdownItem from '@/components/BeeDropdownItem/index.vue'
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
import { JOB_STATUS_OPTIONS } from '@/config/kubernetes'

defineOptions({ name: 'JobManage' })

const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()
const searchKey = ref('')
const clusterId = ref(route.params.clusterId as string)

const loading = ref(false)
const tableData = ref<JobListResp[]>([])
const selectedRows = ref<JobListResp[]>([])
const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const currentTargetRow = ref<JobListResp | null>(null)

const queryForm = reactive<Partial<JobQueryReq>>({
  name: undefined,
  namespace: undefined,
  status: undefined
})
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

/** 命名空间选项（Job 为命名空间级资源，可选筛选） */
const namespaceOptions = ref([
  { label: '全部命名空间', value: undefined },
  { label: 'default', value: 'default' },
  { label: 'kube-system', value: 'kube-system' },
  { label: 'data', value: 'data' },
  { label: 'etl', value: 'etl' },
  { label: 'ml', value: 'ml' },
  { label: 'middleware', value: 'middleware' },
  { label: 'logging', value: 'logging' },
  { label: 'analytics', value: 'analytics' },
  { label: 'search', value: 'search' }
])

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
  if (!clusterId.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getJobPage(clusterId.value, {
      name: queryForm.name,
      namespace: queryForm.namespace || undefined,
      status: queryForm.status,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

/**
 * 搜索
 * @remarks 将 searchKey 映射到 name 字段进行模糊匹配
 */
function handleSearch() {
  queryForm.name = searchKey.value
  pagination.page = 1
  loadData()
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
  loadData()
}

/**
 * 表格选中行变化
 * @remarks BeeTable 的 selection-change 事件固定返回 Record<string, unknown>[]，需通过 unknown 桥接断言为目标类型
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as JobListResp[]
}

/** 跳转创建页面 */
function handleCreate() {
  router.push({ name: 'kubernetes:workload:job:create', params: { clusterId: clusterId.value } })
}

/** 跳转编辑页面 */
function handleEdit(row: JobListResp) {
  router.push({ name: 'kubernetes:workload:job:edit', params: { clusterId: row.clusterId }, query: { namespace: row.namespace, name: row.name } })
}

/** 跳转详情页面 */
function handleViewDetail(row: JobListResp) {
  router.push({ name: 'kubernetes:workload:job:detail', params: { clusterId: row.clusterId }, query: { namespace: row.namespace, name: row.name } })
}

/** 编辑 YAML */
function handleEditYaml(row: JobListResp) {
  ElMessage.info(`编辑 YAML: ${row.name}`)
}

/** 打开删除确认弹窗 */
function handleDelete(row: JobListResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

/** 确认单个删除 */
async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteJob(currentTargetRow.value.clusterId, currentTargetRow.value.namespace, currentTargetRow.value.name)
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
    currentTargetRow.value = null
    loadData()
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
    await deleteJobs(targetClusterId, targetNamespace, names)
    ElMessage.success(`成功删除 ${names.length} 个 Job`)
    batchDeleteDialogVisible.value = false
    selectedRows.value = []
    loadData()
  } catch (err) {
    console.error('[handleConfirmBatchDelete]', err)
  }
}

onMounted(() => {
  loadData()
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

    .table-action {
      display: flex;
      gap: $spacing-8;
      width: 100%;
      height: auto;
    }

    .table-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $spacing-16 0;
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
