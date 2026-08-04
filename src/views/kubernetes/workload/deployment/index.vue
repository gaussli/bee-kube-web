<template>
  <BeePage class="deployment-page">
    <!-- 页面标题 -->
    <BeeCard class="deployment-page__header">
      <BeePageTitle
        icon="kubernetes-namespace"
        title="无状态应用"
        description="无状态应用（Deployment）是 Kubernetes 中用于管理无状态工作负载的控制器，支持应用的部署、扩缩容、滚动更新和回滚等操作。"
      />
    </BeeCard>

    <!-- 页面内容 -->
    <BeeCard class="deployment-page__body">
      <!-- 查询表单 -->
      <div class="table-toolbar">
        <BeeInputSearch v-model="searchKey" placeholder="按 ID / 名称搜索" class="table-toolbar__search" />
        <BeeSelect
          v-model="queryForm.namespace"
          placeholder="命名空间筛选"
          :options="namespaceOptions"
          :width="300"
          :menu-height="300"
        />
        <BeeSelect v-model="queryForm.status" placeholder="状态筛选" :options="DEPLOYMENT_STATUS_OPTIONS" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <BeeButton v-if="perm.create" type="primary" icon="basic-create" @click="handleCreate"> 新增 </BeeButton>
        <BeeButton v-if="perm.create" type="primary" icon="basic-create" @click="handleCreateYaml"> YAML </BeeButton>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
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
                :uid="row.uid"
                :name="row.name"
                :description="row.description"
                :icon-size="32"
                icon="kubernetes-namespace"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :text="row.namespace" subtext="命名空间" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeStatusCell
                :status="row.status"
                :status-msg="row.statusMessage"
                :options="DEPLOYMENT_STATUS_OPTIONS"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="120">
            <template #default="{ row }">
              <BeeTableCommonCell :text="`${row.readyReplicas} / ${row.replicas}`" subtext="副本数" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeTableCommonCell :text="row.strategyType" :subtext="strategyTypeLabel(row.strategyType)" />
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
              <BeeActionCell :actions="getActions(row)" />
            </template>
          </BeeTableColumn>
        </BeeTable>
      </div>

      <!-- 表格底部 -->
      <div class="table-footer">
        <div class="table-footer__actions">
          <BeeButton :disabled="selectedRows.length === 0" @click="handleClearSelection"> 取消选择 </BeeButton>
          <BeeButton v-if="perm.delete" type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            批量删除 ({{ selectedRows.length }})
          </BeeButton>
          <BeeButton v-if="perm.view" icon="basic-create" @click="handleExport"> 导出 </BeeButton>
          <BeeButton v-if="perm.create" icon="basic-create" @click="handleImport"> 导入 </BeeButton>
        </div>
        <BeePagination
          v-model="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          @change="loadData"
        />
      </div>
    </BeeCard>

    <!-- 单个删除 Dialog -->
    <BeeDialog v-model="deleteDialogVisible" title="确认删除" @confirm="handleConfirmDelete">
      <div class="dialog-content">
        <p>
          确定要删除 Deployment <strong>{{ currentTargetRow?.name }}</strong> 吗？
        </p>
      </div>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
      <div class="dialog-content">
        <template v-if="nonDeletableRows.length > 0">
          <p class="dialog-content__warning">
            共选中 {{ selectedRows.length }} 个 Deployment，但以下 {{ nonDeletableRows.length }} 个 Deployment
            不可删除，将从列表忽略：
          </p>
          <div class="delete-deployment-tags">
            <BeeTag v-for="row in nonDeletableRows" :key="row.id" type="warning">
              {{ row.name }}
            </BeeTag>
          </div>
        </template>
        <p v-if="deletableRows.length > 0">
          确定要删除选中的 <strong>{{ deletableRows.length }}</strong> 个 Deployment 吗？
        </p>
        <p v-else class="dialog-content__warning">所有选中的 Deployment 均不可删除。</p>
        <div v-if="deletableRows.length > 0" class="delete-deployment-tags">
          <BeeTag v-for="row in deletableRows" :key="row.id">
            {{ row.name }}
          </BeeTag>
        </div>
      </div>
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
/**
 * Deployment 管理页面
 * @module views/kubernetes/workload/deployment
 */
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { NamespaceSimpleListResp } from '@/types/kubernetes/namespace'
import type {
  DeploymentQueryForm,
  DeploymentListVo,
  DeploymentStrategyType
} from '@/types/kubernetes/workload/deployment'
import type { ActionItem } from '@/components/BeeActionCell/index.vue'
import { getNamespacePage } from '@/api/kubernetes/namespace'
import { getDeploymentList, deleteDeployment, deleteDeployments } from '@/api/kubernetes/workload/deployment'
import BeeActionCell from '@/components/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
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
import BeeWorkloadInfoCell from '@/components/BeeWorkloadInfoCell/index.vue'
import { usePermission } from '@/composables/usePermission'
import { DEPLOYMENT_STATUS_OPTIONS } from '@/config/kubernetes'

