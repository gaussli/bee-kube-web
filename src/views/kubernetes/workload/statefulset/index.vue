<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeePageHeader v-bind="STATEFULSET_PAGE_META" />

    <!-- 页面 Body -->
    <BeeCard class="page-body">
      <!-- 工具栏 -->
      <div class="page-body__toolbar">
        <BeeInputSearch v-model="searchKey" class="page-body__toolbar-search" placeholder="按 UID / 名称搜索" />
        <BeeSelect v-model="queryForm.namespace" :options="namespaceOptions" placeholder="命名空间筛选" />
        <BeeSelect v-model="queryForm.status" :options="STATEFULSET_STATUS_OPTIONS" placeholder="状态筛选" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <div v-if="perm.create" class="page-body__toolbar-separator"></div>
        <BeeButton v-if="perm.create" icon="basic-create" type="primary" @click="handleCreate"> 新增 </BeeButton>
        <BeeButton v-if="perm.create" icon="basic-create" type="primary" @click="handleCreateYaml"> YAML </BeeButton>
      </div>

      <!-- 表格 -->
      <div class="page-body__table">
        <BeeTable
          ref="tableRef"
          :data="tableData"
          :loading="loading"
          row-key="uid"
          selectable
          @selection-change="handleSelectionChange"
        >
          <!-- 有状态应用信息列 -->
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <WorkloadInfoCell
                :description="row.description"
                :icon="STATEFULSET_PAGE_META.icon"
                :name="row.name"
                :uid="row.uid"
              />
            </template>
          </BeeTableColumn>
          <!-- 命名空间列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="row.namespace" sublabel="命名空间" />
            </template>
          </BeeTableColumn>
          <!-- 状态列 -->
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeStatusCell :options="STATEFULSET_STATUS_OPTIONS" :status="row.status" :status-msg="row.statusMsg" />
            </template>
          </BeeTableColumn>
          <!-- 副本数列 -->
          <BeeTableColumn :width="120">
            <template #default="{ row }">
              <BeeTableCommonCell :label="`${row.readyReplicas} / ${row.replicas}`" sublabel="副本数" />
            </template>
          </BeeTableColumn>
          <!-- 更新策略列 -->
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeTableCommonCell
                :label="
                  STATEFULSET_UPDATE_STRATEGY_OPTIONS.find(item => item.value === row.updateStrategyType)?.label ||
                  row.updateStrategyType
                "
                :sublabel="row.updateStrategyType"
              />
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
      title="删除有状态应用"
      type="danger"
      @confirm="handleConfirmDelete"
    >
      <span>
        您确认要删除 <strong>{{ selectedRow?.name || '' }}</strong> 有状态应用吗？
      </span>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog
      v-model="batchDeleteDialogVisible"
      icon="basic-delete"
      title="批量删除有状态应用"
      type="danger"
      @confirm="handleConfirmBatchDelete"
    >
      <BeeBatchDeleteDialogContent :delete-data="selectedRows" resource-type="有状态应用" />
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { StatefulSetListVo, StatefulSetQueryForm } from '@/types/kubernetes/workload/statefulset'

import { getNamespaceList } from '@/api/kubernetes/namespace/namespace'
import {
  getStatefulSetList,
  deleteStatefulSet,
  deleteStatefulSets,
  resumeStatefulSet,
  pauseStatefulSet,
  restartStatefulSet,
} from '@/api/kubernetes/workload/statefulset'

import { KubernetesRouteNames } from '@/router/names'

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
import BeePageHeader from '@/components/business/BeePageHeader/index.vue'
import BeeStatusCell from '@/components/business/BeeStatusCell/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import WorkloadInfoCell from '@/views/kubernetes/workload/components/WorkloadInfoCell/index.vue'

import { usePermission } from '@/composables/usePermission'
import {
  STATEFULSET_PAGE_META,
  STATEFULSET_STATUS_OPTIONS,
  STATEFULSET_UPDATE_STRATEGY_OPTIONS,
} from '@/config/kubernetes/workload/statefulset.ts'
import { useKubernetesStore } from '@/stores'

defineOptions({ name: 'StatefulSetPage' })

// ==================== Composables & Route ====================
const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()

// ==================== Reactive State ====================
// ---------- 查询条件 ----------
/** 搜索关键词 */
const searchKey = ref('')
/** 查询条件 */
const queryForm = reactive<Partial<StatefulSetQueryForm>>({})
/** 分页条件请求 / 响应 */
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
// ---------- 表格数据 ----------
/** BeeTable 实例引用 */
const tableRef = ref<InstanceType<typeof BeeTable>>()
/** 列表加载态 */
const loading = ref(false)
/** 列表数据 */
const tableData = ref<StatefulSetListVo[]>([])
// ---------- 选中逻辑 ----------
/** 当前行数据 */
const selectedRow = ref<StatefulSetListVo>()
/** 多选选中数据 */
const selectedRows = ref<StatefulSetListVo[]>([])
// ---------- 对话框 ----------
/** 单个删除弹框显隐 */
const deleteDialogVisible = ref(false)
/** 批量删除弹框显隐 */
const batchDeleteDialogVisible = ref(false)

