<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeePageHeader v-bind="STATEFULSET_PAGE_META" />

    <!-- 页面 Body -->
    <BeeCard class="page-body">
      <!-- 工具栏 -->
      <div class="page-body__toolbar">
        <BeeInputSearch v-model="searchKey" class="page-body__toolbar-search" placeholder="按 UID / 名称搜索" />
        <BeeSelect
          v-model="queryForm.namespace"
          :menu-height="300"
          :options="namespaceOptions"
          placeholder="命名空间筛选"
          :width="300"
        />
        <BeeSelect
          v-model="queryForm.status"
          :menu-height="300"
          :options="STATEFULSET_STATUS_OPTIONS"
          placeholder="状态筛选"
        />
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
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <BeeWorkloadInfoCell
                :description="row.description"
                icon="kubernetes-statefulset"
                :name="row.name"
                :uid="row.uid"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell subtext="命名空间" :text="row.namespace" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeStatusCell :options="STATEFULSET_STATUS_OPTIONS" :status="row.status" :status-msg="row.statusMsg" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="120">
            <template #default="{ row }">
              <BeeTableCommonCell subtext="副本数" :text="`${row.readyReplicas} / ${row.replicas}`" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeTableCommonCell
                :subtext="row.updateStrategyType"
                :text="
                  (STATEFULSET_UPDATE_STRATEGY_LABEL_MAP as Record<string, string>)[row.updateStrategyType] ||
                  row.updateStrategyType
                "
              />
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

      <!-- 底栏 -->
      <div class="page-body__footer">
        <div class="page-body__footer-actions">
          <BeeButton :disabled="selectedRows.length === 0" @click="handleClearSelection"> 取消选择 </BeeButton>
          <BeeButton v-if="perm.delete" :disabled="selectedRows.length === 0" type="danger" @click="handleBatchDelete">
            批量删除 ({{ selectedRows.length }})
          </BeeButton>
          <BeeButton v-if="perm.view" icon="basic-create" @click="handleExport"> 导出 </BeeButton>
          <BeeButton v-if="perm.create" icon="basic-create" @click="handleImport"> 导入 </BeeButton>
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
    <BeeDialog v-model="deleteDialogVisible" title="确认删除" @confirm="handleConfirmDelete">
      <div class="dialog-content">
        <p>
          确定要删除 StatefulSet <strong>{{ currentTargetRow?.name }}</strong> 吗？
        </p>
      </div>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
      <div class="dialog-content">
        <template v-if="nonDeletableRows.length > 0">
          <p class="dialog-content__warning">
            共选中 {{ selectedRows.length }} 个 StatefulSet，但以下 {{ nonDeletableRows.length }} 个 StatefulSet
            不可删除，将从列表忽略：
          </p>
          <div class="delete-dialog-tags">
            <BeeTag v-for="row in nonDeletableRows" :key="row.uid" type="warning">
              {{ row.name }}
            </BeeTag>
          </div>
        </template>
        <p v-if="deletableRows.length > 0">
          确定要删除选中的 <strong>{{ deletableRows.length }}</strong> 个 StatefulSet 吗？
        </p>
        <p v-else class="dialog-content__warning">所有选中的 StatefulSet 均不可删除。</p>
        <div v-if="deletableRows.length > 0" class="delete-dialog-tags">
          <BeeTag v-for="row in deletableRows" :key="row.uid">
            {{ row.name }}
          </BeeTag>
        </div>
      </div>
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
/**
 * StatefulSet 管理页面
 * @module views/kubernetes/workload/statefulset
 */
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { StatefulSetQueryForm, StatefulSetListVo } from '@/types/kubernetes/workload/types'

import { getNamespaceList } from '@/api/kubernetes/namespace/namespace'
import { getStatefulSetList, deleteStatefulSet, deleteStatefulSets } from '@/api/kubernetes/workload/statefulset'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeActionCell, { type ActionItem } from '@/components/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
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
import BeeTag from '@/components/BeeTag/index.vue'
import BeeWorkloadInfoCell from '@/components/BeeWorkloadInfoCell/index.vue'

import { usePermission } from '@/composables/usePermission'
import {
  STATEFULSET_PAGE_META,
  STATEFULSET_STATUS_OPTIONS,
  STATEFULSET_UPDATE_STRATEGY_LABEL_MAP,
} from '@/config/kubernetes/workload'

defineOptions({ name: 'StatefulSetPage' })

// ==================== Composables & Route ====================
const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()