defineOptions({ name: 'DeploymentManage' })

// ==================== Composables & Route ====================

const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()

// ==================== Reactive State ====================

const clusterId = ref(route.params.clusterId as string)
const searchKey = ref('')
const loading = ref(false)
const tableData = ref<DeploymentListVo[]>([])
const tableRef = ref<InstanceType<typeof BeeTable>>()
const selectedRows = ref<DeploymentListVo[]>([])

/** 可删除的选中行 */
const deletableRows = computed(() => selectedRows.value.filter(row => row.deletable !== false))

/** 不可删除的选中行 */
const nonDeletableRows = computed(() => selectedRows.value.filter(row => row.deletable === false))

const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const currentTargetRow = ref<DeploymentListVo | null>(null)

const queryForm = reactive<Partial<DeploymentQueryForm>>({})
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

// ==================== Options ====================

/** 命名空间选项 */
const namespaceOptions = ref<{ label: string; value: string | undefined }[]>([
  { label: '全部命名空间', value: undefined }
])

/** 更新策略中文映射 */
const STRATEGY_TYPE_LABEL: Record<DeploymentStrategyType, string> = {
  RollingUpdate: '滚动更新',
  Recreate: '重建'
}

/**
 * 获取更新策略中文名称
 * @param type - 更新策略枚举值
 * @returns 中文名称
 */
function strategyTypeLabel(type: DeploymentStrategyType): string {
  return STRATEGY_TYPE_LABEL[type] || type
}

// ==================== Data Loading ====================

/**
 * 加载命名空间选项
 * @remarks 通过 getNamespacePage mode=simple 获取简化列表，转换后填充下拉选项
 */
async function loadNamespaceOptions() {
  if (!clusterId.value) return
  try {
    const namespaces = (await getNamespacePage(clusterId.value, { mode: 'simple' })) as NamespaceSimpleListResp[]
    namespaceOptions.value = [
      { label: '全部命名空间', value: undefined },
      ...namespaces.map(ns => ({ label: ns.name, value: ns.name }))
    ]
  } catch {
    // 加载失败时保留默认选项
  }
}

/**
 * 加载 Deployment 列表数据
 * @remarks 根据当前查询条件与分页参数获取 Deployment 分页数据
 */