// --- 选项数据
/** 命名空间选项 */
const namespaceOptions = ref<{ label: string; value: string | undefined }[]>([
  { label: '全部命名空间', value: undefined },
])

// ==================== Computed ====================
/** 当前集群 UID */
const clusterUid = computed(() => (route.params.clusterUid as string) || useKubernetesStore().activeClusterUid || '')
/** 多选选中数据中可删除列表 */
const deletableRows = computed(() => selectedRows.value.filter(row => row.deletable !== false))

// ==================== Permission ====================
/** 页面级权限缓存，避免模板/循环中重复调用 hasPermission */
const perm: Record<string, boolean> = {
  create: hasPermission('kubernetes:workload:statefulset:create'),
  edit: hasPermission('kubernetes:workload:statefulset:edit'),
  view: hasPermission('kubernetes:workload:statefulset:view'),
  delete: hasPermission('kubernetes:workload:statefulset:delete'),
}

// ==================== Row Actions Generate ====================
/**
 * 构建行操作数组
 * @param row - 当前行数据
 * @returns 操作项数组
 */
function getActions(row: StatefulSetListVo): ActionItem[] {
  const actions: ActionItem[] = []
  if (perm.view) {
    actions.push({ value: 'view', label: '详情', icon: 'basic-view', handler: () => handleViewDetail(row) })
  }
  if (perm.edit) {
    actions.push(
      { value: 'edit', label: '编辑', icon: 'basic-edit', handler: () => handleEdit(row) },
      { value: 'labels', label: '配置标签', icon: 'kubernetes-label', handler: () => handleLabels(row) },
      { value: 'annotations', label: '配置注解', icon: 'kubernetes-annotation', handler: () => handleAnnotations(row) },
      { value: 'scale', label: '扩缩容', icon: 'kubernetes-scale', handler: () => handleScale(row) },
      { value: 'restart', label: '重启', icon: 'basic-refresh', handler: () => handleRestart(row) },
      { value: 'rollback', label: '回滚', icon: 'kubernetes-rollback', handler: () => handleRollback(row) },
    )
    if (row.paused) {
      actions.push({
        value: 'resume',
        label: '恢复更新',
        icon: 'kubernetes-resume',
        handler: () => handleResume(row),
      })
    } else {
      actions.push({
        value: 'pause',
        label: '暂停更新',
        icon: 'kubernetes-pause',
        handler: () => handlePause(row),
      })
    }
  }
  if (perm.delete && row.deletable !== false) {
    actions.push({ value: 'delete', label: '删除', icon: 'basic-delete', handler: () => handleDelete(row) })
  }
  return actions
}

// ==================== Data Loading ====================
/**
 * 请求命名空间选项列表数据
 */
async function loadNamespaceOptions() {
  if (!clusterUid.value) return
  try {
    const { list } = await getNamespaceList(clusterUid.value, { mode: 'Simple' })
    namespaceOptions.value = [
      { label: '全部命名空间', value: undefined },
      ...list.map(ns => ({ label: ns.name, value: ns.name })),
    ]
  } catch (err) {
    console.error('[loadNamespaceOptions]', err)
    BeeMessage.error('加载命名空间选项失败，请稍后再试')
  }
}

/**
 * 请求有状态应用列表数据
 */
