<template>
  <BeePage class="statefulset-page">
    <!-- 页面标题 -->
    <BeeCard class="statefulset-page__header">
      <BeePageTitle icon="kubernetes-namespace" title="有状态应用" description="有状态应用（StatefulSet）是 Kubernetes 中用于管理有状态工作负载的控制器，为每个 Pod 提供稳定的网络标识和持久存储。" />
    </BeeCard>

    <!-- 页面内容 -->
    <BeeCard class="statefulset-page__body">
      <!-- 查询表单 -->
      <div class="table-toolbar">
        <BeeInputSearch v-model="searchKey" placeholder="按 ID / 名称搜索" class="table-toolbar__search" />
        <BeeSelect v-model="queryForm.namespace" placeholder="命名空间筛选" :options="namespaceOptions" :width="300" />
        <BeeSelect v-model="queryForm.status" placeholder="状态筛选" :options="STATEFULSET_STATUS_OPTIONS" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <BeeButton v-if="hasPermission('kubernetes:workload:statefulset:create')" type="primary" icon="basic-create" @click="handleCreate"> 新增 </BeeButton>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <BeeTable :data="tableData" :loading="loading" selectable @selection-change="handleSelectionChange">
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <BeeWorkloadInfoCell :uid="row.uid" :name="row.name" :description="row.description" :icon-size="32" icon="kubernetes-namespace" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :text="row.namespace" subtext="命名空间" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeStatusCell :status="row.status" :status-msg="row.statusMessage" :options="STATEFULSET_STATUS_OPTIONS" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="120">
            <template #default="{ row }">
              <BeeTableCommonCell :text="`${row.readyReplicas} / ${row.replicas}`" subtext="副本数" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :text="row.serviceName" subtext="服务名" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeTableCommonCell :text="row.updateStrategy" :subtext="updateStrategyLabel(row.updateStrategy)" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="140">
            <template #default="{ row }">
              <BeeTableCommonCell :text="row.podManagementPolicy" :subtext="podManagementPolicyLabel(row.podManagementPolicy)" />
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
                <BeeCircleButton v-if="hasPermission('kubernetes:workload:statefulset:edit')" icon="basic-edit" tooltip="编辑" @click="handleEdit(row)" />
                <BeeCircleButton icon="basic-view" tooltip="详情" @click="handleViewDetail(row)" />
                <BeeDropdown trigger="click">
                  <BeeCircleButton icon="basic-more" tooltip="更多" />
                  <template #dropdown>
                    <BeeDropdownItem value="scale" label="扩缩容" icon="kubernetes-scale" @click="handleScale(row)" />
                    <BeeDropdownItem value="restart" label="重启" icon="basic-refresh" @click="handleRestart(row)" />
                    <BeeDropdownItem value="yamledit" label="编辑 YAML" icon="basic-code" @click="handleEditYaml(row)" />
                    <BeeDropdownItem
                      v-if="hasPermission('kubernetes:workload:statefulset:delete') && row.deletable !== false"
                      value="delete"
                      label="删除"
                      icon="basic-delete"
                      @click="handleDelete(row)"
                    />
                  </template>
                </BeeDropdown>
              </div>
            </template>
          </BeeTableColumn>
        </BeeTable>
      </div>

      <!-- 表格底部 -->
      <div class="table-footer">
        <div>
          <BeeButton v-if="hasPermission('kubernetes:workload:statefulset:delete')" type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            批量删除 ({{ selectedRows.length }})
          </BeeButton>
        </div>
        <BeePagination v-model="pagination.page" v-model:pageSize="pagination.pageSize" :total="pagination.total" :page-sizes="[10, 20, 50]" @change="loadData" />
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
        <p>
          确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个 StatefulSet 吗？
        </p>
        <div class="delete-statefulset-tags">
          <BeeTag v-for="row in selectedRows" :key="row.id">
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
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { StatefulSetQueryReq, StatefulSetListResp, StatefulSetUpdateStrategyType, PodManagementPolicyType } from '@/types/kubernetes/workload/statefulset'
import { getStatefulSetPage, deleteStatefulSet, deleteStatefulSets } from '@/api/kubernetes/workload/statefulset'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeCircleButton from '@/components/BeeCircleButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeDropdown from '@/components/BeeDropdown/index.vue'
import BeeDropdownItem from '@/components/BeeDropdownItem/index.vue'
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
import { STATEFULSET_STATUS_OPTIONS } from '@/config/kubernetes'

defineOptions({ name: 'StatefulSetManage' })