// ==================== Reactive State ====================
// --- 上下文
const clusterUid = ref(route.params.clusterUid as string)
// --- 查询条件
const searchKey = ref('')
const queryForm = reactive<Partial<StatefulSetQueryForm>>({})
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
// --- 表格数据
const loading = ref(false)
const tableData = ref<StatefulSetListVo[]>([])
const tableRef = ref<InstanceType<typeof BeeTable>>()
// --- 选中逻辑
const selectedRows = ref<StatefulSetListVo[]>([])
const deletableRows = computed(() => selectedRows.value.filter(row => row.deletable !== false))
const nonDeletableRows = computed(() => selectedRows.value.filter(row => row.deletable === false))
// --- 对话框
const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const currentTargetRow = ref<StatefulSetListVo | null>(null)

// --- 选项数据
/** 命名空间选项 */
const namespaceOptions = ref<{ label: string; value: string | undefined }[]>([
  { label: '全部命名空间', value: undefined },
])

// ==================== Data Loading ====================
/**
 * 加载命名空间选项
 * @remarks 通过 getNamespaceList 获取列表，转换后填充下拉选项
 */
async function loadNamespaceOptions() {
  if (!clusterUid.value) return
  try {
    const res = await getNamespaceList(clusterUid.value, {})
    const namespaces = 'list' in res ? res.list : []
    namespaceOptions.value = [
      { label: '全部命名空间', value: undefined },
      ...namespaces.map(ns => ({ label: ns.name, value: ns.name })),
    ]
  } catch {
    // 加载失败时保留默认选项
  }
}

/**
 * 加载 StatefulSet 列表数据
 * @remarks 根据当前查询条件与分页参数获取 StatefulSet 分页数据
 */
