<template>
  <div class="role-table">
    <!-- 表格头部 -->
    <div class="table-header">
      <div class="query-form">
        <div class="query-form-left">
          <BeeInputSearch v-model="searchKey" placeholder="按 ID / 角色名称 / 编码 搜索" @search="handleSearch" />
          <StatusSearch v-model="queryForm.status" :options="statusOptions" @select="handleSelect" />
        </div>
        <div class="query-form-right">
          <BeeButton @click="handleReset">
            <template #icon><Refresh /></template>
            刷新
          </BeeButton>
          <el-divider direction="vertical" />
          <BeeButton type="primary" @click="handleCreate">
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
            <IconLabel :icon="Key" label="ID" />
          </template>
          <template #default="{ row }">
            <TextCopyableCell :text="row.id" />
          </template>
        </el-table-column>
        <el-table-column min-width="120">
          <template #header>
            <IconLabel :icon="User" label="角色" />
          </template>
          <template #default="{ row }">
            <RoleCell :code="row.code" :name="row.name" />
          </template>
        </el-table-column>
        <el-table-column prop="description" min-width="150">
          <template #header>
            <IconLabel :icon="Document" label="描述" />
          </template>
          <template #default="{ row }">
            <el-tooltip :content="row.description || '-'" placement="top" :disabled="!row.description">
              <span class="description">{{ row.description || '-' }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="status" width="100">
          <template #header>
            <IconLabel :icon="CircleCheck" label="状态" />
          </template>
          <template #default="{ row }">
            <StatusCell :status="row.status" :config="roleStatusConfig" />
          </template>
        </el-table-column>
        <el-table-column width="180">
          <template #header>
            <IconLabel :icon="Clock" label="创建" />
          </template>
          <template #default="{ row }">
            <AuditCell :user="row.createBy" :time="row.createAt" />
          </template>
        </el-table-column>
        <el-table-column width="180">
          <template #header>
            <IconLabel :icon="EditPen" label="更新" />
          </template>
          <template #default="{ row }">
            <AuditCell :user="row.updateBy" :time="row.updateAt" />
          </template>
        </el-table-column>
        <el-table-column width="200" fixed="right">
          <template #header>
            <IconLabel :icon="EditPen" label="操作" />
          </template>
          <template #default="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button circle :icon="View" size="default" @click="handleView(row)" />
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button circle :icon="EditPen" size="default" @click="handleEdit(row)" />
            </el-tooltip>
            <el-tooltip content="更多" placement="top">
              <el-dropdown trigger="click">
                <template #default>
                  <el-button circle :icon="MoreFilled" size="default" />
                </template>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="row.status === 0" @click="handleToggleStatus(row)">
                      <el-icon><CircleCheck /></el-icon> 启用
                    </el-dropdown-item>
                    <el-dropdown-item v-if="row.status === 1" @click="handleToggleStatus(row)">
                      <el-icon><CircleClose /></el-icon> 禁用
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleAssignPermissions(row)">
                      <el-icon><Setting /></el-icon> 配置权限
                    </el-dropdown-item>
                    <el-dropdown-item divided @click="handleDelete(row)">
                      <el-icon><Delete /></el-icon> 删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 表格底部 -->
    <div class="table-footer">
      <BeeButton type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
        <template #icon><Delete /></template>
        批量删除 ({{ selectedRows.length }})
      </BeeButton>
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
  </div>

  <!-- 详情抽屉 -->
  <RoleDetailDrawer v-model="detailDrawerVisible" :role-data="currentRole" />

  <!-- 状态确认 Dialog -->
  <BeeDialog
    v-model="statusDialogVisible"
    :title="currentTargetRow?.status === 1 ? '确认禁用' : '确认启用'"
    @confirm="handleConfirmStatus"
  >
    <div class="dialog-content">
      <p v-if="currentTargetRow?.status === 1">
        确定要禁用角色 <strong>{{ currentTargetRow?.name }}</strong> 吗？禁用后该角色将无法使用。
      </p>
      <p v-else>
        确定要启用角色 <strong>{{ currentTargetRow?.name }}</strong> 吗？启用后该角色可以正常使用。
      </p>
    </div>
  </BeeDialog>

  <!-- 批量删除 Dialog -->
  <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
    <div class="dialog-content">
      <p>
        确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个角色吗？
      </p>
      <div class="delete-role-tags">
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
        确定要删除角色 <strong>{{ currentTargetRow?.name }}</strong> 吗？
      </p>
    </div>
  </BeeDialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CircleCheck, CircleClose, Delete, Document, EditPen, Key, MoreFilled, Plus, Refresh, Setting, User, View, Clock } from '@element-plus/icons-vue'
