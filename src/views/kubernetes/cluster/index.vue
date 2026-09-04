<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeePageHeader v-bind="CLUSTER_PAGE_META" />

    <!-- 页面 Body -->
    <BeeCard class="page-body">
      <!-- 工具栏 -->
      <div class="page-body__toolbar">
        <BeeInputSearch v-model="searchKey" class="page-body__toolbar-search" placeholder="按 UID / 名称搜索" />
        <BeeSelect
          v-model="queryForm.status"
          :menu-height="300"
          :options="CLUSTER_STATUS_OPTIONS"
          placeholder="状态筛选"
        />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <div v-if="perm.create" class="page-body__toolbar-separator"></div>
        <BeeButton v-if="perm.create" icon="kubernetes-register" type="primary" @click="handleRegister">
          纳管
        </BeeButton>
      </div>

      <!-- 表格 -->
      <div class="page-body__table">
        <BeeTable
          ref="tableRef"
          :data="tableData"
          :loading="loading"
          selectable
          @selection-change="handleSelectionChange"
        >
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <BeeClusterInfoCell :description="row.description" :name="row.name" :uid="row.uid" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :min-width="400">
            <template #default="{ row }">
              <BeeTableCommonCell subtext="API Server" :text="row.apiServer" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn prop="status" :width="160">
            <template #default="{ row }">
              <BeeStatusCell :options="CLUSTER_STATUS_OPTIONS" :status="row.status" :status-msg="row.statusMsg" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeTableCommonCell subtext="Kubernetes版本" :text="row.k8sVersion" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAuditCell :datetime="row.createAt" field-name="创建人 / 时间" :username="row.createBy" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAuditCell :datetime="row.updateAt" field-name="更新人 / 时间" :username="row.updateBy" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn fixed="right" :width="150">
            <template #default="{ row }">
              <BeeActionCell :actions="getActions(row)" />
            </template>
          </BeeTableColumn>
        </BeeTable>
      </div>

      <!-- 底部 -->
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
          v-model="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          @change="loadData"
        />
      </div>
    </BeeCard>

    <!-- 单个删除 Dialog -->
    <ClusterDeleteDialog
      v-model="deleteDialogVisible"
      :cluster="currentTargetRow?.name ?? ''"
      @confirm="handleConfirmDelete"
    />

    <!-- 批量删除 Dialog -->
    <ClusterBatchDeleteDialog
      v-model="batchDeleteDialogVisible"
      :delete-data="selectedRows"
      @confirm="handleConfirmBatchDelete"
    />
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { useRouter } from 'vue-router'

import type { ClusterListVo, ClusterQueryForm } from '@/types/kubernetes/cluster'

import { getClusterList, deleteCluster, deleteClusters } from '@/api/kubernetes/cluster'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeActionCell, { type ActionItem } from '@/components/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeClusterInfoCell from '@/components/BeeClusterInfoCell/index.vue'
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

import { usePermission } from '@/composables/usePermission'
import { CLUSTER_PAGE_META, CLUSTER_STATUS_OPTIONS } from '@/config/kubernetes/cluster'
import { useKubernetesStore } from '@/stores'

import ClusterBatchDeleteDialog from './components/ClusterBatchDeleteDialog.vue'
import ClusterDeleteDialog from './components/ClusterDeleteDialog.vue'

defineOptions({ name: 'ClusterPage' })

// ==================== Composables & Route & Store ====================
const { hasPermission } = usePermission()
const router = useRouter()
const kubernetesStore = useKubernetesStore()

// ==================== Reactive State ====================
// --- 查询条件
const searchKey = ref('')
const queryForm = reactive<Partial<ClusterQueryForm>>({})
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
// --- 表格数据
const loading = ref(false)
const tableData = ref<ClusterListVo[]>([])
const tableRef = ref<InstanceType<typeof BeeTable>>()
// --- 选中逻辑
const selectedRows = ref<ClusterListVo[]>([])
const deletableRows = computed(() => selectedRows.value.filter(row => row.deletable !== false))
// --- 对话框
const currentTargetRow = ref<ClusterListVo | null>(null)
const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)

// ==================== Permission ====================
/** 页面级权限缓存，避免模板/循环中重复调用 hasPermission */
const perm: Record<string, boolean> = {
  create: hasPermission('kubernetes:cluster:create'),
  edit: hasPermission('kubernetes:cluster:edit'),
  view: hasPermission('kubernetes:cluster:view'),
  delete: hasPermission('kubernetes:cluster:delete'),
}

