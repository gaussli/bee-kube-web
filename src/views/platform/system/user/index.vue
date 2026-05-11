<template>
  <div class="user-table">
    <!-- 表格头部 -->
    <div class="table-header">
      <div class="query-form">
        <div class="query-form-left">
          <BeeInputSearch v-model="searchKey" placeholder="按 ID / 用户名 / 昵称 搜索" @search="handleSearch" />
          <BeeRadioSearch v-model="queryForm.status" :options="statusOptions" @select="handleSelect" />
        </div>
        <div class="query-form-right">
          <BeeButton @click="handleReset">
            <template #icon><Refresh /></template>
            刷新
          </BeeButton>
          <el-divider v-if="hasPermission('platform:system:user:create')" type="primary" @click="handleCreate" direction="vertical" />
          <BeeButton v-if="hasPermission('platform:system:user:create')" type="primary" @click="handleCreate">
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
        <el-table-column min-width="150">
          <template #header>
            <IconLabel :icon="User" label="账号" />
          </template>
          <template #default="{ row }">
            <UserCell :username="row.username" :nickname="row.nickname" :avatar="row.avatarId" :gender="row.gender" />
          </template>
        </el-table-column>
        <el-table-column prop="status" width="100">
          <template #header>
            <IconLabel :icon="CircleCheck" label="状态" />
          </template>
          <template #default="{ row }">
            <BeeStatus :status="row.status" :config="userStatusConfig" />
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
            <IconLabel :icon="Clock" label="更新" />
          </template>
          <template #default="{ row }">
            <AuditCell :user="row.updateBy" :time="row.updateAt" />
          </template>
        </el-table-column>
        <el-table-column width="150" fixed="right">
          <template #header>
            <IconLabel :icon="EditPen" label="操作" />
          </template>
          <template #default="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button v-if="hasPermission('platform:system:user:view')" circle :icon="View" size="default" @click="handleView(row)" />
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button v-if="hasPermission('platform:system:user:edit')" circle :icon="EditPen" size="default" @click="handleEdit(row)" />
            </el-tooltip>

            <el-tooltip v-if="hasPermission('platform:system:user:edit')" content="更多" placement="top">
              <el-dropdown trigger="click">
                <template #default>
                  <el-button circle :icon="MoreFilled" size="default" />
                </template>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="row.status === 0 && hasPermission('platform:system:user:edit')" @click="handleToggleStatus(row)">
                      <el-icon><CircleCheck /></el-icon> 启用
                    </el-dropdown-item>
                    <el-dropdown-item v-if="row.status === 1 && hasPermission('platform:system:user:edit')" @click="handleToggleStatus(row)">
                      <el-icon><CircleClose /></el-icon> 禁用
                    </el-dropdown-item>
                    <el-dropdown-item v-if="hasPermission('platform:system:user:edit')" @click="handleAssignRoles(row)">
                      <el-icon><Setting /></el-icon> 配置角色
                    </el-dropdown-item>
                    <el-dropdown-item v-if="hasPermission('platform:system:user:delete')" divided @click="handleDelete(row)">
                      <el-icon><Delete /></el-icon> 删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>
            <el-tooltip v-else-if="hasPermission('platform:system:user:delete')" content="删除" placement="top">
              <el-button circle :icon="Delete" size="default" @click="handleDelete(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 表格底部 -->
    <div class="table-footer">
      <div>
        <BeeButton v-if="hasPermission('platform:system:user:delete')" type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
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
  </div>

  <!-- 状态确认 Dialog -->
  <BeeDialog v-model="statusDialogVisible" :title="currentTargetRow?.status === 1 ? '确认禁用' : '确认启用'" @confirm="handleConfirmStatus">
    <div class="dialog-content">
      <p v-if="currentTargetRow?.status === 1">
        确定要禁用用户 <strong>{{ currentTargetRow?.username }}</strong> 吗？禁用后该用户将无法登录系统。
      </p>
      <p v-else>
        确定要启用用户 <strong>{{ currentTargetRow?.username }}</strong> 吗？启用后该用户可以正常登录系统。
      </p>
    </div>
  </BeeDialog>

  <!-- 批量删除 Dialog -->
  <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
    <div class="dialog-content">
      <p>
        确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个用户吗？
      </p>
      <div class="delete-user-tags">
        <BeeTag v-for="row in selectedRows" :key="row.id">
          {{ row.username }}
        </BeeTag>
      </div>
    </div>
  </BeeDialog>

  <!-- 单个删除 Dialog -->
  <BeeDialog v-model="deleteDialogVisible" title="确认删除" @confirm="handleConfirmDelete">
    <div class="dialog-content">
      <p>
        确定要删除用户 <strong>{{ currentTargetRow?.username }}</strong> 吗？
      </p>
    </div>
  </BeeDialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Delete, Key, MoreFilled, Plus, Refresh, Setting, User, CircleCheck, CircleClose, Clock, EditPen, View } from '@element-plus/icons-vue'
