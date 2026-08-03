<template>
  <div class="permission-table">
    <!-- 表格头部 -->
    <div class="table-header">
      <div class="query-form">
        <div class="query-form-left">
          <BeeInputSearch v-model="searchKey" placeholder="按 ID / 权限名称 / 权限编码 搜索" />
          <BeeSegmentedControl v-model="queryForm.status" :options="statusOptions" @select="handleSelect" />
        </div>
        <div class="query-form-right">
          <BeeButton @click="handleReset">
            <template #icon><Refresh /></template>
            刷新
          </BeeButton>
          <el-divider v-if="hasPermission('system:permission:create')" direction="vertical" />
          <BeeButton v-if="hasPermission('system:permission:create')" type="primary" @click="handleCreate">
            <template #icon><Plus /></template>
            新增
          </BeeButton>
        </div>
      </div>
    </div>

    <!-- 表格主体 -->
    <div class="table-body">
      <el-table v-loading="loading" :data="tableData" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column prop="id" width="300">
          <template #header>
            <BeeIconLabel icon="key" label="ID" />
          </template>
          <template #default="{ row }">
            <BeeLabelCopyable :label="row.id" />
          </template>
        </el-table-column>
        <el-table-column min-width="150">
          <template #header>
            <BeeIconLabel icon="key" label="权限" />
          </template>
          <template #default="{ row }">
            <PermissionCell :code="row.code" :name="row.name" />
          </template>
        </el-table-column>
        <el-table-column prop="description" min-width="150">
          <template #header>
            <BeeIconLabel icon="document" label="描述" />
          </template>
          <template #default="{ row }">
            <el-tooltip :content="row.description || '-'" placement="top" :disabled="!row.description">
              <span class="description">{{ row.description || '-' }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="status" width="100">
          <template #header>
            <BeeIconLabel icon="circle-check" label="状态" />
          </template>
          <template #default="{ row }">
            <BeeStatusCell :status="row.status" :options="permissionStatusConfig" />
          </template>
        </el-table-column>
        <el-table-column width="180">
          <template #header>
            <BeeIconLabel icon="clock" label="创建" />
          </template>
          <template #default="{ row }">
            <BeeAuditCell :username="row.createBy" :datetime="row.createAt" field-name="创建人 / 时间" />
          </template>
        </el-table-column>
        <el-table-column width="180">
          <template #header>
            <BeeIconLabel icon="edit-pen" label="更新" />
          </template>
          <template #default="{ row }">
            <BeeAuditCell :username="row.updateBy" :datetime="row.updateAt" field-name="更新人 / 时间" />
          </template>
        </el-table-column>
        <el-table-column width="150" fixed="right">
          <template #header>
            <BeeIconLabel icon="edit-pen" label="操作" />
          </template>
          <template #default="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button
                v-if="hasPermission('system:permission:view')"
                circle
                :icon="View"
                size="default"
                @click="handleView(row)"
              />
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button
                v-if="hasPermission('system:permission:edit')"
                circle
                :icon="EditPen"
                size="default"
                @click="handleEdit(row)"
              />
            </el-tooltip>
            <el-tooltip v-if="hasPermission('system:permission:delete')" content="删除" placement="top">
              <el-button circle :icon="Delete" size="default" @click="handleDelete(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 表格底部 -->
    <div class="table-footer">
      <div>
        <BeeButton
          v-if="hasPermission('system:permission:delete')"
          type="danger"
          :disabled="selectedRows.length === 0"
          @click="handleBatchDelete"
        >
          <template #icon><Delete /></template>
          批量删除 ({{ selectedRows.length }})
        </BeeButton>
      </div>
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadData"
        @current-change="loadData"
      />
    </div>

    <!-- 状态确认 Dialog -->
    <BeeDialog
      v-model="statusDialogVisible"
      :title="currentTargetRow?.status === 1 ? '确认禁用' : '确认启用'"
      @confirm="handleConfirmStatus"
    >
      <div class="dialog-content">
        <p v-if="currentTargetRow?.status === 1">
          确定要禁用权限 <strong>{{ currentTargetRow?.name }}</strong> 吗？禁用后该权限将无法使用。
        </p>
        <p v-else>
          确定要启用权限 <strong>{{ currentTargetRow?.name }}</strong> 吗？启用后该权限可以正常使用。
        </p>
      </div>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
      <div class="dialog-content">
        <p>
          确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个权限吗？
        </p>
        <div class="delete-permission-tags">
          <BeeTag v-for="row in selectedRows" :key="row.id">
            {{ row.name }}
          </BeeTag>
        </div>
      </div>
    </BeeDialog>

    <!-- 单个删除 Dialog -->
    <BeeDialog v-model="deleteDialogVisible" title="确认删除" @confirm="handleConfirmDelete">
      <div class="dialog-content">
        <p>
          确定要删除权限 <strong>{{ currentTargetRow?.name }}</strong> 吗？
        </p>
      </div>
    </BeeDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Delete, EditPen, Plus, Refresh, View } from '@element-plus/icons-vue'
