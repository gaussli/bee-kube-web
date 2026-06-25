<template>
  <BeePage class="cluster-page">
    <!-- 页面标题 -->
    <BeeCard class="cluster-page__header">
      <BeeAlert type="primary" label="在进行集群管理之前，需要先选择一个集群。" />
      <BeePageTitle icon="kubernetes-cluster" title="集群管理" description="对多集群以及每个集群的基础资源、服务组件及相关应用资源等的统一管理。" />
    </BeeCard>

    <!-- 页面内容 -->
    <BeeCard class="cluster-page__body">
      <!-- 查询表单 -->
      <div class="table-toolbar">
        <BeeInputSearch v-model="searchKey" placeholder="按 ID / 名称 搜索" class="table-toolbar__search" />
        <BeeSelect v-model="queryForm.status" :options="CLUSTER_STATUS_CONFIG" placeholder="状态筛选" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <BeeDivider v-if="hasPermission('kubernetes:cluster:create')" direction="vertical" length="12px" />
        <BeeButton v-if="hasPermission('kubernetes:cluster:create')" type="primary" icon="basic-create" @click="handleCreate"> 纳管 </BeeButton>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <BeeTable :data="tableData" :loading="loading" selectable @selection-change="handleSelectionChange">
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <BeeClusterInfoCell :name="row.name" :id="row.id" :description="row.description" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :min-width="300">
            <template #default="{ row }">
              <BeeTableCommonCell :text="row.apiServer" subtext="API Server" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn prop="status" :width="100">
            <template #default="{ row }">
              <BeeStatusCell :config="CLUSTER_STATUS_CONFIG" :status="row.status" :status-msg="row.statusMsg" />
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
                <BeeCircleButton v-if="hasPermission('kubernetes:cluster:edit')" icon="basic-edit" tooltip="编辑" @click="handleEdit(row)" />
                <BeeCircleButton v-if="hasPermission('kubernetes:cluster:edit')" icon="basic-switch" tooltip="切换集群" @click="handleSelectCluster(row)" />
                <BeeCircleButton v-if="hasPermission('kubernetes:cluster:delete')" icon="basic-delete" type="danger" tooltip="删除" @click="handleDelete(row)" />
              </div>
            </template>
          </BeeTableColumn>
        </BeeTable>
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
      <div class="batch-delete-dialog__content">
        <p>
          确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个集群吗？
        </p>
        <div class="batch-delete-dialog__tags">
          <BeeTag v-for="row in selectedRows" :key="row.id" size="small">
            {{ row.name }}
          </BeeTag>
        </div>
      </div>
    </BeeDialog>

    <!-- 单个删除 Dialog -->
    <BeeDialog v-model="deleteDialogVisible" title="确认删除" @confirm="handleConfirmDelete">
      确定要删除集群 <strong>{{ currentTargetRow?.name }}</strong> 吗？
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
/**
 * Kubernetes 集群管理页面
 * 支持集群的查看、搜索、纳管、编辑、切换及删除等操作
 * @module views/kubernetes/cluster
 */
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { ClusterListResp, ClusterQueryReq } from '@/types/kubernetes/cluster'
import { getClusterPage, deleteCluster, deleteClusters } from '@/api/kubernetes/cluster'
import BeeAlert from '@/components/BeeAlert/index.vue'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeCircleButton from '@/components/BeeCircleButton/index.vue'
import BeeClusterInfoCell from '@/components/BeeClusterInfoCell/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
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
import { usePermission } from '@/composables/usePermission'
import { CLUSTER_STATUS_CONFIG } from '@/config/kubernetes'
import { useKubernetesStore } from '@/stores'

defineOptions({ name: 'ClusterManage' })

// ---- 权限 & 路由 ----
const { hasPermission } = usePermission()
const router = useRouter()
const kubernetesStore = useKubernetesStore()

// ---- 查询 & 分页 ----
const searchKey = ref('')
const queryForm = reactive<Partial<ClusterQueryReq>>({
  id: undefined,
  name: undefined,
  status: undefined
})
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

// ---- 表格数据 ----
const loading = ref(false)
const tableData = ref<ClusterListResp[]>([])
const selectedRows = ref<ClusterListResp[]>([])

// ---- 删除 Dialog ----
const batchDeleteDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentTargetRow = ref<ClusterListResp | null>(null)

/**
 * 加载集群分页数据
 */
async function loadData() {
  loading.value = true
  try {
    const resp = await getClusterPage({
      ...queryForm,
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
 */
function handleSearch() {
  const key = searchKey.value
  queryForm.id = key
  queryForm.name = key
  pagination.page = 1
  loadData()
}

/**
 * 重置搜索条件
 */
function handleReset() {
  queryForm.id = undefined
  queryForm.name = undefined
  queryForm.status = undefined
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  loadData()
}

/**
 * 表格选中行变化
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as ClusterListResp[]
}

/**
 * 跳转纳管页面
 */
function handleCreate() {
  router.push({ name: 'kubernetes:cluster:create' })
}

/**
 * 跳转编辑页面
 */
function handleEdit(row: ClusterListResp) {
  router.push({ name: 'kubernetes:cluster:edit', query: { id: row.id } })
}

/**
 * 切换集群
 */
function handleSelectCluster(row: ClusterListResp) {
  kubernetesStore.setActiveClusterId(row.id)
  router.push({ name: 'kubernetes:dashboard' })
}

/**
 * 打开删除确认 Dialog
 */
function handleDelete(row: ClusterListResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

/**
 * 确认单个删除
 */
async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteCluster(currentTargetRow.value.id)
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
    currentTargetRow.value = null
    loadData()
  } catch {
    // 删除失败，接口层已提示
  }
}

/**
 * 打开批量删除确认 Dialog
 */
function handleBatchDelete() {
  batchDeleteDialogVisible.value = true
}

/**
 * 确认批量删除
 */
async function handleConfirmBatchDelete() {
  const ids = selectedRows.value.map(row => row.id)
  try {
    await deleteClusters(ids)
    ElMessage.success(`成功删除 ${ids.length} 个集群`)
    batchDeleteDialogVisible.value = false
    selectedRows.value = []
    loadData()
  } catch {
    // 删除失败，接口层已提示
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.cluster-page {
  .cluster-page__header {
    .bee-alert {
      margin-top: $spacing-16;
    }
  }

  .cluster-page__body {
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

// ==================== 批量删除 Dialog ====================
.batch-delete-dialog__content {
  display: flex;
  gap: $spacing-8;
  flex-direction: column;
}

.batch-delete-dialog__tags {
  display: flex;
  gap: $spacing-8;
  flex-wrap: wrap;
}
</style>