async function loadData() {
  if (!clusterId.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getDeploymentList(clusterId.value, {
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

// ==================== Search & Reset ====================

/**
 * 搜索
 * @remarks 将 searchKey 同时映射到 id/name 字段进行模糊匹配
 */
function handleSearch() {
  queryForm.id = searchKey.value
  queryForm.name = searchKey.value
  pagination.page = 1
  loadData()
}

/**
 * 重置搜索条件
 */
function handleReset() {
  queryForm.id = undefined
  queryForm.name = undefined
  queryForm.namespace = undefined
  queryForm.status = undefined
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  loadData()
}

// ==================== Selection ====================

/**
 * 表格选中行变化
 * @remarks BeeTable 的 selection-change 事件固定返回 Record<string, unknown>[]，需通过 unknown 桥接断言为目标类型
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as DeploymentListVo[]
}

/** 取消全部选中 */
function handleClearSelection() {
  tableRef.value?.clearSelection()
}

// ==================== CRUD: Create / Edit / View ====================

/** 跳转创建页面 */
function handleCreate() {
  router.push({ name: 'kubernetes:workload:deployment:create', params: { clusterId: clusterId.value } })
}

/** YAML 方式创建（功能开发中） */
function handleCreateYaml() {
  ElMessage.info('功能开发中')
}

/** 导出 Deployment（功能开发中） */
function handleExport() {
  ElMessage.info('功能开发中')
}

/** 导入 Deployment（功能开发中） */
function handleImport() {
  ElMessage.info('功能开发中')
}

/** 跳转编辑页面 */
function handleEdit(row: DeploymentListVo) {
  router.push({
    name: 'kubernetes:workload:deployment:edit',
    params: { clusterId: row.clusterId },
    query: { namespace: row.namespace, name: row.name }
  })
}

/** 编辑 YAML */
function handleEditYaml(row: DeploymentListVo) {
  ElMessage.info(`编辑 YAML: ${row.name}`)
}

/** 跳转详情页面 */
function handleViewDetail(row: DeploymentListVo) {
  router.push({
    name: 'kubernetes:workload:deployment:detail',
    params: { clusterId: row.clusterId },
    query: { namespace: row.namespace, name: row.name }
  })
}

/** 扩缩容 */
function handleScale(row: DeploymentListVo) {
  ElMessage.info(`扩缩容: ${row.name}`)
}

/** 重启 */
function handleRestart(row: DeploymentListVo) {
  ElMessage.info(`重启: ${row.name}`)
}

/** 回滚 */
function handleRollback(row: DeploymentListVo) {
  ElMessage.info(`回滚: ${row.name}`)
}

// ==================== CRUD: Delete ====================

/** 打开删除确认弹窗 */
function handleDelete(row: DeploymentListVo) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

/** 确认单个删除 */
async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteDeployment(
      currentTargetRow.value.clusterId,
      currentTargetRow.value.namespace,
      currentTargetRow.value.name
    )
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
    currentTargetRow.value = null
    loadData()
  } catch (err) {
    console.error('[handleConfirmDelete]', err)
  }
}

/** 打开批量删除确认弹窗 */
function handleBatchDelete() {
  if (deletableRows.value.length === 0) {
    ElMessage.warning('选中的 Deployment 均不可删除')
    return
  }
  batchDeleteDialogVisible.value = true
}

/** 确认批量删除 */
async function handleConfirmBatchDelete() {
  if (deletableRows.value.length === 0) return
  const targetClusterId = deletableRows.value[0].clusterId
  const targetNamespace = deletableRows.value[0].namespace
  const names = deletableRows.value.map(row => row.name)
  try {
    await deleteDeployments(targetClusterId, targetNamespace, names)
    ElMessage.success(`成功删除 ${names.length} 个 Deployment`)
    batchDeleteDialogVisible.value = false
    selectedRows.value = []
    loadData()
  } catch (err) {
    console.error('[handleConfirmBatchDelete]', err)
  }
}

// ==================== Row Actions ====================

/** 页面级权限缓存，避免模板/循环中重复调用 hasPermission */
const perm: Record<string, boolean> = {
  create: hasPermission('kubernetes:workload:deployment:create'),
  edit: hasPermission('kubernetes:workload:deployment:edit'),
  view: hasPermission('kubernetes:workload:deployment:view'),
  delete: hasPermission('kubernetes:workload:deployment:delete')
}

/**
 * 构建行操作数组
 * @param row - 当前行数据
 * @returns 操作项数组
 * @remarks 按权限和 row.deletable 条件过滤，由调用方负责
 */
function getActions(row: DeploymentListVo): ActionItem[] {
  const actions: ActionItem[] = []
  if (perm.view) {
    actions.push({ value: 'view', label: '详情', icon: 'basic-view', handler: () => handleViewDetail(row) })
  }
  if (perm.edit) {
    actions.push(
      { value: 'edit', label: '编辑', icon: 'basic-edit', handler: () => handleEdit(row) },
      { value: 'yamledit', label: '编辑 YAML', icon: 'basic-code', handler: () => handleEditYaml(row) },
      { value: 'scale', label: '扩缩容', icon: 'kubernetes-namespace', handler: () => handleScale(row) },
      { value: 'restart', label: '重启', icon: 'basic-refresh', handler: () => handleRestart(row) },
      { value: 'rollback', label: '回滚', icon: 'kubernetes-namespace', handler: () => handleRollback(row) }
    )
  }
  if (perm.delete && row.deletable !== false) {
    actions.push({ value: 'delete', label: '删除', icon: 'basic-delete', handler: () => handleDelete(row) })
  }
  return actions
}

// ==================== Lifecycle ====================

onMounted(() => {
  loadNamespaceOptions()
  loadData()
})
</script>

<style lang="scss" scoped>
.deployment-page {
  .deployment-page__body {
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

    .table-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $spacing-16 0;

      &__actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }
    }
  }
}

.dialog-content {
  strong {
    color: $color-primary;
  }

  &__warning {
    color: $color-danger;
  }
}

.delete-deployment-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
}
</style>
