<template>
  <BeePage class="namespace-page">
    <!-- 页面标题 -->
    <BeeCard class="namespace-page__header">
      <BeePageTitle
        icon="kubernetes-namespace"
        title="命名空间管理"
        description="命名空间（Namespace）是 Kubernetes 集群中用于资源隔离的虚拟集群，可以将集群划分为多个独立的工作空间，实现项目、团队或环境之间的资源隔离和管理。"
      />
    </BeeCard>

    <!-- 页面内容 -->
    <BeeCard class="namespace-page__body">
      <!-- 查询表单 -->
      <div class="table-toolbar">
        <BeeInputSearch v-model="searchKey" placeholder="按名称搜索" class="table-toolbar__search" />
        <BeeSelect v-model="queryForm.status" :options="NAMESPACE_STATUS_OPTIONS" placeholder="状态筛选" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <BeeButton
          v-if="hasPermission('kubernetes:namespace:create')"
          type="primary"
          icon="basic-create"
          @click="handleCreate"
        >
          新增
        </BeeButton>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <BeeTable :data="tableData" :loading="loading" selectable @selection-change="handleSelectionChange">
          <BeeTableColumn>
            <template #default="{ row }">
              <BeeNamespaceInfoCell :id="row.id" :name="row.name" :description="row.description" :icon-size="32" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeStatusCell :status="row.status" :status-msg="row.statusMsg" :options="NAMESPACE_STATUS_OPTIONS" />
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
                <BeeCircleButton
                  v-if="hasPermission('kubernetes:namespace:edit')"
                  icon="basic-edit"
                  tooltip="编辑"
                  @click="handleEdit(row)"
                />
                <BeeCircleButton icon="basic-view" tooltip="详情" @click="handleViewDetail(row)" />
                <BeeDropdown trigger="click">
                  <BeeCircleButton icon="basic-more" tooltip="更多" />
                  <template #dropdown>
                    <BeeDropdownItem
                      value="resourceQuota"
                      label="资源配额"
                      icon="kubernetes-quota"
                      @click="handleResourceQuota(row)"
                    />
                    <BeeDropdownItem
                      v-if="hasPermission('kubernetes:namespace:delete') && row.deletable !== false"
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
          <BeeButton
            v-if="hasPermission('kubernetes:namespace:delete')"
            type="danger"
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            批量删除 ({{ selectedRows.length }})
          </BeeButton>
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
          确定要删除命名空间 <strong>{{ currentTargetRow?.name }}</strong> 吗？
        </p>
        <p class="warning-text">删除命名空间将同时删除该命名空间下的所有资源！</p>
      </div>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
      <div class="dialog-content">
        <p>
          确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个命名空间吗？
        </p>
        <div class="delete-namespace-tags">
          <BeeTag v-for="row in selectedRows" :key="row.id">
            {{ row.name }}
          </BeeTag>
        </div>
        <p class="warning-text">删除命名空间将同时删除该命名空间下的所有资源！</p>
      </div>
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { NamespaceQueryReq, NamespaceListResp } from '@/types/kubernetes/namespace'
import { getNamespacePage, deleteNamespace, deleteNamespaces } from '@/api/kubernetes/namespace'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeCircleButton from '@/components/BeeCircleButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeDropdown from '@/components/BeeDropdown/index.vue'
import BeeDropdownItem from '@/components/BeeDropdownItem/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeeNamespaceInfoCell from '@/components/BeeNamespaceInfoCell/index.vue'
import BeePage from '@/components/BeePage/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'
import BeeStatusCell from '@/components/BeeStatusCell/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import { usePermission } from '@/composables/usePermission'
import { NAMESPACE_STATUS_OPTIONS } from '@/config/kubernetes'

defineOptions({ name: 'NamespaceManage' })

const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()
const searchKey = ref('')
const clusterId = ref(route.params.clusterId as string)

const loading = ref(false)
const tableData = ref<NamespaceListResp[]>([])
const selectedRows = ref<NamespaceListResp[]>([])
const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const currentTargetRow = ref<NamespaceListResp | null>(null)

const queryForm = reactive<Partial<NamespaceQueryReq>>({
  id: undefined,
  name: undefined,
  status: undefined
})
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

async function loadData() {
  if (!clusterId.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getNamespacePage(clusterId.value, {
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
 * @remarks 将 searchKey 映射到 name 字段进行模糊匹配
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
  selectedRows.value = rows as unknown as NamespaceListResp[]
}

function handleCreate() {
  router.push({ name: 'kubernetes:namespace:create', params: { clusterId: clusterId.value } })
}

function handleEdit(row: NamespaceListResp) {
  router.push({ name: 'kubernetes:namespace:edit', params: { clusterId: row.clusterId }, query: { name: row.name } })
}

function handleViewDetail(row: NamespaceListResp) {
  router.push({ name: 'kubernetes:namespace:detail', params: { clusterId: row.clusterId }, query: { name: row.name } })
}

function handleResourceQuota(row: NamespaceListResp) {
  router.push({ name: 'kubernetes:resourcequota:list', query: { clusterId: row.clusterId, namespace: row.name } })
}

function handleDelete(row: NamespaceListResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteNamespace(currentTargetRow.value.clusterId, currentTargetRow.value.name)
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
  if (selectedRows.value.length === 0) return
  const targetClusterId = selectedRows.value[0].clusterId
  const names = selectedRows.value.map(row => row.name)
  try {
    await deleteNamespaces(targetClusterId, names)
    ElMessage.success(`成功删除 ${names.length} 个命名空间`)
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
.namespace-page {
  .namespace-page__body {
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

  .warning-text {
    margin-top: 12px;
    color: $color-danger;
  }
}

.delete-namespace-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
}
</style>
