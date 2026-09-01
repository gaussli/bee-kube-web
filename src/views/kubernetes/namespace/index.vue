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
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <BeeNamespaceInfoCell :id="row.id" :description="row.description" :icon-size="32" :name="row.name" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :min-width="160">
            <template #default="{ row }">
              <BeeStatusCell :options="NAMESPACE_STATUS_OPTIONS" :status="row.status" :status-msg="row.statusMsg" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn label="类型" :width="160">
            <template #default="{ row }">
              <BeeTableCommonCell :subtext="row.type" :text="row.type" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAuditCell :datetime="row.createAt" field-name="创建人 / 时间" :username="row.createBy" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn fixed="right" :width="150">
            <template #default="{ row }">
              <div class="table-action">
                <BeeCircleButton
                  v-if="hasPermission('kubernetes:namespace:edit')"
                  icon="basic-edit"
                  tooltip="编辑"
                  @click="handleEdit(row)"
                />
                <BeeCircleButton
                  v-if="hasPermission('kubernetes:namespace:edit')"
                  icon="basic-yaml"
                  tooltip="编辑 YAML"
                  @click="handleEditYaml(row)"
                />
                <BeeCircleButton icon="basic-view" tooltip="详情" @click="handleViewDetail(row)" />
                <BeeDropdown trigger="click">
                  <BeeCircleButton icon="basic-more" tooltip="更多" />
                  <template #dropdown>
                    <BeeDropdownItem
                      icon="kubernetes-quota"
                      label="资源配额"
                      value="resourceQuota"
                      @click="handleResourceQuota(row)"
                    />
                    <BeeDropdownItem
                      v-if="hasPermission('kubernetes:namespace:delete') && row.deletable !== false"
                      icon="basic-delete"
                      label="删除"
                      value="delete"
                      @click="handleDelete(row)"
                    />
                  </template>
                </BeeDropdown>
              </div>
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
          确定要删除命名空间 <strong>{{ currentTargetRow?.name }}</strong> 吗？
        </p>
        <p class="warning-text">删除命名空间将同时删除该命名空间下的所有资源！</p>
      </div>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
      <div class="dialog-content">
        <p>
          确定要删除选中的 <strong>{{ deletableRows.length }}</strong> 个命名空间吗？
        </p>
        <div class="delete-dialog-tags">
          <BeeTag v-for="row in deletableRows" :key="row.uid">
            {{ row.name }}
          </BeeTag>
        </div>
        <p v-if="nonDeletableRows.length" class="warning-text">
          以下 {{ nonDeletableRows.length }} 个命名空间不可删除：{{ nonDeletableRows.map(r => r.name).join('、') }}
        </p>
        <p class="warning-text">删除命名空间将同时删除该命名空间下的所有资源！</p>
      </div>
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { NamespaceListVo, NamespaceQueryForm } from '@/types/kubernetes/namespace'

import { getNamespaceList, deleteNamespace, deleteNamespaces } from '@/api/kubernetes/namespace/namespace'

import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeCircleButton from '@/components/BeeCircleButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeDropdown from '@/components/BeeDropdown/index.vue'
import BeeDropdownItem from '@/components/BeeDropdownItem/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import { BeeMessage } from '@/components/BeeMessage'
import BeeNamespaceInfoCell from '@/components/BeeNamespaceInfoCell/index.vue'
import BeePage from '@/components/BeePage/index.vue'
import BeePageHeader from '@/components/BeePageHeader/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'
import BeeStatusCell from '@/components/BeeStatusCell/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'

import { usePermission } from '@/composables/usePermission'
import { NAMESPACE_PAGE_META, NAMESPACE_STATUS_OPTIONS } from '@/config/kubernetes/namespace'

defineOptions({ name: 'NamespaceManage' })

const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()

// ==================== Reactive State ====================
// --- 上下文
const clusterUid = ref(route.params.clusterUid as string)
const searchKey = ref('')
// --- 查询条件
const queryForm = reactive<Partial<NamespaceQueryForm>>({})
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
// --- 表格数据
const loading = ref(false)
const tableData = ref<NamespaceListVo[]>([])
const tableRef = ref<InstanceType<typeof BeeTable>>()
// --- 选中逻辑
const selectedRows = ref<NamespaceListVo[]>([])
// --- 对话框
const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const currentTargetRow = ref<NamespaceListVo | null>(null)

/**
 * 可删除行（deletable 不为 false 的选中行）
 */
const deletableRows = computed(() => selectedRows.value.filter(row => row.deletable !== false))
/**
 * 不可删除行（deletable 为 false 的选中行）
 */