// ==================== Data Loading ====================
/**
 * 请求集群列表数据
 */
async function loadData() {
  loading.value = true
  try {
    const resp = await getClusterList({
      ...queryForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = resp.list
    pagination.total = resp.total
  } catch (err) {
    console.error('[loadData]', err)
    BeeMessage.error('加载集群列表失败')
  } finally {
    loading.value = false
  }
}

// ==================== Row Actions Generate ====================
/**
 * 构建行操作数组
 * @param row - 当前行数据
 * @returns 操作项数组
 */
function getActions(row: ClusterListVo): ActionItem[] {
  const actions: ActionItem[] = []
  actions.push({
    value: 'switch',
    label: '切换集群',
    icon: 'kubernetes-switch',
    handler: () => handleSwitchCluster(row),
  })
  if (perm.edit) {
    actions.push({ value: 'edit', label: '编辑', icon: 'basic-edit', handler: () => handleEdit(row) })
  }
  if (perm.delete && row.deletable !== false) {
    actions.push({ value: 'delete', label: '删除', icon: 'basic-delete', handler: () => handleDelete(row) })
  }
  return actions
}

// ==================== BeeTable Handler ====================
/**
 * 表格选中行变化
 * @param rows
 * @remarks BeeTable 的 selection-change 事件固定返回 Record<string, unknown>[]，需通过 unknown 桥接断言为目标类型
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as ClusterListVo[]
}

// ==================== Handler ====================
/**
 * 搜索
 */
function handleSearch() {
  queryForm.uid = searchKey.value || undefined
  queryForm.name = searchKey.value || undefined
  pagination.page = 1
  void loadData()
}

/**
 * 重置搜索条件
 */
function handleReset() {
  queryForm.uid = undefined
  queryForm.name = undefined
  queryForm.status = undefined
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  void loadData()
}

/**
 * 纳管集群
 */
function handleRegister() {
  router.push({ name: 'kubernetes:cluster:register' }).catch(() => {})
}

/**
 * 切换集群
 * @param row
 */
function handleSwitchCluster(row: ClusterListVo) {
  kubernetesStore.setActiveClusterUid(row.uid)
  router.push({ name: 'kubernetes:dashboard', params: { clusterUid: row.uid } }).catch(() => {})
}

/**
 * 编辑集群
 * @param row
 */
function handleEdit(row: ClusterListVo) {
  router.push({ name: 'kubernetes:cluster:edit', params: { uid: row.uid } }).catch(() => {})
}

/**
 * 删除集群
 * @param row
 */
function handleDelete(row: ClusterListVo) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

/**
 * 批量删除集群
 */
function handleBatchDelete() {
  if (deletableRows.value.length === 0) {
    BeeMessage.warning('选中的集群均不可删除')
    return
  }
  batchDeleteDialogVisible.value = true
}

/**
 * 导出集群
 */
function handleExport() {
  BeeMessage.info('功能开发中')
}

/**
 * 导入集群
 */
function handleImport() {
  BeeMessage.info('功能开发中')
}

/** 取消全部选中 */
function handleClearSelection() {
  tableRef.value?.clearSelection()
}

// ==================== Dialog Confirm ====================
/**
 * 二次确认删除集群
 */
async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteCluster(currentTargetRow.value.uid)
    BeeMessage.success('删除成功')
    currentTargetRow.value = null
    void loadData()
  } catch (err) {
    console.error('[handleConfirmDelete]', err)
    BeeMessage.error('删除失败')
  }
}

/**
 * 二次确认批量删除集群
 */
async function handleConfirmBatchDelete() {
  if (deletableRows.value.length === 0) return
  const uids = deletableRows.value.map(row => row.uid)
  try {
    await deleteClusters(uids)
    BeeMessage.success(`成功删除 ${uids.length} 个集群`)
    batchDeleteDialogVisible.value = false
    selectedRows.value = []
    tableRef.value?.clearSelection()
    void loadData()
  } catch (err) {
    console.error('[handleConfirmBatchDelete]', err)
    BeeMessage.error('删除失败')
  }
}

// ==================== Lifecycle ====================
onMounted(() => {
  // 已有选中集群时，直接跳转到集群概览
  if (kubernetesStore.activeClusterUid) {
    router
      .push({ name: 'kubernetes:dashboard', params: { clusterUid: kubernetesStore.activeClusterUid } })
      .catch(() => {})
    return
  }
  void loadData()
})
</script>

<style lang="scss" scoped>
@use 'sass:map';

.page-body {
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex: 1;
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
      align-items: center;
    }
  }
}
</style>