import type { PermissionQueryReq, PermissionResp } from '@/types/platform/permission'
import {
  changePermissionStatus,
  getPermissionPage,
  removePermission,
  batchRemovePermissions
} from '@/api/platform/permission'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeIconLabel from '@/components/BeeIconLabel/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeeLabelCopyable from '@/components/BeeLabelCopyable/index.vue'
import BeeSegmentedControl from '@/components/BeeSegmentedControl/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import PermissionCell from '@/components/PermissionCell/index.vue'
import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'PermissionManage' })

const router = useRouter()
const searchKey = ref('')
const { hasPermission } = usePermission()

const permissionStatusConfig = [
  { value: 1, label: '启用', color: 'rgb(103, 194, 58)' },
  { value: 0, label: '禁用', color: 'rgb(245, 108, 108)' }
]

const statusOptions = [
  { label: '所有', value: undefined },
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]

const loading = ref(false)
const tableData = ref<PermissionResp[]>([])
const selectedRows = ref<PermissionResp[]>([])
const statusDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentTargetRow = ref<PermissionResp | null>(null)
const queryForm = reactive<PermissionQueryReq>({
  id: undefined,
  name: undefined,
  code: undefined,
  status: undefined,
  page: 1,
  pageSize: 10
})
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

async function loadData() {
  loading.value = true
  try {
    const resp = await getPermissionPage({ ...queryForm, page: pagination.page, pageSize: pagination.pageSize })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

function handleSelect(selectValue?: string | number) {
  queryForm.status = selectValue as number | undefined
  pagination.page = 1
  pagination.pageSize = 10
  loadData()
}

function handleReset() {
  searchKey.value = ''
  queryForm.id = undefined
  queryForm.name = undefined
  queryForm.code = undefined
  queryForm.status = undefined
  pagination.page = 1
  pagination.pageSize = 10
  loadData()
}

function handleSelectionChange(rows: PermissionResp[]) {
  selectedRows.value = rows
}

function handleView(row: PermissionResp) {
  router.push({ name: 'platform:system:permission:detail', params: { id: row.id } })
}

function handleCreate() {
  router.push({ name: 'platform:system:permission:create' })
}

function handleEdit(row: PermissionResp) {
  router.push({ name: 'platform:system:permission:edit', params: { id: row.id } })
}

function handleDelete(row: PermissionResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

async function handleConfirmStatus() {
  if (!currentTargetRow.value) return
  const targetStatus = currentTargetRow.value.status === 1 ? 0 : 1
  const actionText = targetStatus === 1 ? '启用' : '禁用'
  try {
    await changePermissionStatus(currentTargetRow.value.id, { status: targetStatus })
    ElMessage.success(`${actionText}成功`)
    statusDialogVisible.value = false
    currentTargetRow.value = null
    loadData()
  } catch {
    // 失败处理
  }
}

async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await removePermission(currentTargetRow.value.id)
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
  const ids = selectedRows.value.map(row => row.id)
  try {
    await batchRemovePermissions(ids)
    ElMessage.success(`成功删除 ${ids.length} 个权限`)
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
.permission-table {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $color-bg-surface;
}

.table-header {
  flex-shrink: 0;
  padding: 16px 20px;

  .query-form {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .query-form-left {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .query-form-right {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }
}

.table-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  :deep(.el-table) {
    flex: 1;
    width: auto;

    th.el-table__cell {
      padding: 12px 0;
    }

    .el-button + .el-button,
    .el-button + .el-dropdown {
      margin-left: 8px;
    }
  }
}

.table-footer {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.dialog-content {
  strong {
    color: $color-primary;
  }
}

.delete-permission-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.description {
  display: -webkit-box;
  max-height: 3em;
  overflow: hidden;
  line-height: 1.5;
  color: #909399;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