async function loadData() {
  if (!clusterUid.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getStatefulSetList(clusterUid.value, {
      ...queryForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

// ==================== Search & Reset ====================
/**
 * 搜索
 * @remarks 将 searchKey 同时映射到 uid/name 字段进行搜索匹配，并重置页码
 */
function handleSearch() {
  queryForm.uid = searchKey.value
  queryForm.name = searchKey.value
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
  queryForm.namespace = undefined
  queryForm.status = undefined
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  void loadData()
}

// ==================== Selection ====================
/**
 * 表格选中行变化
 * @param rows
 * @remarks BeeTable 的 selection-change 事件固定返回 Record<string, unknown>[]，需通过 unknown 桥接断言为目标类型
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as StatefulSetListVo[]
}

/** 取消全部选中 */
function handleClearSelection() {
  tableRef.value?.clearSelection()
}

// ==================== CRUD ====================
/**
 * 跳转详情页面
 * @param row
 */
function handleViewDetail(row: StatefulSetListVo) {
  router
    .push({
      name: 'kubernetes:workload:statefulset:detail',
      params: { clusterId: route.params.clusterId, namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 跳转创建页面
 */
function handleCreate() {
  router
    .push({ name: 'kubernetes:workload:statefulset:create', params: { clusterUid: clusterUid.value } })
    .catch(() => {})
}

/**
 * 跳转创建页面（YAML 方式）
 */
function handleCreateYaml() {
  router
    .push({ name: 'kubernetes:workload:statefulset:create:yaml', params: { clusterUid: clusterUid.value } })
    .catch(() => {})
}

/**
 * 跳转编辑页面
 * @param row
 */
function handleEdit(row: StatefulSetListVo) {
  router
    .push({
      name: 'kubernetes:workload:statefulset:edit',
      params: { clusterId: route.params.clusterId, namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 跳转编辑页面（YAML 方式）
 * @param row
 */
function handleEditYaml(row: StatefulSetListVo) {
  router
    .push({
      name: 'kubernetes:workload:statefulset:edit:yaml',
      params: { clusterId: route.params.clusterId, namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 打开删除确认弹窗
 * @param row
 */
function handleDelete(row: StatefulSetListVo) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

/**
 * 确认单个删除
 * @remarks 调用删除 API，成功后关闭弹窗并刷新列表
 */
async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteStatefulSet(
      currentTargetRow.value.clusterUid,
      currentTargetRow.value.namespace,
      currentTargetRow.value.name,
    )
    BeeMessage.success('删除成功')
    deleteDialogVisible.value = false
    currentTargetRow.value = null
    await loadData()
  } catch (err) {
    console.error('[handleConfirmDelete]', err)
  }
}

/**
 * 打开批量删除确认弹窗
 */
function handleBatchDelete() {
  if (deletableRows.value.length === 0) {
    BeeMessage.warning('选中的 StatefulSet 均不可删除')
    return
  }
  batchDeleteDialogVisible.value = true
}

/**
 * 确认批量删除
 * @remarks 仅删除可删除的选中行，成功后清空选中并刷新列表
 */
async function handleConfirmBatchDelete() {
  if (deletableRows.value.length === 0) return
  const targetClusterUid = deletableRows.value[0].clusterUid
  const uids = deletableRows.value.map(row => row.uid)
  try {
    await deleteStatefulSets(targetClusterUid, uids)
    BeeMessage.success(`成功删除 ${uids.length} 个 StatefulSet`)
    batchDeleteDialogVisible.value = false
    selectedRows.value = []
    await loadData()
  } catch (err) {
    console.error('[handleConfirmBatchDelete]', err)
  }
}

// ==================== Other Actions ====================
/**
 * 扩缩容
 * @param row
 */
function handleScale(row: StatefulSetListVo) {
  BeeMessage.info(`扩缩容: ${row.name}`)
}

/**
 * 滚动更新分区
 * @param row
 */
function handlePartition(row: StatefulSetListVo) {
  BeeMessage.info(`滚动更新分区: ${row.name}`)
}

/**
 * 重启
 * @param row
 */
function handleRestart(row: StatefulSetListVo) {
  BeeMessage.info(`重启: ${row.name}`)
}

/**
 * 回滚
 * @param row
 */
function handleRollback(row: StatefulSetListVo) {
  BeeMessage.info(`回滚: ${row.name}`)
}

// ==================== Export & Import ====================
/**
 * 导出 StatefulSet
 * @remarks 功能开发中
 */
function handleExport() {
  BeeMessage.info('功能开发中')
}

/**
 * 导入 StatefulSet
 * @remarks 功能开发中
 */
function handleImport() {
  BeeMessage.info('功能开发中')
}

// ==================== Row Actions ====================
/** 页面级权限缓存，避免模板/循环中重复调用 hasPermission */
const perm: Record<string, boolean> = {
  create: hasPermission('kubernetes:workload:statefulset:create'),
  edit: hasPermission('kubernetes:workload:statefulset:edit'),
  view: hasPermission('kubernetes:workload:statefulset:view'),
  delete: hasPermission('kubernetes:workload:statefulset:delete'),
}

/**
 * 构建行操作数组
 * @param row - 当前行数据
 * @returns 操作项数组
 * @remarks 按权限和 row.deletable 条件过滤
 */
function getActions(row: StatefulSetListVo): ActionItem[] {
  const actions: ActionItem[] = []
  if (perm.view) {
    actions.push({ value: 'view', label: '详情', icon: 'basic-view', handler: () => handleViewDetail(row) })
  }
  if (perm.edit) {
    actions.push(
      { value: 'edit', label: '编辑', icon: 'basic-edit', handler: () => handleEdit(row) },
      { value: 'yamledit', label: '编辑 YAML', icon: 'basic-code', handler: () => handleEditYaml(row) },
      { value: 'scale', label: '扩缩容', icon: 'kubernetes-namespace', handler: () => handleScale(row) },
      { value: 'partition', label: '滚动更新分区', icon: 'kubernetes-namespace', handler: () => handlePartition(row) },
      { value: 'restart', label: '重启', icon: 'basic-refresh', handler: () => handleRestart(row) },
      { value: 'rollback', label: '回滚', icon: 'kubernetes-namespace', handler: () => handleRollback(row) },
    )
  }
  if (perm.delete && row.deletable !== false) {
    actions.push({ value: 'delete', label: '删除', icon: 'basic-delete', handler: () => handleDelete(row) })
  }
  return actions
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
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: $spacing-16;
  overflow: hidden;

  &__toolbar {
    display: flex;
    gap: $spacing-8;
    flex-direction: row;
    align-items: center;

    &-search {
      flex: 1;
      min-width: 0;
    }

    &-seperator {
      width: 1px;
      height: 40%;
      margin: 0 $spacing-8;
      background: $color-border-tertiary;
    }
  }

  &__table {
    flex: 1;
    min-height: 0;
  }

  &__footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &-actions {
      display: flex;
      gap: $spacing-8;
      flex-direction: row;
      align-items: center;
    }
  }
}

.dialog-content {
  strong {
    color: $color-primary;
  }
}

.delete-dialog-tags {
  display: flex;
  gap: $spacing-8;
  flex-flow: row wrap;
  margin: 12px 0;
}
</style>
