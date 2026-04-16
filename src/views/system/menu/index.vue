<template>
  <el-card class="menu-card">
    <el-form :inline="true" :model="queryForm" class="query-form">
      <div class="query-form-left">
        <InputSearch placeholder="按 ID / 菜单名称 / 编码 搜索" @search="handleSearch" />
        <StatusSearch v-model="queryForm.status" :options="statusOptions" @select="handleSelect" />
        <StatusSearch v-model="queryForm.type" :options="typeOptions" @select="handleTypeSelect" />
      </div>
      <div class="query-form-right">
        <el-button :icon="Refresh" @click="handleReset" />
        <el-divider direction="vertical" />
        <el-button type="success" :icon="Plus">新增</el-button>
      </div>
    </el-form>
    <el-table v-loading="loading" :data="tableData" height="100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="60" align="center" />
      <el-table-column prop="id" width="280">
        <template #header>
          <IconLabel :icon="Key" label="ID" />
        </template>
        <template #default="{ row }">
          <TextCopyableCell :text="row.id" />
        </template>
      </el-table-column>
      <el-table-column min-width="180">
        <template #header>
          <IconLabel :icon="Menu" label="菜单" />
        </template>
        <template #default="{ row }">
          <MenuCell :code="row.code" :name="row.name" :icon="row.frontIcon" />
        </template>
      </el-table-column>
      <el-table-column prop="type" width="100">
        <template #header>
          <IconLabel :icon="Folder" label="类型" />
        </template>
        <template #default="{ row }">
          <el-tag :type="typeTagMap[row.type]" size="small">{{ typeTextMap[row.type] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="150">
        <template #header>
          <IconLabel :icon="Menu" label="父菜单" />
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
          <IconLabel :icon="Link" label="路由" />
        </template>
        <template #default="{ row }">
          <span class="path">{{ row.frontPath || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="permission" width="180">
        <template #header>
          <IconLabel :icon="Lock" label="权限" />
        </template>
        <template #default="{ row }">
          <el-tooltip :content="row.permission || '-'" placement="top" :disabled="!row.permission">
            <span class="permission">{{ row.permission || '-' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="status" width="100">
        <template #header>
          <IconLabel :icon="CircleCheck" label="状态" />
        </template>
        <template #default="{ row }">
          <StatusCell :status="row.status" :config="menuStatusConfig" />
        </template>
      </el-table-column>
      <el-table-column width="180">
        <template #header>
          <IconLabel :icon="Plus" label="创建" />
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
            <el-button circle :icon="EditPen" size="default" />
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
                  <el-dropdown-item divided>
                    <el-icon><Delete /></el-icon> 删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <el-button type="danger" :icon="Delete" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
        批量删除 ({{ selectedRows.length }})
      </el-button>
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
  </el-card>
  <MenuDetailDrawer v-model="detailDrawerVisible" :menu-data="currentMenu" />
  <el-dialog v-model="statusDialogVisible" :title="currentTargetRow?.status === 1 ? '确认禁用' : '确认启用'" width="400px" :close-on-click-modal="false">
    <div class="status-dialog-content">
      <p v-if="currentTargetRow?.status === 1">
        确定要禁用菜单 <strong>{{ currentTargetRow?.name }}</strong> 吗？禁用后该菜单将无法访问。
      </p>
      <p v-else>
        确定要启用菜单 <strong>{{ currentTargetRow?.name }}</strong> 吗？启用后该菜单可以正常访问。
      </p>
    </div>
    <template #footer>
      <el-button @click="statusDialogVisible = false">取消</el-button>
      <el-button :type="currentTargetRow?.status === 1 ? 'danger' : 'success'" @click="handleConfirmStatus">
        {{ currentTargetRow?.status === 1 ? '禁用' : '启用' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck, CircleClose, Delete, EditPen, Folder, Key, Link, Lock, Menu, MoreFilled, Plus, Refresh, View } from '@element-plus/icons-vue'
import type { MenuDetailResp, MenuQueryReq, MenuResp } from '@/types'
import { getMenuPage } from '@/api'
import AuditCell from '@/components/AuditCell/index.vue'
import IconLabel from '@/components/IconLabel/index.vue'
import InputSearch from '@/components/InputSearch/index.vue'
import MenuCell from '@/components/MenuCell/index.vue'
import StatusCell from '@/components/StatusCell/index.vue'
import StatusSearch from '@/components/StatusSearch/index.vue'
import TextCopyableCell from '@/components/TextCopyableCell/index.vue'
import MenuDetailDrawer from './components/MenuDetailDrawer/index.vue'

defineOptions({ name: 'MenuManage' })

const menuStatusConfig = [
  { value: 1, label: '启用', color: 'rgb(103, 194, 58)' },
  { value: 0, label: '禁用', color: 'rgb(245, 108, 108)' }
]

const typeTextMap: Record<number, string> = { 0: '目录', 1: '菜单', 2: '按钮' }
const typeTagMap: Record<number, string> = { 0: 'warning', 1: 'primary', 2: 'info' }

const statusOptions = [
  { label: '所有', value: undefined },
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]

const typeOptions = [
  { label: '全部', value: undefined },
  { label: '目录', value: 0 },
  { label: '菜单', value: 1 },
  { label: '按钮', value: 2 }
]

const loading = ref(false)
const tableData = ref<MenuResp[]>([])
const selectedRows = ref<MenuResp[]>([])
const detailDrawerVisible = ref(false)
const currentMenu = ref<MenuDetailResp>({} as MenuDetailResp)
const statusDialogVisible = ref(false)
const currentTargetRow = ref<MenuResp | null>(null)
const queryForm = reactive<MenuQueryReq>({
  id: undefined,
  name: undefined,
  code: undefined,
  type: undefined,
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
    const resp = await getMenuPage({ ...queryForm, page: pagination.page, pageSize: pagination.pageSize })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

function handleSearch(searchKey?: string) {
  queryForm.id = searchKey
  queryForm.name = searchKey
  queryForm.code = searchKey
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

function handleTypeSelect(selectValue?: string | number) {
  queryForm.type = selectValue as number | undefined
  pagination.page = 1
  pagination.pageSize = 10
  loadData()
}

function handleReset() {
  queryForm.id = undefined
  queryForm.name = undefined
  queryForm.code = undefined
  queryForm.type = undefined
  queryForm.status = undefined
  queryForm.page = 1
  queryForm.pageSize = 10
  pagination.page = 1
  pagination.pageSize = 10
  loadData()
}

function handleSelectionChange(rows: MenuResp[]) {
  selectedRows.value = rows
}

function handleView(row: MenuResp) {
  currentMenu.value = row as unknown as MenuDetailResp
  detailDrawerVisible.value = true
}

function handleToggleStatus(row: MenuResp) {
  currentTargetRow.value = row
  statusDialogVisible.value = true
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

async function handleBatchDelete() {
  const ids = selectedRows.value.map(row => row.id)
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${ids.length} 个菜单吗？`, '提示', { type: 'warning' })
    // TODO: 调用批量删除 API
    ElMessage.success('删除成功')
    selectedRows.value = []
    loadData()
  } catch {
    // 取消操作
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.menu-card {
  height: 100%;

  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
  }
}

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

:deep(.el-table) {
  flex: 1;
  width: auto;

  th.el-table__cell {
    padding: 12px 0;
  }

  .el-button + .el-button {
    margin-left: 8px;
  }

  .el-button + .el-dropdown {
    margin-left: 8px;
  }
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

.path {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #67c23a;
}

.permission {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #e6a23c;
}

.parent-id {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #909399;
}

.parent-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .parent-name {
    font-size: 14px;
    color: #303133;
    line-height: 1.2;
  }

  .parent-code {
    font-size: 12px;
    color: #909399;
    line-height: 1.2;
  }
}

.status-dialog-content {
  p {
    margin: 0;
    line-height: 1.6;
    strong {
      color: #409eff;
    }
  }
}
</style>
