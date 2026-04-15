<template>
  <div class="user-list">
    <el-card class="query-card">
      <el-form :inline="true" :model="queryForm" class="query-form">
        <el-form-item label="用户名">
          <el-input v-model="queryForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="queryForm.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          <el-button v-if="selectedRows.length > 0" type="danger" :icon="Delete" @click="handleBatchDelete"> 批量删除 ({{ selectedRows.length }}) </el-button>
          <el-button type="primary" :icon="Plus">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table-card">
      <el-table v-loading="loading" :data="tableData" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
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
            <StatusCell :status="row.status" />
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
        <el-table-column width="180" fixed="right">
          <template #header>
            <IconLabel :icon="EditPen" label="操作" />
          </template>
          <template #default>
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Key, Plus, Refresh, Search, User, CircleCheck, Clock, EditPen } from '@element-plus/icons-vue'
import { getUserPage } from '@/api'
import AuditCell from '@/components/AuditCell/index.vue'
import IconLabel from '@/components/IconLabel/index.vue'
import StatusCell from '@/components/StatusCell/index.vue'
import TextCopyableCell from '@/components/TextCopyableCell/index.vue'
import UserCell from '@/components/UserCell/index.vue'
import type { UserQueryReq } from '@/types'
import type { UserResp } from '@/types'

defineOptions({ name: 'UserManage' })

const loading = ref(false)
const tableData = ref<UserResp[]>([])
const selectedRows = ref<UserResp[]>([])
const queryForm = reactive<UserQueryReq>({
  username: '',
  nickname: '',
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
    const resp = await getUserPage({ ...queryForm, page: pagination.page, pageSize: pagination.pageSize })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  loadData()
}

function handleReset() {
  queryForm.username = ''
  queryForm.nickname = ''
  queryForm.status = undefined
  handleSearch()
}

function handleSelectionChange(rows: UserResp[]) {
  selectedRows.value = rows
}

async function handleBatchDelete() {
  const ids = selectedRows.value.map(row => row.id)
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${ids.length} 个用户吗？`, '提示', { type: 'warning' })
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
.user-list {
  display: flex;
  flex-direction: column;
  height: 100%;

  .query-card {
    flex-shrink: 0;
    margin-bottom: 16px;

    :deep(.el-card__body) {
      padding: 0;
    }
  }

  .table-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
    }
  }

  .query-form {
    margin-bottom: 0;
  }

  .pagination {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  :deep(.el-table) {
    flex: 1;
    --el-table-border-color: transparent;
    border-radius: $border-radius-lg;

    th.el-table__cell {
      background-color: $bg-color;
      padding: 14px 0;
    }

    tr:hover > td.el-table__cell {
      border-radius: $border-radius;
    }
  }

  :deep(.el-table__body) {
    border-collapse: separate;
    border-spacing: 0 8px;
  }
}
</style>
