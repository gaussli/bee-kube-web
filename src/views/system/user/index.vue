<template>
  <div class="user-list">
    <el-card>
      <template #header>
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
          </el-form-item>
        </el-form>
        <div class="card-header">
          <span>用户管理</span>
          <div class="actions">
            <el-button v-if="selectedRows.length > 0" type="danger" :icon="Delete" @click="handleBatchDelete"> 批量删除 ({{ selectedRows.length }}) </el-button>
            <el-button type="primary" :icon="Plus">新增用户</el-button>
          </div>
        </div>
      </template>
      <el-table v-loading="loading" :data="tableData" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="300">
          <template #default="{ row }">
            <TextCopyableCell :text="row.id" />
          </template>
        </el-table-column>
        <el-table-column label="账号" min-width="150">
          <template #default="{ row }">
            <UserCell :username="row.username" :nickname="row.nickname" :avatar="row.avatarId" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <StatusCell :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建" width="180">
          <template #default="{ row }">
            <AuditCell :user="row.createBy" :time="row.createAt" />
          </template>
        </el-table-column>
        <el-table-column label="更新" width="180">
          <template #default="{ row }">
            <AuditCell :user="row.updateBy" :time="row.updateAt" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
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
          layout="total, sizes, prev, pager, next"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Delete, Plus, Refresh, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserPage } from '@/api/user'
import TextCopyableCell from '@/components/TextCopyableCell/index.vue'
import UserCell from '@/components/UserCell/index.vue'
import StatusCell from '@/components/StatusCell/index.vue'
import AuditCell from '@/components/AuditCell/index.vue'
import type { UserQueryReq } from '@/types'
import type { UserResp } from '@/types/user'

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
  .query-form {
    margin-bottom: 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .actions {
      display: flex;
      gap: $spacing-sm;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>
