<template>
  <BeePage class="cluster-page">
    <!-- 页面标题 -->
    <BeeCard class="page-header">
      <BeeAlert type="primary" label="在进行集群管理之前，需要先选择一个集群。" />
      <BeePageTitle icon="kubernetes-cluster" title="集群管理" description="对多集群以及每个集群的基础资源、服务组件及相关应用资源等的统一管理。" />
    </BeeCard>

    <!-- 页面内容 -->
    <BeeCard class="page-body">
      <!-- 查询表单 -->
      <div class="table-query">
        <div class="table-query-left">
          <BeeInputSearch v-model="searchKey" placeholder="按 ID / 名称 搜索" @search="handleSearch" />
          <BeeSegmentedControl v-model="queryForm.status" :options="statusOptions" @select="handleSelect" />
        </div>
        <div class="table-query-right">
          <BeeButton icon="basic-refresh" @click="handleReset"> 刷新 </BeeButton>
          <BeeDivider v-if="hasPermission('kubernetes:cluster:create')" direction="vertical" length="12px" />
          <BeeButton v-if="hasPermission('kubernetes:cluster:create')" type="primary" icon="basic-create" @click="handleCreate"> 新增 </BeeButton>
        </div>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <el-table v-loading="loading" :data="tableData" height="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="60" align="center" />
          <el-table-column prop="id" width="280" class-name="bee-table-cell-id">
            <template #header>
              <BeeIconLabel icon="basic-id" label="ID" :size="tableHeaderFontSize" :color="tableHeaderColor" :font-weight="tableHeaderFontWeight" />
            </template>
            <template #default="{ row }">
              <BeeLabelCopyable :label="row.id" />
            </template>
          </el-table-column>
          <el-table-column width="300" class-name="bee-table-cell-name">
            <template #header>
              <BeeIconLabel icon="kubernetes-cluster" label="名称" :size="tableHeaderFontSize" :color="tableHeaderColor" :font-weight="tableHeaderFontWeight" />
            </template>
            <template #default="{ row }">
              <BeeLabelGroup :mainLabel="row.name" :subLabel="row.description" subIcon="basic-description" :subColor="color.textSecondary" />
            </template>
          </el-table-column>
          <el-table-column min-width="260">
            <template #header>
              <BeeIconLabel icon="basic-url" label="API Server" :size="tableHeaderFontSize" :color="tableHeaderColor" :font-weight="tableHeaderFontWeight" />
            </template>
            <template #default="{ row }">
              {{ row.apiServer }}
            </template>
          </el-table-column>
          <el-table-column prop="status" width="100">
            <template #header>
              <BeeIconLabel icon="basic-status" label="状态" :size="tableHeaderFontSize" :color="tableHeaderColor" :font-weight="tableHeaderFontWeight" />
            </template>
            <template #default="{ row }">
              <BeeStatus :status="row.status" :config="ClusterStatusConfig" />
            </template>
          </el-table-column>
          <el-table-column width="180">
            <template #header>
              <BeeIconLabel icon="basic-audit" label="创建" :size="tableHeaderFontSize" :color="tableHeaderColor" :font-weight="tableHeaderFontWeight" />
            </template>
            <template #default="{ row }">
              <AuditCell :user="row.createBy" :time="row.createAt" />
            </template>
          </el-table-column>
          <el-table-column width="180">
            <template #header>
              <BeeIconLabel icon="basic-audit" label="更新" :size="tableHeaderFontSize" :color="tableHeaderColor" :font-weight="tableHeaderFontWeight" />
            </template>
            <template #default="{ row }">
              <AuditCell :user="row.updateBy" :time="row.updateAt" />
            </template>
          </el-table-column>
          <el-table-column width="150" fixed="right" class-name="bee-table-cell-operation">
            <template #header>
              <BeeIconLabel icon="basic-operation" label="操作" :size="tableHeaderFontSize" :color="tableHeaderColor" :font-weight="tableHeaderFontWeight" />
            </template>
            <template #default="{ row }">
              <BeeCircleButton v-if="hasPermission('kubernetes:cluster:edit')" icon="basic-edit" type="info" tooltip="编辑" @click="handleEdit(row)" />
              <BeeCircleButton v-if="hasPermission('kubernetes:cluster:edit')" icon="basic-switch" type="info" tooltip="切换集群" @click="handleSelectCluster(row)" />
              <BeeCircleButton v-if="hasPermission('kubernetes:cluster:delete')" icon="basic-delete" type="danger" tooltip="删除" @click="handleDelete(row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 表格底部 -->
      <div class="table-footer">
        <div>
          <BeeButton v-if="hasPermission('kubernetes:cluster:delete')" type="danger" icon="basic-delete" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            批量删除 ({{ selectedRows.length }})
          </BeeButton>
        </div>
        <BeePagination v-model="pagination.page" v-model:pageSize="pagination.pageSize" :total="pagination.total" :page-sizes="[10, 20, 50]" @change="loadData" />
      </div>
    </BeeCard>

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
  </BeePage>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { ClusterQueryReq, ClusterResp } from '@/types/kubernetes/cluster'
import { getClusterPage, deleteCluster, deleteClusters } from '@/api/kubernetes/cluster'
import AuditCell from '@/components/AuditCell/index.vue'
import BeeAlert from '@/components/BeeAlert/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCircleButton from '@/components/BeeCircleButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import BeeIconLabel from '@/components/BeeIconLabel/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeeLabelCopyable from '@/components/BeeLabelCopyable/index.vue'
import BeeLabelGroup from '@/components/BeeLabelGroup/index.vue'
import BeePage from '@/components/BeePage/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeSegmentedControl from '@/components/BeeSegmentedControl/index.vue'
import BeeStatus from '@/components/BeeStatus/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import { usePermission } from '@/composables/usePermission'
import { color } from '@/config/color'
import { ClusterStatusConfig } from '@/config/kubernetes'
import { useKubernetesStore } from '@/stores'

defineOptions({ name: 'ClusterManage' })

// 权限校验
const { hasPermission } = usePermission()

const router = useRouter()
const kubernetesStore = useKubernetesStore()

const tableHeaderFontSize = ref<string>('14px')
const tableHeaderColor = ref<string>('#7e8184')
const tableHeaderFontWeight = ref<number>(400)

const loading = ref(false)

const searchKey = ref('')
const tableData = ref<ClusterResp[]>([])
const selectedRows = ref<ClusterResp[]>([])
const batchDeleteDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentTargetRow = ref<ClusterResp | null>(null)
const queryForm = reactive<Partial<ClusterQueryReq>>({
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
    await deleteClusters(ids)
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
.cluster-page {
  .page-header {
    .bee-alert {
      margin-top: $spacing-16;
    }
  }

  .page-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;

    .table-query {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $spacing-16 0;

      .table-query-left {
        display: flex;
        gap: $spacing-8;
        flex-direction: row;
        align-items: center;
      }

      .table-query-right {
        display: flex;
        gap: $spacing-8;
        flex-direction: row;
        align-items: center;
      }
    }

    .table-body {
      flex: 1;
      min-height: 0;

      :deep(.el-table) {
        height: 100%;

        th.el-table__cell {
          padding: $spacing-16 0;
        }

        .el-table__body-wrapper {
          .bee-table-cell-id {
            font-family: monospace;
          }

          .bee-table-cell-name {
            .bee-icon-label__label {
              max-width: 250px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .bee-table-cell-operation {
            .cell {
              display: flex;
              gap: $spacing-8;
              flex-direction: row;
            }
          }
        }
      }
    }

    .table-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $spacing-16 0;
    }
  }
}
</style>