import { type UserQueryReq, type UserResp } from '@/types'
import { getUserPage } from '@/api'
import AuditCell from '@/components/AuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeeRadioSearch from '@/components/BeeRadioSearch/index.vue'
import BeeStatus from '@/components/BeeStatus/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import IconLabel from '@/components/IconLabel/index.vue'
import TextCopyableCell from '@/components/TextCopyableCell/index.vue'
import UserCell from '@/components/UserCell/index.vue'
import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'UserManage' })

// 权限校验
const { hasPermission } = usePermission()

const router = useRouter()
const searchKey = ref('')

const userStatusConfig = [
  { value: 1, label: '启用', color: 'rgb(103, 194, 58)' },
  { value: 0, label: '禁用', color: 'rgb(245, 108, 108)' }
]

const statusOptions = [
  { label: '所有', value: undefined },
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]

const loading = ref(false)
const tableData = ref<UserResp[]>([])
const selectedRows = ref<UserResp[]>([])
const statusDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentTargetRow = ref<UserResp | null>(null)
const queryForm = reactive<UserQueryReq>({
  id: undefined,
  username: undefined,
  nickname: undefined,
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
  console.log(queryForm)
  loading.value = true
  try {
    const resp = await getUserPage({ ...queryForm, page: pagination.page, pageSize: pagination.pageSize })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  const key = searchKey.value
  queryForm.id = key
  queryForm.username = key
  queryForm.nickname = key
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
  queryForm.id = undefined
  queryForm.username = undefined
  queryForm.nickname = undefined
  queryForm.status = undefined
  queryForm.page = 1
  queryForm.pageSize = 10
  pagination.page = 1
  pagination.pageSize = 10
  loadData()
}

function handleSelectionChange(rows: UserResp[]) {
  selectedRows.value = rows
}

function handleView(row: UserResp) {
  router.push({ name: 'platform:system:user:detail', params: { id: row.id } })
}

function handleCreate() {
  router.push({ name: 'platform:system:user:create' })
}

function handleEdit(row: UserResp) {
  router.push({ name: 'platform:system:user:edit', params: { id: row.id } })
}

function handleToggleStatus(row: UserResp) {
  currentTargetRow.value = row
  statusDialogVisible.value = true
}

function handleAssignRoles(row: UserResp) {
  router.push({ name: 'platform:system:user:assign-roles', params: { id: row.id } })
}

function handleDelete(row: UserResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    // TODO: 调用删除 API
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
    currentTargetRow.value = null
    loadData()
  } catch {
    // 失败处理
  }
}

async function handleConfirmStatus() {
  if (!currentTargetRow.value) return
  const targetStatus = currentTargetRow.value.status === 1 ? 0 : 1
  const actionText = targetStatus === 1 ? '启用' : '禁用'
  try {
    // TODO: 调用 API
    ElMessage.success(`${actionText}成功`)
    statusDialogVisible.value = false
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
    // TODO: 调用批量删除 API
    ElMessage.success(`成功删除 ${ids.length} 个用户`)
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
.user-table {
  display: flex;
  flex-direction: column;
  height: 100%;
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

.delete-user-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}
</style>