const nonDeletableRows = computed(() => selectedRows.value.filter(row => row.deletable === false))

// --- 权限缓存
/** 页面级权限缓存，避免模板/循环中重复调用 hasPermission */
const perm: Record<string, boolean> = {
  create: hasPermission('kubernetes:namespace:create'),
  edit: hasPermission('kubernetes:namespace:edit'),
  view: hasPermission('kubernetes:namespace:view'),
  delete: hasPermission('kubernetes:namespace:delete'),
}

async function loadData() {
  if (!clusterUid.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getNamespaceList(clusterUid.value, {
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

/**
 * 搜索
 * @remarks 将 searchKey 同时映射到 uid/name 字段进行搜索匹配，并重置页码
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
 * 表格选中行变化
 * @param rows
 */
/**
 * 表格选中行变化
 * @param rows
 * @remarks BeeTable 的 selection-change 事件固定返回 Record<string, unknown>[]，需通过 unknown 桥接断言为目标类型
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as NamespaceListVo[]
}

/** 取消全部选中 */
function handleClearSelection() {
  tableRef.value?.clearSelection()
}

/**
 * 新建命名空间
 */
function handleCreate() {
  router.push({ name: 'kubernetes:namespace:create', params: { clusterUid: clusterUid.value } }).catch(() => {})
}

/**
 * 编辑命名空间
 * @param row
 */
function handleEdit(row: NamespaceListVo) {
  router
    .push({ name: 'kubernetes:namespace:edit', params: { clusterUid: clusterUid.value, uid: row.uid } })
    .catch(() => {})
}

/**
 * 编辑 YAML
 * @param row
 */
function handleEditYaml(row: NamespaceListVo) {
  router
    .push({ name: 'kubernetes:namespace:edit:yaml', params: { clusterUid: clusterUid.value, uid: row.uid } })
    .catch(() => {})
}

/**
 * 查看详情
 * @param row
 */
function handleViewDetail(row: NamespaceListVo) {
  router
    .push({ name: 'kubernetes:namespace:detail', params: { clusterUid: clusterUid.value, uid: row.uid } })
    .catch(() => {})
}

/**
 * 查看资源配额
 * @param row
 */
function handleResourceQuota(row: NamespaceListVo) {
  router
    .push({ name: 'kubernetes:resourcequota:list', query: { clusterUid: clusterUid.value, namespace: row.name } })
    .catch(() => {})
}

/**
 * 删除命名空间
 * @param row
 */
function handleDelete(row: NamespaceListVo) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteNamespace(currentTargetRow.value.clusterUid, currentTargetRow.value.uid)
    BeeMessage.success('删除成功')
    deleteDialogVisible.value = false
    currentTargetRow.value = null
    await loadData()
  } catch {
    // 失败处理
  }
}

/**
 * 批量删除
 * @remarks 仅对可删除行（deletable 不为 false）进行批量删除确认
 */
function handleBatchDelete() {
  if (deletableRows.value.length === 0) return
  batchDeleteDialogVisible.value = true
}

async function handleConfirmBatchDelete() {
  if (deletableRows.value.length === 0) return
  const targetClusterId = deletableRows.value[0].clusterUid
  const uids = deletableRows.value.map(row => row.uid)
  try {
    await deleteNamespaces(targetClusterId, uids)
    BeeMessage.success(`成功删除 ${uids.length} 个命名空间`)
    batchDeleteDialogVisible.value = false
    selectedRows.value = []
    await loadData()
  } catch {
    // 失败处理
  }
}

/**
 * 跳转创建页面（YAML 方式）
 * @remarks 功能开发中，路由尚未实现
 */
function handleCreateYaml() {
  BeeMessage.info('功能开发中')
}

// ==================== Export & Import ====================
/**
 * 导出命名空间
 * @remarks 功能开发中
 */
function handleExport() {
  BeeMessage.info('功能开发中')
}

/**
 * 导入命名空间
 * @remarks 功能开发中
 */
function handleImport() {
  BeeMessage.info('功能开发中')
}

// ==================== Lifecycle ====================
onMounted(() => {
  void loadData()
})
</script>

<style lang="scss" scoped>
.page-body {
  display: flex;
  gap: $spacing-16;
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

.table-action {
  display: flex;
  gap: $spacing-8;
  width: 100%;
  height: auto;
}

.dialog-content {
  strong {
    color: $color-primary;
  }

  .warning-text {
    margin-top: 12px;
    color: $color-danger;
  }
}

.delete-dialog-tags {
  display: flex;
  gap: $spacing-8;
  flex-flow: row wrap;
  margin: 12px 0;
}
</style>
