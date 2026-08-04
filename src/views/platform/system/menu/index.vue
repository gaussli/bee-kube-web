<template>
  <div class="menu-table">
    <!-- 表格头部 -->
    <div class="table-header">
      <div class="query-form">
        <div class="query-form-left">
          <BeeInputSearch v-model="searchKey" placeholder="按 ID / 菜单名称 / 编码 搜索" />
          <BeeSegmentedControl v-model="queryForm.status" :options="statusOptions" @select="handleSelect" />
          <BeeSegmentedControl v-model="queryForm.type" :options="typeOptions" @select="handleTypeSelect" />
        </div>
        <div class="query-form-right">
          <BeeButton @click="handleReset">
            <template #icon><Refresh /></template>
            刷新
          </BeeButton>
          <el-divider v-if="hasPermission('system:menu:create')" direction="vertical" />
          <BeeButton v-if="hasPermission('system:menu:create')" type="primary" @click="handleCreate">
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
        <el-table-column min-width="180">
          <template #header>
            <BeeIconLabel icon="menu" label="菜单" />
          </template>
          <template #default="{ row }">
            <MenuCell :code="row.code" :name="row.name" :icon="row.frontIcon" />
          </template>
        </el-table-column>
        <el-table-column prop="type" width="100">
          <template #header>
            <BeeIconLabel icon="folder" label="类型" />
          </template>
          <template #default="{ row }">
            <el-tag :type="typeTagMap[row.type]" size="small">{{ typeTextMap[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="150">
          <template #header>
            <BeeIconLabel icon="menu" label="父菜单" />
          </template>
          <template #default="{ row }">
            <div v-if="row.parentName" class="parent-menu">
              <span class="parent-name">{{ row.parentName }}</span>
              <span class="parent-code">{{ row.parentCode }}</span>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="frontPath" min-width="180">
          <template #header>
            <BeeIconLabel icon="link" label="路由" />
          </template>
          <template #default="{ row }">
            <span class="path">{{ row.frontPath || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="permission" width="180">
          <template #header>
            <BeeIconLabel icon="lock" label="权限" />
          </template>
          <template #default="{ row }">
            <el-tooltip :content="row.permission || '-'" placement="top" :disabled="!row.permission">
              <span class="permission">{{ row.permission || '-' }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="status" width="100">
          <template #header>
            <BeeIconLabel icon="circle-check" label="状态" />
          </template>
          <template #default="{ row }">
            <BeeStatusCell :status="row.status" :options="menuStatusConfig" />
          </template>
        </el-table-column>
        <el-table-column width="180">
          <template #header>
            <BeeIconLabel icon="plus" label="创建" />
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
        <el-table-column width="200" fixed="right">
          <template #header>
            <BeeIconLabel icon="edit-pen" label="操作" />
          </template>
          <template #default="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button
                v-if="hasPermission('system:menu:view')"
                circle
                :icon="View"
                size="default"
                @click="handleView(row)"
              />
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button
                v-if="hasPermission('system:menu:edit')"
                circle
                :icon="EditPen"
                size="default"
                @click="handleEdit(row)"
              />
            </el-tooltip>
            <el-tooltip v-if="hasPermission('system:menu:edit')" content="更多" placement="top">
              <el-dropdown trigger="click">
                <template #default>
                  <el-button circle :icon="MoreFilled" size="default" />
                </template>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-if="row.status === 0 && hasPermission('system:menu:edit')"
                      @click="handleToggleStatus(row)"
                    >
                      <el-icon><CircleCheck /></el-icon> 启用
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="row.status === 1 && hasPermission('system:menu:edit')"
                      @click="handleToggleStatus(row)"
                    >
                      <el-icon><CircleClose /></el-icon> 禁用
                    </el-dropdown-item>
                    <el-dropdown-item v-if="hasPermission('system:menu:edit')" @click="handleAssignRoles(row)">
                      <el-icon><Setting /></el-icon> 配置角色
                    </el-dropdown-item>
                    <el-dropdown-item v-if="hasPermission('system:menu:delete')" divided @click="handleDelete(row)">
                      <el-icon><Delete /></el-icon> 删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>
            <el-tooltip v-else-if="hasPermission('system:menu:delete')" content="删除" placement="top">
              <el-button circle :icon="Delete" size="default" @click="handleDelete(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 表格底部 -->
    <div class="table-footer">
      <BeeButton
        v-if="hasPermission('system:menu:delete')"
        type="danger"
        :disabled="selectedRows.length === 0"
        @click="handleBatchDelete"
      >
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

  <!-- 状态确认 Dialog -->
  <BeeDialog
    v-model="statusDialogVisible"
    :title="currentTargetRow?.status === 1 ? '确认禁用' : '确认启用'"
    @confirm="handleConfirmStatus"
  >
    <div class="dialog-content">
      <p v-if="currentTargetRow?.status === 1">
        确定要禁用菜单 <strong>{{ currentTargetRow?.name }}</strong> 吗？禁用后该菜单将无法访问。
      </p>
      <p v-else>
        确定要启用菜单 <strong>{{ currentTargetRow?.name }}</strong> 吗？启用后该菜单可以正常访问。
      </p>
    </div>
  </BeeDialog>

  <!-- 批量删除 Dialog -->
  <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
    <div class="dialog-content">
      <p>
        确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个菜单吗？
      </p>
      <div class="delete-menu-tags">
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
        确定要删除菜单 <strong>{{ currentTargetRow?.name }}</strong> 吗？
      </p>
    </div>
  </BeeDialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import { useRouter } from 'vue-router'

import { ElMessage } from 'element-plus'

import {
  CircleCheck,
  CircleClose,
  Delete,
  EditPen,
  MoreFilled,
  Plus,
  Refresh,
  Setting,
  View,
} from '@element-plus/icons-vue'

import type { MenuQueryReq, MenuResp } from '@/types/platform/menu'

import { changeMenuStatus, getMenuPage, removeMenu, batchRemoveMenus } from '@/api/platform/menu'

import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeIconLabel from '@/components/BeeIconLabel/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeeLabelCopyable from '@/components/BeeLabelCopyable/index.vue'
import BeeSegmentedControl from '@/components/BeeSegmentedControl/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import MenuCell from '@/components/MenuCell/index.vue'

import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'MenuManage' })

const router = useRouter()
const searchKey = ref('')
const { hasPermission } = usePermission()

const menuStatusConfig = [
  { value: 1, label: '启用', color: 'rgb(103, 194, 58)' },
  { value: 0, label: '禁用', color: 'rgb(245, 108, 108)' },
]

const typeTextMap: Record<number, string> = { 0: '目录', 1: '菜单', 2: '按钮' }
const typeTagMap: Record<number, string> = { 0: 'warning', 1: 'primary', 2: 'info' }

const statusOptions = [
  { label: '所有', value: undefined },
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
]

const typeOptions = [
  { label: '全部', value: undefined },
  { label: '目录', value: 0 },
  { label: '菜单', value: 1 },
  { label: '按钮', value: 2 },
]

const loading = ref(false)
const tableData = ref<MenuResp[]>([])
const selectedRows = ref<MenuResp[]>([])
const statusDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentTargetRow = ref<MenuResp | null>(null)
const queryForm = reactive<MenuQueryReq>({
  id: undefined,
  name: undefined,
  code: undefined,
  type: undefined,
  status: undefined,
  page: 1,
  pageSize: 10,
})
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

async function loadData() {
  loading.value = true
  try {
    const resp = await getMenuPage({ ...queryForm, page: pagination.page, pageSize: pagination.pageSize })
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

function handleTypeSelect(selectValue?: string | number) {
  queryForm.type = selectValue as number | undefined
  pagination.page = 1
  pagination.pageSize = 10
  loadData()
}

function handleReset() {
  searchKey.value = ''
  queryForm.id = undefined
  queryForm.name = undefined
  queryForm.code = undefined
  queryForm.type = undefined
  queryForm.status = undefined
  pagination.page = 1
  pagination.pageSize = 10
  loadData()
}

function handleSelectionChange(rows: MenuResp[]) {
  selectedRows.value = rows
}

function handleView(row: MenuResp) {
  router.push({ name: 'platform:system:menu:detail', params: { id: row.id } })
}

function handleCreate() {
  router.push({ name: 'platform:system:menu:create' })
}

function handleEdit(row: MenuResp) {
  router.push({ name: 'platform:system:menu:edit', params: { id: row.id } })
}

function handleAssignRoles(row: MenuResp) {
  router.push({ name: 'platform:system:menu:assign-roles', params: { menuId: row.id } })
}

function handleToggleStatus(row: MenuResp) {
  currentTargetRow.value = row
  statusDialogVisible.value = true
}

function handleDelete(row: MenuResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

async function handleConfirmStatus() {
  if (!currentTargetRow.value) return
  const targetStatus = currentTargetRow.value.status === 1 ? 0 : 1
  const actionText = targetStatus === 1 ? '启用' : '禁用'
  try {
    await changeMenuStatus(currentTargetRow.value.id, { status: targetStatus })
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
    await removeMenu(currentTargetRow.value.id)
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
    await batchRemoveMenus(ids)
    ElMessage.success(`成功删除 ${ids.length} 个菜单`)
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
.menu-table {
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

.delete-menu-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.path {
  font-family: Monaco, Menlo, monospace;
  font-size: 12px;
  color: $color-success;
}

.permission {
  font-family: Monaco, Menlo, monospace;
  font-size: 12px;
  color: $color-warning;
}

.parent-menu {
  display: flex;
  gap: 2px;
  flex-direction: column;

  .parent-name {
    font-size: 14px;
    line-height: 1.2;
    color: $color-text-primary;
  }

  .parent-code {
    font-size: 12px;
    line-height: 1.2;
    color: $color-text-secondary;
  }
}
</style>