const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()
const searchKey = ref('')
const clusterId = ref(route.params.clusterId as string)

const loading = ref(false)
const tableData = ref<StatefulSetListResp[]>([])
const selectedRows = ref<StatefulSetListResp[]>([])
const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const currentTargetRow = ref<StatefulSetListResp | null>(null)

const queryForm = reactive<Partial<StatefulSetQueryReq>>({
  id: undefined,
  name: undefined,
  namespace: undefined,
  status: undefined
})
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

/** 命名空间选项 */
const namespaceOptions = ref([
  { label: '全部命名空间', value: undefined },
  { label: 'default', value: 'default' },
  { label: 'data', value: 'data' },
  { label: 'middleware', value: 'middleware' },
  { label: 'storage', value: 'storage' },
  { label: 'logging', value: 'logging' },
  { label: 'monitoring', value: 'monitoring' }
])

/** 更新策略中文映射 */
const UPDATE_STRATEGY_LABEL: Record<StatefulSetUpdateStrategyType, string> = {
  RollingUpdate: '滚动更新',
  OnDelete: '手动删除'
}

/** Pod 管理策略中文映射 */
const POD_MANAGEMENT_POLICY_LABEL: Record<PodManagementPolicyType, string> = {
  OrderedReady: '按序就绪',
  Parallel: '并行管理'
}

/**
 * 获取更新策略中文名称
 * @param type - 更新策略枚举值
 * @returns 中文名称
 */
function updateStrategyLabel(type: StatefulSetUpdateStrategyType): string {
  return UPDATE_STRATEGY_LABEL[type] || type
}

/**
 * 获取 Pod 管理策略中文名称
 * @param type - Pod 管理策略枚举值
 * @returns 中文名称
 */
function podManagementPolicyLabel(type: PodManagementPolicyType): string {
  return POD_MANAGEMENT_POLICY_LABEL[type] || type
}

/**
 * 加载 StatefulSet 列表数据
 * @remarks 根据当前查询条件与分页参数获取 StatefulSet 分页数据
 */
async function loadData() {
  if (!clusterId.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getStatefulSetPage(clusterId.value, {
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

/**
 * 表格选中行变化
 * @remarks BeeTable 的 selection-change 事件固定返回 Record<string, unknown>[]，需通过 unknown 桥接断言为目标类型
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as StatefulSetListResp[]
}

/** 跳转创建页面 */
function handleCreate() {
  router.push({ name: 'kubernetes:workload:statefulset:create', params: { clusterId: clusterId.value } })
}

/** 跳转编辑页面 */
function handleEdit(row: StatefulSetListResp) {
  router.push({ name: 'kubernetes:workload:statefulset:edit', params: { clusterId: row.clusterId }, query: { namespace: row.namespace, name: row.name } })
}

/** 跳转详情页面 */
function handleViewDetail(row: StatefulSetListResp) {
  router.push({ name: 'kubernetes:workload:statefulset:detail', params: { clusterId: row.clusterId }, query: { namespace: row.namespace, name: row.name } })
}

/** 扩缩容 */
function handleScale(row: StatefulSetListResp) {
  ElMessage.info(`扩缩容: ${row.name}`)
}

/** 重启 */
function handleRestart(row: StatefulSetListResp) {
  ElMessage.info(`重启: ${row.name}`)
}

/** 编辑 YAML */
function handleEditYaml(row: StatefulSetListResp) {
  ElMessage.info(`编辑 YAML: ${row.name}`)
}

/** 打开删除确认弹窗 */
function handleDelete(row: StatefulSetListResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

/** 确认单个删除 */
async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteStatefulSet(currentTargetRow.value.clusterId, currentTargetRow.value.namespace, currentTargetRow.value.name)
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
  batchDeleteDialogVisible.value = true
}

/** 确认批量删除 */
async function handleConfirmBatchDelete() {
  if (selectedRows.value.length === 0) return
  const targetClusterId = selectedRows.value[0].clusterId
  const targetNamespace = selectedRows.value[0].namespace
  const names = selectedRows.value.map(row => row.name)
  try {
    await deleteStatefulSets(targetClusterId, targetNamespace, names)
    ElMessage.success(`成功删除 ${names.length} 个 StatefulSet`)
    batchDeleteDialogVisible.value = false
    selectedRows.value = []
    loadData()
  } catch (err) {
    console.error('[handleConfirmBatchDelete]', err)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.statefulset-page {
  .statefulset-page__body {
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

.dialog-content {
  strong {
    color: $color-primary;
  }
}

.delete-statefulset-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
}
</style>
