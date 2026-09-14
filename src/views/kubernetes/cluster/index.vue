<!--
  ClusterPage 集群管理列表页

  展示平台纳管的所有 Kubernetes 集群（名称 / API Server / 状态 / 版本 / 审计信息），支持按 UID / 名称搜索、
  按状态筛选，并提供纳管、编辑、切换集群与删除（单个 / 批量）操作。

  进入页面时若 Pinia 中已存在激活集群，则直接跳转集群概览而不加载列表；行数据 `deletable` 为 false 的集群不可删除。
-->
<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeePageHeader v-bind="CLUSTER_PAGE_META" />

    <!-- 页面 Body -->
    <BeeCard class="page-body">
      <!-- 工具栏 -->
      <div class="page-body__toolbar">
        <BeeInputSearch v-model="searchKey" class="page-body__toolbar-search" placeholder="按 UID / 名称搜索" />
        <BeeSelect v-model="queryForm.status" :options="CLUSTER_STATUS_OPTIONS" placeholder="状态筛选" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <div v-if="perm.create" class="page-body__toolbar-separator"></div>
        <BeeButton v-if="perm.create" icon="kubernetes-register" type="primary" @click="handleRegister">纳管</BeeButton>
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
          <!-- 集群信息列：图标 + UID + 名称（可复制）+ 描述 -->
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <BeeClusterInfoCell :description="row.description" :name="row.name" :uid="row.uid" />
            </template>
          </BeeTableColumn>
          <!-- API Server 地址列 -->
          <BeeTableColumn :min-width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="row.apiServer" sublabel="API Server" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn prop="status" :width="160">
            <template #default="{ row }">
              <BeeStatusCell :options="CLUSTER_STATUS_OPTIONS" :status="row.status" :status-msg="row.statusMsg" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeTableCommonCell :label="row.k8sVersion" sublabel="Kubernetes 版本" />
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
          <!-- 操作列：依据权限与集群是否可删除动态生成操作项 -->
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

    <!-- 单个删除 Dialog -->

    <BeeDialog
      v-model="deleteDialogVisible"
      icon="basic-delete"
      title="删除集群"
      type="danger"
      @confirm="handleConfirmDelete"
    >
      <span>
        您确认要删除 <strong>{{ selectedRow?.name || '' }}</strong> 集群吗？
      </span>
    </BeeDialog>

    <!-- 批量删除 Dialog -->

    <BeeDialog
      v-model="batchDeleteDialogVisible"
      icon="basic-delete"
      title="批量删除集群"
      type="danger"
      @confirm="handleConfirmBatchDelete"
    >
      <BeeBatchDeleteDialogContent :delete-data="selectedRows" resource-type="集群" />
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
/**
 * ClusterPage 集群管理列表页
 * @module views/kubernetes/cluster
 * @description 列表页容器：负责筛选、分页、行操作与纳管 / 删除弹窗，列表数据来自 getClusterList
 */
import { computed, onMounted, reactive, ref } from 'vue'

import { useRouter } from 'vue-router'

import type { ClusterListVo, ClusterQueryForm } from '@/types/kubernetes/cluster'

import { getClusterList, deleteCluster, deleteClusters } from '@/api/kubernetes/cluster'

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

import { usePermission } from '@/composables/usePermission'
import { CLUSTER_PAGE_META, CLUSTER_STATUS_OPTIONS } from '@/config/kubernetes/cluster'
import { useKubernetesStore } from '@/stores'

import BeeClusterInfoCell from './components/ClusterInfoCell.vue'

defineOptions({ name: 'ClusterPage' })

// ==================== Composables & Route & Store ====================
const { hasPermission } = usePermission()
const router = useRouter()
const kubernetesStore = useKubernetesStore()

