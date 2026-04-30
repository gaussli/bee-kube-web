<template>
  <div class="cluster-table">
    <!-- 提示信息和页面标题 -->
    <div class="page-header">
      <BeeAlert type="info" label="在进行集群管理之前，需要先选择一个集群。" />
      <BeePageTitle :icon="Grid" title="集群管理" description="对多集群以及每个集群的基础资源、服务组件及相关应用资源等的统一管理。" />
    </div>

    <!-- 页面内容 -->
    <div class="page-body">
      <!-- 查询表单 -->
      <div class="table-query">
        <div class="table-query-left">
          <BeeInputSearch v-model="searchKey" placeholder="按 ID / 名称 搜索" @search="handleSearch" />
          <BeeRadioSearch v-model="queryForm.status" :options="statusOptions" @select="handleSelect" />
        </div>
        <div class="table-query-right">
          <BeeButton @click="handleReset">
            <template #icon><Refresh /></template>
            刷新
          </BeeButton>
          <el-divider v-if="hasPermission('kubernetes:cluster:create')" type="primary" @click="handleCreate" direction="vertical" />
          <BeeButton v-if="hasPermission('kubernetes:cluster:create')" type="primary" @click="handleCreate">
            <template #icon><Plus /></template>
            新增
          </BeeButton>
        </div>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <el-table v-loading="loading" :data="tableData" height="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="60" align="center" />
          <el-table-column prop="id" width="300">
            <template #header>
              <IconLabel :icon="Key" label="ID" />
            </template>
            <template #default="{ row }">
              <TextCopyableCell :text="row.id" />
            </template>
          </el-table-column>
          <el-table-column min-width="150">
            <template #header>
              <IconLabel :icon="Grid" label="集群名称" />
            </template>
            <template #default="{ row }">
              <el-link type="primary" @click="handleSelectCluster(row)">{{ row.name }}</el-link>
            </template>
          </el-table-column>
          <el-table-column min-width="250">
            <template #header>
              <IconLabel :icon="Link" label="API Server" />
            </template>
            <template #default="{ row }">
              <span class="api-server">{{ row.apiServer }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" width="100">
            <template #header>
              <IconLabel :icon="CircleCheck" label="状态" />
            </template>
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                {{ row.status === 1 ? '正常' : '异常' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" min-width="150" show-overflow-tooltip>
            <template #header>
              <IconLabel :icon="Document" label="描述" />
            </template>
          </el-table-column>
          <el-table-column width="180">
            <template #header>
              <IconLabel :icon="Clock" label="创建" />
            </template>
            <template #default="{ row }">
              <AuditCell :user="row.createBy" :time="row.createAt" />
            </template>
          </el-table-column>
          <el-table-column width="200" fixed="right">
            <template #header>
              <IconLabel :icon="EditPen" label="操作" />
            </template>
            <template #default="{ row }">
              <el-tooltip content="编辑" placement="top">
                <el-button v-if="hasPermission('kubernetes:cluster:edit')" circle :icon="EditPen" size="default" @click="handleEdit(row)" />
              </el-tooltip>

              <el-tooltip v-if="hasPermission('kubernetes:cluster:edit')" content="更多" placement="top">
                <el-dropdown trigger="click">
                  <template #default>
                    <el-button circle :icon="MoreFilled" size="default" />
                  </template>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-if="hasPermission('kubernetes:cluster:edit')" @click="handleSelectCluster(row)">
                        <el-icon><View /></el-icon> 切换到该集群
                      </el-dropdown-item>
                      <el-dropdown-item v-if="hasPermission('kubernetes:cluster:delete')" divided @click="handleDelete(row)">
                        <el-icon><Delete /></el-icon> 删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-tooltip>
              <el-tooltip v-else-if="hasPermission('kubernetes:cluster:delete')" content="删除" placement="top">
                <el-button circle :icon="Delete" size="default" @click="handleDelete(row)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 表格底部 -->
      <div class="table-footer">
        <div>
          <BeeButton v-if="hasPermission('kubernetes:cluster:delete')" type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
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

    <!-- 批量删除 Dialog -->
    <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
      <div class="dialog-content">
        <p>
          确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个集群吗？
        </p>
        <div class="delete-cluster-tags">
          <BeeTag v-for="row in selectedRows" :key="row.id">
            {{ row.name }}
          </BeeTag>
        </div>
      </div>
    </BeeDialog>

    <!-- 单个删除 Dialog -->
    <BeeDialog v-model="deleteDialogVisible" title="确认删除" @confirm="handleConfirmDelete">
      <div class="dialog-content">
        <p>
          确定要删除集群 <strong>{{ currentTargetRow?.name }}</strong> 吗？
        </p>
      </div>
    </BeeDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Delete, Key, MoreFilled, Plus, Refresh, CircleCheck, Clock, EditPen, Grid, Link, Document, View } from '@element-plus/icons-vue'
import { type ClusterQueryReq, type ClusterResp } from '@/types'
import { getClusterPage, deleteCluster, batchDeleteCluster } from '@/api'
import { useKubernetesStore } from '@/stores'
import AuditCell from '@/components/AuditCell/index.vue'
import BeeAlert from '@/components/BeeAlert/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeeRadioSearch from '@/components/BeeRadioSearch/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import IconLabel from '@/components/IconLabel/index.vue'
import TextCopyableCell from '@/components/TextCopyableCell/index.vue'
import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'ClusterManage' })

// 权限校验
const { hasPermission } = usePermission()

const router = useRouter()
const kubernetesStore = useKubernetesStore()
const searchKey = ref('')

const loading = ref(false)
const tableData = ref<ClusterResp[]>([])
const selectedRows = ref<ClusterResp[]>([])
const batchDeleteDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentTargetRow = ref<ClusterResp | null>(null)
const queryForm = reactive<ClusterQueryReq>({
  id: undefined,
  name: undefined,
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
  { label: '正常', value: 1 },
  { label: '异常', value: 0 }
]

async function loadData() {
  loading.value = true
  try {
    const resp = await getClusterPage({ ...queryForm, page: pagination.page, pageSize: pagination.pageSize })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  const key = searchKey.value
  queryForm.id = key
  queryForm.name = key
  pagination.page = 1
  pagination.pageSize = 10
  loadData()
}

function handleSelect(selectValue?: string | number) {
  queryForm.status = selectValue as number | undefined
  pagination.page = 1
  pagination.pageSize = 10
  loadData()
}

function handleReset() {
  queryForm.id = undefined
  queryForm.name = undefined
  queryForm.status = undefined
  queryForm.page = 1
  queryForm.pageSize = 10
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  loadData()
}

function handleSelectionChange(rows: ClusterResp[]) {
  selectedRows.value = rows
}

function handleCreate() {
  router.push({ name: 'kubernetes:cluster:create' })
}

function handleEdit(row: ClusterResp) {
  router.push({ name: 'kubernetes:cluster:edit', query: { id: row.id } })
}

function handleSelectCluster(row: ClusterResp) {
  kubernetesStore.setActiveClusterId(row.id)
  router.push({ name: 'kubernetes:dashboard' })
}

function handleDelete(row: ClusterResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteCluster(currentTargetRow.value.id)
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
  const ids = selectedRows.value.map(row => row.id)
  try {
    await batchDeleteCluster(ids)
    ElMessage.success(`成功删除 ${ids.length} 个集群`)
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
.cluster-table {
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

    .el-button + .el-button,
    .el-button + .el-dropdown {
      margin-left: 8px;
    }
  }

  .api-server {
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

.delete-cluster-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
</style>