import { changeRoleStatus, getRolePage, removeRole, batchRemoveRoles } from '@/api'
import AuditCell from '@/components/AuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import IconLabel from '@/components/IconLabel/index.vue'
import RoleCell from '@/components/RoleCell/index.vue'
import StatusCell from '@/components/StatusCell/index.vue'
import StatusSearch from '@/components/StatusSearch/index.vue'
import TextCopyableCell from '@/components/TextCopyableCell/index.vue'
import RoleDetailDrawer from './components/RoleDetailDrawer/index.vue'
import type { RoleDetailResp, RoleQueryReq, RoleResp } from '@/types'

defineOptions({ name: 'RoleManage' })

const router = useRouter()
const searchKey = ref('')

const roleStatusConfig = [
  { value: 1, label: '启用', color: 'rgb(103, 194, 58)' },
  { value: 0, label: '禁用', color: 'rgb(245, 108, 108)' }
]

const statusOptions = [
  { label: '所有', value: undefined },
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]

const loading = ref(false)
const tableData = ref<RoleResp[]>([])
const selectedRows = ref<RoleResp[]>([])
const detailDrawerVisible = ref(false)
const currentRole = ref<RoleDetailResp>({} as RoleDetailResp)
const statusDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentTargetRow = ref<RoleResp | null>(null)
const queryForm = reactive<RoleQueryReq>({
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
    const resp = await getRolePage({ ...queryForm, page: pagination.page, pageSize: pagination.pageSize })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  const key = searchKey.value
  queryForm.id = key
  queryForm.name = key
  queryForm.code = key
  pagination.page = 1
  pagination.pageSize = 10
  loadData()
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

function handleSelectionChange(rows: RoleResp[]) {
  selectedRows.value = rows
}

function handleView(row: RoleResp) {
  currentRole.value = row as unknown as RoleDetailResp
  detailDrawerVisible.value = true
}

function handleCreate() {
  router.push('/system/role/create')
}

function handleEdit(row: RoleResp) {
  router.push({ path: '/system/role/edit', query: { id: row.id } })
}

function handleAssignPermissions(row: RoleResp) {
  router.push({ path: '/system/role/assign-permissions', query: { roleId: row.id } })
}

function handleToggleStatus(row: RoleResp) {
  currentTargetRow.value = row
  statusDialogVisible.value = true
}

function handleDelete(row: RoleResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

async function handleConfirmStatus() {
  if (!currentTargetRow.value) return
  const targetStatus = currentTargetRow.value.status === 1 ? 0 : 1
  const actionText = targetStatus === 1 ? '启用' : '禁用'
  try {
    await changeRoleStatus(currentTargetRow.value.id, { status: targetStatus })
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
    await removeRole(currentTargetRow.value.id)
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
    await batchRemoveRoles(ids)
    ElMessage.success(`成功删除 ${ids.length} 个角色`)
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
.role-table {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $bg-page;
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
      align-items: center;
      gap: 16px;
    }

    .query-form-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
}

.table-body {
  flex: 1;
  overflow-y: auto;
  min-height: 0;

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
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.dialog-content {
  strong {
    color: $color-primary;
  }
}

.delete-role-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  max-height: 3em;
  color: #909399;
}
</style>