async function loadData() {
  if (!clusterUid.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const { list, total } = await getStatefulSetList(clusterUid.value, {
      ...queryForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = list
    pagination.total = total
  } catch (err) {
    console.error('[loadData]', err)
    BeeMessage.error('加载有状态应用列表失败')
  } finally {
    loading.value = false
  }
}

// ==================== BeeTable Handler ====================
/**
 * 表格选中行变化
 * @param rows
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as StatefulSetListVo[]
}

// ==================== Handler ====================
/**
 * 搜索
 */
function handleSearch() {
  queryForm.uid = searchKey.value
  queryForm.name = searchKey.value
  pagination.page = 1
  void loadData()
}

/**
 * 重置搜索条件
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

/**
 * 创建有状态应用
 */
function handleCreate() {
  router
    .push({ name: KubernetesRouteNames.StatefulSet.Create, params: { clusterUid: clusterUid.value } })
    .catch(() => {})
}

/**
 * 创建有状态应用（YAML）
 */
function handleCreateYaml() {
  router
    .push({ name: KubernetesRouteNames.StatefulSet.CreateYaml, params: { clusterUid: clusterUid.value } })
    .catch(() => {})
}

/**
 * 查看有状态应用详情
 * @param row - 当前行数据
 */
function handleViewDetail(row: StatefulSetListVo) {
  router
    .push({
      name: KubernetesRouteNames.StatefulSet.Detail,
      params: { clusterId: clusterUid.value, namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 编辑有状态应用
 * @param row
 */
function handleEdit(row: StatefulSetListVo) {
  router
    .push({
      name: KubernetesRouteNames.StatefulSet.Edit,
      params: { clusterId: clusterUid.value, namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 配置有状态应用标签
 * @param row - 当前行数据
 */
function handleLabels(row: StatefulSetListVo) {
  router
    .push({
      name: KubernetesRouteNames.StatefulSet.ManageLabels,
      params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 配置有状态应用注解
 * @param row - 当前行数据
 */
function handleAnnotations(row: StatefulSetListVo) {
  router
    .push({
      name: KubernetesRouteNames.StatefulSet.ManageAnnotations,
      params: { clusterUid: clusterUid.value, namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 扩缩容有状态应用
 * @param row - 当前行数据
 */
function handleScale(row: StatefulSetListVo) {
  BeeMessage.info(`扩缩容: ${row.name}`)
}

/**
 * 重启有状态应用
 * @param row - 当前行数据
 */
async function handleRestart(row: StatefulSetListVo) {
  try {
    await restartStatefulSet(clusterUid.value, row.namespace, row.name)
    BeeMessage.success(`成功重启有状态应用【${row.name}】`)
    selectedRow.value = undefined
    void loadData()
  } catch (err) {
    console.error('[handleRestart]', err)
    BeeMessage.error(`重启有状态应用【${row.name}】失败`)
  }
}

/**
 * 回滚有状态应用
 * @param row - 当前行数据
 */
function handleRollback(row: StatefulSetListVo) {
  BeeMessage.info(`回滚: ${row.name}`)
}

/**
 * 恢复有状态应用更新
 * @param row - 当前行数据
 */
async function handleResume(row: StatefulSetListVo) {
  try {
    await resumeStatefulSet(clusterUid.value, row.namespace, row.name)
    BeeMessage.success(`成功恢复有状态应用【${row.name}】更新`)
    selectedRow.value = undefined
    void loadData()
  } catch (err) {
    console.error('[handleResume]', err)
    BeeMessage.error(`恢复有状态应用【${row.name}】更新失败`)
  }
}

/**
 * 暂停有状态应用更新
 * @param row - 当前行数据
 */
async function handlePause(row: StatefulSetListVo) {
  try {
    await pauseStatefulSet(clusterUid.value, row.namespace, row.name)
    BeeMessage.success(`成功暂停有状态应用【${row.name}】更新`)
    selectedRow.value = undefined
    void loadData()
  } catch (err) {
    console.error('[handlePause]', err)
    BeeMessage.error(`暂停有状态应用【${row.name}】更新失败`)
  }
}

/**
 * 删除有状态应用
 * @param row
 */
function handleDelete(row: StatefulSetListVo) {
  selectedRow.value = row
  deleteDialogVisible.value = true
}
/**
 * 打开批量删除确认弹窗
 */
function handleBatchDelete() {
  if (deletableRows.value.length === 0) {
    BeeMessage.warning('选中的有状态应用均不可删除')
    return
  }
  batchDeleteDialogVisible.value = true
}

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

/**
 * 清空选中数据
 */
function handleClearSelection() {
  tableRef.value?.clearSelection()
}

// ==================== Dialog Confirm ====================
/**
 * 二次确认删除有状态应用
 */
async function handleConfirmDelete() {
  if (!selectedRow.value) return
  const { namespace, name } = selectedRow.value
  try {
    await deleteStatefulSet(clusterUid.value, namespace, name)
    BeeMessage.success(`成功删除有状态应用【${name}】`)
    selectedRow.value = undefined
    void loadData()
  } catch (err) {
    console.error('[handleConfirmDelete]', err)
    BeeMessage.error(`删除有状态应用【${name}】失败`)
  }
}

/**
 * 二次确认批量删除有状态应用
 */
async function handleConfirmBatchDelete() {
  if (deletableRows.value.length === 0) return
  const uids = deletableRows.value.map(row => row.uid)
  try {
    await deleteStatefulSets(clusterUid.value, uids)
    BeeMessage.success(`成功删除 ${uids.length} 个有状态应用`)
    selectedRows.value = []
    void loadData()
  } catch (err) {
    console.error('[handleConfirmBatchDelete]', err)
    BeeMessage.error('批量删除有状态应用失败')
  }
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
      justify-content: flex-start;
      align-items: center;
    }
  }
}
</style>
