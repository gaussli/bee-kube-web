<template>
  <div class="namespace-table">
    <!-- 提示信息和页面标题 -->
    <div class="page-header">
      <BeeAlert type="info" label="命名空间用于在 Kubernetes 集群中划分多个虚拟集群，实现资源隔离。" />
      <BeePageTitle :icon="FolderOpened" title="命名空间管理" description="管理 Kubernetes 集群中的命名空间资源。" />
    </div>

    <!-- 页面内容 -->
    <div class="page-body">
      <!-- 查询表单 -->
      <div class="table-query">
        <div class="table-query-left">
          <BeeInputSearch v-model="searchKey" placeholder="按名称搜索" @search="handleSearch" />
          <BeeRadioSearch v-model="queryForm.status" :options="statusOptions" @select="handleSelect" />
        </div>
        <div class="table-query-right">
          <BeeButton @click="handleReset">
            <template #icon><Refresh /></template>
            刷新
          </BeeButton>
          <el-divider v-if="hasPermission('kubernetes:namespace:create')" direction="vertical" />
          <BeeButton v-if="hasPermission('kubernetes:namespace:create')" type="primary" @click="handleCreate">
            <template #icon><Plus /></template>
            新增
          </BeeButton>
        </div>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <el-table v-loading="loading" :data="tableData" height="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="60" align="center" />
          <el-table-column min-width="150">
            <template #header>
              <IconLabel :icon="FolderOpened" label="命名空间" />
            </template>
            <template #default="{ row }">
              <el-link type="primary" @click="handleViewDetail(row)">{{ row.name }}</el-link>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template #header>
              <IconLabel :icon="CircleCheck" label="状态" />
            </template>
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template #header>
              <IconLabel :icon="InfoFilled" label="阶段" />
            </template>
            <template #default="{ row }">
              <span>{{ row.phase }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="200">
            <template #header>
              <IconLabel :icon="Grid" label="集群" />
            </template>
            <template #default="{ row }">
              <span>{{ row.clusterName || row.clusterId }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180">
            <template #header>
              <IconLabel :icon="Clock" label="创建时间" />
            </template>
            <template #default="{ row }">
              <TimeCell :time="row.createAt" />
            </template>
          </el-table-column>
          <el-table-column width="200" fixed="right">
            <template #header>
              <IconLabel :icon="EditPen" label="操作" />
            </template>
            <template #default="{ row }">
              <el-tooltip content="编辑" placement="top">
                <el-button v-if="hasPermission('kubernetes:namespace:edit')" circle :icon="EditPen" size="default" @click="handleEdit(row)" />
              </el-tooltip>
              <el-tooltip content="详情" placement="top">
                <el-button circle :icon="View" size="default" @click="handleViewDetail(row)" />
              </el-tooltip>
              <el-tooltip v-if="hasPermission('kubernetes:namespace:delete')" content="删除" placement="top">
                <el-button circle :icon="Delete" size="default" @click="handleDelete(row)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 表格底部 -->
      <div class="table-footer">
        <div>
          <BeeButton v-if="hasPermission('kubernetes:namespace:delete')" type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
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
          确定要删除命名空间 <strong>{{ currentTargetRow?.name }}</strong> 吗？
        </p>
        <p class="warning-text">删除命名空间将同时删除该命名空间下的所有资源！</p>
      </div>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
      <div class="dialog-content">
        <p>
          确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个命名空间吗？
        </p>
        <div class="delete-namespace-tags">
          <BeeTag v-for="row in selectedRows" :key="row.id">
            {{ row.name }}
          </BeeTag>
        </div>
        <p class="warning-text">删除命名空间将同时删除该命名空间下的所有资源！</p>
      </div>
    </BeeDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { FolderOpened, Refresh, Plus, CircleCheck, EditPen, Delete, View, Grid, Clock, InfoFilled } from '@element-plus/icons-vue'
import { type NamespaceQueryReq, type NamespaceResp } from '@/types'
import { getNamespacePage, deleteNamespace, batchDeleteNamespace } from '@/api'
import { useKubernetesStore } from '@/stores'
import BeeAlert from '@/components/BeeAlert/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeeRadioSearch from '@/components/BeeRadioSearch/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import IconLabel from '@/components/IconLabel/index.vue'
import TimeCell from '@/components/TimeCell/index.vue'
import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'NamespaceManage' })

const { hasPermission } = usePermission()
const router = useRouter()
const kubernetesStore = useKubernetesStore()
const searchKey = ref('')

const loading = ref(false)
const tableData = ref<NamespaceResp[]>([])
const selectedRows = ref<NamespaceResp[]>([])
const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const currentTargetRow = ref<NamespaceResp | null>(null)

const queryForm = reactive<NamespaceQueryReq>({
  name: undefined,
  clusterId: kubernetesStore.activeClusterId || undefined,
  status: undefined,
  page: 1,
  pageSize: 10
})
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})



const statusOptions = [
  { label: '所有', value: undefined },
  { label: '活跃', value: 'Active' },
  { label: '终止中', value: 'Terminating' }
]

function getStatusType(status: string) {
  switch (status) {
    case 'Active':
      return 'success'
    case 'Terminating':
      return 'warning'
    default:
      return 'info'
  }
}

async function loadData() {
  if (!queryForm.clusterId) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getNamespacePage({ ...queryForm, page: pagination.page, pageSize: pagination.pageSize })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryForm.name = searchKey.value
  pagination.page = 1
  loadData()
}



function handleSelect(selectValue?: string | number) {
  queryForm.status = selectValue as string | undefined
  pagination.page = 1
  loadData()
}

function handleReset() {
  queryForm.name = undefined
  queryForm.status = undefined
  queryForm.page = 1
  queryForm.pageSize = 10
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  loadData()
}

function handleSelectionChange(rows: NamespaceResp[]) {
  selectedRows.value = rows
}

function handleCreate() {
  router.push({ name: 'kubernetes:namespace:create' })
}

function handleEdit(row: NamespaceResp) {
  router.push({ name: 'kubernetes:namespace:edit', query: { clusterId: row.clusterId, name: row.name } })
}

function handleViewDetail(row: NamespaceResp) {
  router.push({ name: 'kubernetes:namespace:detail', query: { clusterId: row.clusterId, name: row.name } })
}

function handleDelete(row: NamespaceResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteNamespace(currentTargetRow.value.clusterId, currentTargetRow.value.name)
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
  const names = selectedRows.value.map(row => row.name)
  try {
    await batchDeleteNamespace(clusterId, names)
    ElMessage.success(`成功删除 ${names.length} 个命名空间`)
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
.namespace-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  flex-shrink: 0;
  padding: 16px 20px 0 20px;
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

    .el-button + .el-button {
      margin-left: 8px;
    }
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

  .warning-text {
    color: $color-danger;
    margin-top: 12px;
  }
}

.delete-namespace-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}
</style>
