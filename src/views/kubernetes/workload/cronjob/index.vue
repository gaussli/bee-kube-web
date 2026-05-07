<template>
  <div class="cronjob-table">
    <!-- 页面标题 -->
    <div class="page-header">
      <BeePageTitle
        :icon="Timer"
        title="定时任务"
        description="定时任务（CronJob）用于定时运行任务，按照 Cron 表达式调度 Job 执行。"
      />
    </div>

    <!-- 页面内容 -->
    <div class="page-body">
      <!-- 查询表单 -->
      <div class="table-query">
        <div class="table-query-left">
          <BeeInputSearch v-model="searchKey" placeholder="按名称搜索" @search="handleSearch" />
          <BeeSelect v-model="queryForm.namespace" placeholder="选择命名空间" :options="namespaceOptions" @change="handleNamespaceChange" />
        </div>
        <div class="table-query-right">
          <BeeButton @click="handleReset">
            <template #icon><Refresh /></template>
            刷新
          </BeeButton>
          <el-divider v-if="hasPermission('kubernetes:workload:cronjob:create')" direction="vertical" />
          <BeeButton v-if="hasPermission('kubernetes:workload:cronjob:create')" type="primary" @click="handleCreate">
            <template #icon><Plus /></template>
            新增
          </BeeButton>
        </div>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <el-table v-loading="loading" :data="tableData" height="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="60" align="center" />
          <el-table-column min-width="200">
            <template #header>
              <IconLabel :icon="Timer" label="名称" />
            </template>
            <template #default="{ row }">
              <div class="name-cell">
                <div class="name-row">
                  <span class="name-text">{{ row.name }}</span>
                  <el-icon class="copy-icon" @click="handleCopy(row.name)"><DocumentCopy /></el-icon>
                </div>
                <div class="desc-text">{{ row.labels?.description || '-' }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="120">
            <template #header>
              <IconLabel :icon="FolderOpened" label="命名空间" />
            </template>
            <template #default="{ row }">
              <span>{{ row.namespace }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="150">
            <template #header>
              <IconLabel :icon="Timer" label="调度规则" />
            </template>
            <template #default="{ row }">
              <code class="schedule-code">{{ row.schedule }}</code>
            </template>
          </el-table-column>
          <el-table-column width="100">
            <template #header>
              <IconLabel :icon="InfoFilled" label="暂停" />
            </template>
            <template #default="{ row }">
              <el-tag :type="row.suspend ? 'warning' : 'success'" size="small">{{ row.suspend ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="100">
            <template #header>
              <IconLabel :icon="Cpu" label="活跃" />
            </template>
            <template #default="{ row }">
              <span>{{ row.active }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180">
            <template #header>
              <IconLabel :icon="Clock" label="上次调度" />
            </template>
            <template #default="{ row }">
              <span class="time-text">{{ formatTime(row.lastScheduleTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" fixed="right">
            <template #header>
              <IconLabel :icon="EditPen" label="操作" />
            </template>
            <template #default="{ row }">
              <el-tooltip content="编辑" placement="top">
                <el-button v-if="hasPermission('kubernetes:workload:cronjob:edit')" circle :icon="EditPen" size="default" @click="handleEdit(row)" />
              </el-tooltip>
              <el-tooltip content="详情" placement="top">
                <el-button circle :icon="View" size="default" @click="handleViewDetail(row)" />
              </el-tooltip>

              <el-tooltip content="更多" placement="top">
                <el-dropdown trigger="click">
                  <template #default>
                    <el-button circle :icon="MoreFilled" size="default" />
                  </template>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleEditYaml(row)">
                        <el-icon><DocumentChecked /></el-icon> 编辑 YAML
                      </el-dropdown-item>
                      <el-dropdown-item v-if="hasPermission('kubernetes:workload:cronjob:delete') && row.deletable !== false" divided @click="handleDelete(row)">
                        <el-icon><Delete /></el-icon> 删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 表格底部 -->
      <div class="table-footer">
        <div>
          <BeeButton v-if="hasPermission('kubernetes:workload:cronjob:delete')" type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            <template #icon><Delete /></template>
            批量删除 ({{ selectedRows.length }})
          </BeeButton>
        </div>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </div>

    <!-- 单个删除 Dialog -->
    <BeeDialog v-model="deleteDialogVisible" title="确认删除" @confirm="handleConfirmDelete">
      <div class="dialog-content">
        <p>
          确定要删除 CronJob <strong>{{ currentTargetRow?.name }}</strong> 吗？
        </p>
      </div>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
      <div class="dialog-content">
        <p>
          确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个 CronJob 吗？
        </p>
        <div class="delete-cronjob-tags">
          <BeeTag v-for="row in selectedRows" :key="row.id">
            {{ row.name }}
          </BeeTag>
        </div>
      </div>
    </BeeDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Timer, Refresh, Plus, EditPen, Delete, View, FolderOpened, Cpu, Clock, InfoFilled, DocumentCopy, DocumentChecked, MoreFilled } from '@element-plus/icons-vue'
import { type CronJobQueryReq, type CronJobResp } from '@/types'
import { getCronJobPage, deleteCronJob, batchDeleteCronJob } from '@/api'
import { useKubernetesStore } from '@/stores'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import IconLabel from '@/components/IconLabel/index.vue'
import { useClipboard } from '@/composables/useClipboard'
import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'CronJobManage' })

const { hasPermission } = usePermission()
const { copy } = useClipboard()
const router = useRouter()
const kubernetesStore = useKubernetesStore()
const searchKey = ref('')

const loading = ref(false)
const tableData = ref<CronJobResp[]>([])
const selectedRows = ref<CronJobResp[]>([])
const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const currentTargetRow = ref<CronJobResp | null>(null)

const queryForm = reactive<CronJobQueryReq>({
  name: undefined,
  clusterId: kubernetesStore.activeClusterId || undefined,
  namespace: undefined,
  page: 1,
  pageSize: 10
})
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const namespaceOptions = ref([
  { label: '全部命名空间', value: undefined },
  { label: 'default', value: 'default' },
  { label: 'app-frontend', value: 'app-frontend' },
  { label: 'app-backend', value: 'app-backend' },
  { label: 'kube-system', value: 'kube-system' }
])

function formatTime(time: string) {
  if (!time) return '-'
  return time.replace('T', ' ').slice(0, 19)
}

async function loadData() {
  if (!queryForm.clusterId) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getCronJobPage({ ...queryForm, page: pagination.page, pageSize: pagination.pageSize })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryForm.name = searchKey.value || undefined
  pagination.page = 1
  loadData()
}

function handleNamespaceChange(value: string) {
  queryForm.namespace = value || undefined
  pagination.page = 1
  loadData()
}

function handleReset() {
  queryForm.name = undefined
  queryForm.namespace = undefined
  queryForm.page = 1
  queryForm.pageSize = 10
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  loadData()
}

function handleSelectionChange(rows: CronJobResp[]) {
  selectedRows.value = rows
}

function handleCreate() {
  router.push({ name: 'kubernetes:workload:cronjob:create' })
}

function handleEdit(row: CronJobResp) {
  router.push({ name: 'kubernetes:workload:cronjob:edit', query: { clusterId: row.clusterId, namespace: row.namespace, name: row.name } })
}

function handleViewDetail(row: CronJobResp) {
  router.push({ name: 'kubernetes:workload:cronjob:detail', query: { clusterId: row.clusterId, namespace: row.namespace, name: row.name } })
}

function handleEditYaml(row: CronJobResp) {
  ElMessage.info(`编辑 YAML: ${row.name}`)
}

function handleCopy(text: string) {
  copy(text)
}

function handleDelete(row: CronJobResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteCronJob(currentTargetRow.value.clusterId, currentTargetRow.value.namespace, currentTargetRow.value.name)
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
    currentTargetRow.value = null
    loadData()
  } catch {
    // 失败处理
  }
}

function handleBatchDelete() {
  batchDeleteDialogVisible.value = true
}

async function handleConfirmBatchDelete() {
  if (selectedRows.value.length === 0) return
  const clusterId = selectedRows.value[0].clusterId
  const namespace = selectedRows.value[0].namespace
  const names = selectedRows.value.map(row => row.name)
  try {
    await batchDeleteCronJob(clusterId, namespace, names)
    ElMessage.success(`成功删除 ${names.length} 个 CronJob`)
    batchDeleteDialogVisible.value = false
    selectedRows.value = []
    loadData()
  } catch {
    // 失败处理
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.cronjob-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  flex-shrink: 0;
  padding: 0 20px;
  margin-bottom: 16px;
  background-color: $bg-page;
}

.page-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background-color: $bg-page;
}

.table-query {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  gap: 12px;

  .table-query-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.table-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 20px;

  :deep(.el-table) {
    height: 100%;

    th.el-table__cell {
      padding: 12px 0;
    }

    td.el-table__cell {
      padding: 16px 0;
    }

    .el-table__body tr {
      height: 56px;
    }

    .el-button + .el-button {
      margin-left: 8px;
    }
  }

  .name-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .name-row {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .name-text {
      font-size: 14px;
      font-weight: 500;
      color: $text-regular;
    }

    .copy-icon {
      font-size: 14px;
      color: $color-primary;
      cursor: pointer;
    }

    .desc-text {
      font-size: 12px;
      color: $text-secondary;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .schedule-code {
    font-family: monospace;
    font-size: 12px;
    color: $text-secondary;
    background-color: var(--el-fill-color-light);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .time-text {
    font-family: monospace;
    font-size: 12px;
    color: $text-secondary;
  }
}

.table-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.dialog-content {
  strong {
    color: $color-primary;
  }
}

.delete-cronjob-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
</style>
