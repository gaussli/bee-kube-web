<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeePageHeader v-bind="NAMESPACE_PAGE_META" />

    <!-- 页面 Body -->
    <BeeCard class="page-body">
      <!-- 工具栏 -->
      <div class="page-body__toolbar">
        <BeeInputSearch v-model="searchKey" class="page-body__toolbar-search" placeholder="按 UID / 名称搜索" />
        <BeeSelect v-model="queryForm.status" :options="NAMESPACE_STATUS_OPTIONS" placeholder="状态筛选" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <div v-if="perm.create" class="page-body__toolbar-seperator"></div>
        <BeeButton v-if="perm.create" icon="basic-create" type="primary" @click="handleCreate"> 新增 </BeeButton>
        <BeeButton v-if="perm.create" icon="basic-create" type="primary" @click="handleCreateYaml"> YAML </BeeButton>
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
          <!-- 命名空间信息列 -->
          <BeeTableColumn :min-width="500">
            <template #default="{ row }">
              <NamespaceInfoCell :description="row.description" :name="row.name" :uid="row.uid" />
            </template>
          </BeeTableColumn>
          <!-- 状态列 -->
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeStatusCell :options="NAMESPACE_STATUS_OPTIONS" :status="row.status" :status-msg="row.statusMsg" />
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

    <!-- 单个删除 Dialog -->
    <BeeDialog
      v-model="deleteDialogVisible"
      icon="basic-delete"
      title="删除命名空间"
      type="danger"
      @confirm="handleConfirmDelete"
    >
      <span>
        您确认要删除 <strong>{{ selectedRow?.name || '' }}</strong> 命名空间吗？
      </span>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog
      v-model="batchDeleteDialogVisible"
      icon="basic-delete"
      title="批量删除命名空间"
      type="danger"
      @confirm="handleConfirmBatchDelete"
    >
      <BeeBatchDeleteDialogContent :delete-data="selectedRows" resource-type="命名空间" />
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { NamespaceListVo, NamespaceQueryForm } from '@/types/kubernetes/namespace'

import type { ActionItem } from '@/components/business/BeeActionCell/index.vue'

import { getNamespaceList, deleteNamespace, deleteNamespaces } from '@/api/kubernetes/namespace/namespace'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeDialog from '@/components/base/BeeDialog/index.vue'
import BeeInputSearch from '@/components/base/BeeInputSearch/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeeSelect from '@/components/base/BeeSelect/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeActionCell from '@/components/business/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/business/BeeAuditCell/index.vue'
import BeeBatchDeleteDialogContent from '@/components/business/BeeDialogContent/BeeBatchDeleteDialogContent.vue'
import BeePageHeader from '@/components/business/BeePageHeader/index.vue'
import BeeStatusCell from '@/components/business/BeeStatusCell/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { usePermission } from '@/composables/usePermission'
import { NAMESPACE_PAGE_META, NAMESPACE_STATUS_OPTIONS } from '@/config/kubernetes/namespace'
import { useKubernetesStore } from '@/stores'

import NamespaceInfoCell from './components/NamespaceInfoCell/index.vue'

defineOptions({ name: 'NamespaceManage' })

// ==================== Composables & Route & Store ====================
const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()

/** 当前集群 UID */
const clusterUid = computed(() => (route.params.clusterUid as string) || useKubernetesStore().activeClusterUid || '')

// ==================== Reactive State ====================
// --- 查询条件
/** 搜索关键词 */
const searchKey = ref('')
/** 查询条件 */
const queryForm = reactive<Partial<NamespaceQueryForm>>({})
/** 分页条件请求 / 响应 */
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
// --- 表格数据
/** BeeTable 实例引用 */
const tableRef = ref<InstanceType<typeof BeeTable>>()
/** 列表加载态 */
const loading = ref(false)
/** 列表数据 */
const tableData = ref<NamespaceListVo[]>([])
// --- 选中逻辑
/** 当前行数据 */
const selectedRow = ref<NamespaceListVo | null>(null)
/** 多选选中数据 */
const selectedRows = ref<NamespaceListVo[]>([])
// --- 对话框
/** 单个删除弹框显隐 */
const deleteDialogVisible = ref(false)
/** 批量删除弹框显隐 */
const batchDeleteDialogVisible = ref(false)

// ==================== Computed ====================
/** 多选选中数据中可删除列表 */
const deletableRows = computed(() => selectedRows.value.filter(row => row.deletable !== false))

// ==================== Permission ====================
/** 页面级权限缓存，避免模板/循环中重复调用 hasPermission */
const perm: Record<string, boolean> = {
  create: hasPermission('kubernetes:namespace:create'),
  edit: hasPermission('kubernetes:namespace:edit'),
  view: hasPermission('kubernetes:namespace:view'),
  delete: hasPermission('kubernetes:namespace:delete'),
}

// ==================== Data Loading ====================
/**
 * 请求命名空间列表数据
 */