// ==================== Reactive State ====================
// --- 查询条件
/** 搜索关键词，提交时同时映射到 uid / name 两个查询字段 */
const searchKey = ref('')
/** 除搜索外的筛选条件（如状态） */
const queryForm = reactive<Partial<ClusterQueryForm>>({})
/** 分页参数，与 BeePagination 双向绑定 */
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
// --- 表格数据
/** BeeTable 实例引用，用于批量操作后清空选中 */
const tableRef = ref<InstanceType<typeof BeeTable>>()
/** 列表加载态 */
const loading = ref(false)
/** 列表数据 */
const tableData = ref<ClusterListVo[]>([])
// --- 选中数据
/** 当前操作的行数据，供单个删除弹窗取值 */
const selectedRow = ref<ClusterListVo | null>(null)
/** 表格多选结果，用于批量删除 */
const selectedRows = ref<ClusterListVo[]>([])
/** 选中行中允许删除的子集（后端可用 deletable 标记禁止删除） */
const deletableRows = computed(() => selectedRows.value.filter(row => row.deletable !== false))
// --- 对话框
/** 单个删除弹窗显隐 */
const deleteDialogVisible = ref(false)
/** 批量删除弹窗显隐 */
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
 * @remarks 请求失败时不向上抛出，仅在控制台记录并通过 BeeMessage 提示，同时复位加载态
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
 * @param rows - 当前选中的行数组
 * @remarks BeeTable 的 selection-change 事件固定返回 Record<string, unknown>[]，需通过 unknown 桥接断言为目标类型
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as ClusterListVo[]
}

// ==================== Handlers ====================
/**
 * 搜索
 * @remarks 将 searchKey 同时映射到 uid / name 两个查询字段，并重置页码
 */
function handleSearch() {
  queryForm.uid = searchKey.value || undefined
  queryForm.name = searchKey.value || undefined
  pagination.page = 1
  void loadData()
}

/**
 * 重置搜索条件
 * @remarks 清空所有筛选字段、搜索关键词、分页参数，重新加载数据
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
 * @remarks 写入 Pinia 激活集群后跳转集群概览
 * @param row - 当前行数据
 */
function handleSwitchCluster(row: ClusterListVo) {
  kubernetesStore.setActiveClusterUid(row.uid)
  router.push({ name: 'kubernetes:dashboard', params: { clusterUid: row.uid } }).catch(() => {})
}

/**
 * 编辑集群
 * @remarks 跳转到集群编辑页
 * @param row - 当前行数据
 */
function handleEdit(row: ClusterListVo) {
  router.push({ name: 'kubernetes:cluster:edit', params: { uid: row.uid } }).catch(() => {})
}

/**
 * 删除集群
 * @remarks 记录当前行并打开单个删除弹窗，实际删除由弹窗确认后触发
 * @param row - 当前行数据
 */
function handleDelete(row: ClusterListVo) {
  selectedRow.value = row
  deleteDialogVisible.value = true
}

/**
 * 批量删除集群
 * @remarks 仅提交 deletableRows，若选中的集群全部不可删除则给出提示并中止
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
 * @remarks 功能尚未实现，仅占位提示
 */
function handleExport() {
  BeeMessage.info('功能开发中')
}

/**
 * 导入集群
 * @remarks 功能尚未实现，仅占位提示
 */
function handleImport() {
  BeeMessage.info('功能开发中')
}

/** 清空表格全部选中 */
function handleClearSelection() {
  tableRef.value?.clearSelection()
}

// ==================== Dialog Confirm ====================
/**
 * 二次确认删除集群
 * @remarks 弹窗关闭由 dialog 自身控制，成功后仅复位选中行并刷新列表
 */
async function handleConfirmDelete() {
  if (!selectedRow.value) return
  try {
    await deleteCluster(selectedRow.value.uid)
    BeeMessage.success('删除成功')
    selectedRow.value = null
    void loadData()
  } catch (err) {
    console.error('[handleConfirmDelete]', err)
    BeeMessage.error('删除失败')
  }
}

/**
 * 二次确认批量删除集群
 * @remarks 按 deletableRows 的 uid 批量提交，成功后关闭弹窗并清空表格选中态
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