async function loadData() {
  tableRef.value?.clearSelection()
  if (!clusterUid.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const { list, total } = await getNamespaceList(clusterUid.value, {
      ...queryForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = list as NamespaceListVo[]
    pagination.total = total
  } catch (err) {
    console.error('[loadData]', err)
    BeeMessage.error('加载命名空间列表失败')
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
function getActions(row: NamespaceListVo): ActionItem[] {
  const actions: ActionItem[] = []
  if (perm.view) {
    actions.push({ value: 'view', label: '详情', icon: 'basic-view', handler: () => handleViewDetail(row) })
  }
  if (perm.edit) {
    actions.push(
      { value: 'edit', label: '编辑', icon: 'basic-edit', handler: () => handleEdit(row) },
      { value: 'labels', label: '配置标签', icon: 'kubernetes-label', handler: () => handleLabels(row) },
      { value: 'annotations', label: '配置注解', icon: 'kubernetes-annotation', handler: () => handleAnnotations(row) },
      {
        value: 'resourcequota',
        label: '资源配额',
        icon: 'kubernetes-resource-quota',
        handler: () => handleResourceQuota(row),
      },
      { value: 'limitrange', label: '资源限制', icon: 'kubernetes-limit-range', handler: () => handleLimitRange(row) },
    )
  }
  if (perm.delete && row.deletable) {
    actions.push({ value: 'delete', label: '删除', icon: 'basic-delete', handler: () => handleDelete(row) })
  }
  return actions
}

// ==================== BeeTable Handler ====================
/**
 * 表格选中行变化
 * @param rows - 当前选中的行数组
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as NamespaceListVo[]
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
 * 创建命名空间
 */
function handleCreate() {
  router.push({ name: 'kubernetes:namespace:create', params: { clusterUid: clusterUid.value } }).catch(() => {})
}

/**
 * 创建命名空间（YAML）
 * @remarks 功能开发中，路由尚未实现
 */
function handleCreateYaml() {
  BeeMessage.info('功能开发中')
}

/**
 * 查看命名空间详情
 * @param row
 */
function handleViewDetail(row: NamespaceListVo) {
  router
    .push({ name: 'kubernetes:namespace:detail', params: { clusterUid: clusterUid.value, name: row.name } })
    .catch(() => {})
}

/**
 * 编辑命名空间
 * @param row
 */
function handleEdit(row: NamespaceListVo) {
  router
    .push({ name: 'kubernetes:namespace:edit', params: { clusterUid: clusterUid.value, name: row.name } })
    .catch(() => {})
}

/**
 * 配置命名空间标签
 * @param row
 */
function handleLabels(row: NamespaceListVo) {
  router
    .push({ name: 'kubernetes:namespace:label', params: { clusterUid: clusterUid.value, name: row.name } })
    .catch(() => {})
}

/**
 * 配置命名空间注解
 * @param row
 */
function handleAnnotations(row: NamespaceListVo) {
  router
    .push({ name: 'kubernetes:namespace:annotation', params: { clusterUid: clusterUid.value, name: row.name } })
    .catch(() => {})
}

/**
 * 查看命名空间的资源配额
 * @param row
 */
function handleResourceQuota(row: NamespaceListVo) {
  router
    .push({ name: 'kubernetes:resourcequota:list', query: { clusterUid: clusterUid.value, namespace: row.name } })
    .catch(() => {})
}

/**
 * 查看命名空间的资源限制
 * @param row
 */
function handleLimitRange(row: NamespaceListVo) {
  router
    .push({ name: 'kubernetes:limitrange:list', query: { clusterUid: clusterUid.value, namespace: row.name } })
    .catch(() => {})
}

/**
 * 删除命名空间
 * @param row
 */
function handleDelete(row: NamespaceListVo) {
  selectedRow.value = row
  deleteDialogVisible.value = true
}

/**
 * 批量删除命名空间
 */
function handleBatchDelete() {
  if (deletableRows.value.length === 0) {
    BeeMessage.warning('选中的命名空间均不可删除')
    return
  }
  batchDeleteDialogVisible.value = true
}

/**
 * 导出命名空间
 */
function handleExport() {
  BeeMessage.info('功能开发中')
}

/**
 * 导入命名空间
 */
function handleImport() {
  BeeMessage.info('功能开发中')
}

/** 清空选中数据 */
function handleClearSelection() {
  tableRef.value?.clearSelection()
}

// ==================== Dialog Confirm ====================
/**
 * 二次确认删除命名空间
 */
async function handleConfirmDelete() {
  if (!selectedRow.value) return
  try {
    await deleteNamespace(clusterUid.value, selectedRow.value.name)
    BeeMessage.success(`成功删除命名空间【${selectedRow.value.name}】`)
    selectedRow.value = null
    await loadData()
  } catch (err) {
    console.error('[handleConfirmDelete]', err)
    BeeMessage.error('删除失败')
  }
}

/**
 * 二次确认批量删除命名空间
 */
async function handleConfirmBatchDelete() {
  if (deletableRows.value.length === 0) return
  const uids = deletableRows.value.map(row => row.uid)
  try {
    await deleteNamespaces(clusterUid.value, uids)
    BeeMessage.success(`成功删除 ${uids.length} 个命名空间`)
    selectedRows.value = []
    tableRef.value?.clearSelection()
    await loadData()
  } catch (err) {
    console.error('[handleConfirmBatchDelete]', err)
    BeeMessage.error('批量删除失败')
  }
}

// ==================== Lifecycle ====================
onMounted(() => {
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

    &-seperator {
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
