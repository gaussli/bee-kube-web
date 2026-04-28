<template>
  <div class="cluster-namespace">
    <!-- 表格头部 -->
    <div class="table-header">
      <div class="query-form">
        <div class="query-form-left">
          <BeeInputSearch v-model="searchKey" placeholder="按名称搜索" @search="handleSearch" />
        </div>
        <div class="query-form-right">
          <BeeButton @click="handleReset">
            <template #icon><Refresh /></template>
            刷新
          </BeeButton>
          <el-divider type="primary" direction="vertical" />
          <BeeButton type="primary" @click="handleCreate">
            <template #icon><Plus /></template>
            创建命名空间
          </BeeButton>
        </div>
      </div>
    </div>

    <!-- 表格主体 -->
    <div class="table-body">
      <el-table v-loading="loading" :data="tableData" height="100%">
        <el-table-column prop="name" label="名称" min-width="180">
          <template #default="{ row }">
            <el-link type="primary" @click="handleView(row)">{{ row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'Active' ? 'success' : 'warning'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="label" label="标签" min-width="200">
          <template #default="{ row }">
            <el-tag v-for="(value, key) in row.labels" :key="key" size="small" class="label-tag">
              {{ key }}: {{ value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="podCount" label="Pod 数量" width="120" align="center">
          <template #default="{ row }">
            <el-badge :value="row.podCount" :max="99" type="info" />
          </template>
        </el-table-column>
        <el-table-column prop="age" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button circle :icon="View" size="small" @click="handleView(row)" />
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button circle :icon="EditPen" size="small" @click="handleEdit(row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button circle :icon="Delete" size="small" type="danger" @click="handleDelete(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 表格底部 -->
    <div class="table-footer">
      <div></div>
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

    <!-- 创建/编辑 Dialog -->
    <BeeDialog v-model="formDialogVisible" :title="isEdit ? '编辑命名空间' : '创建命名空间'" @confirm="handleConfirm">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入命名空间名称" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="标签" prop="labels">
          <el-input v-model="form.labelsInput" placeholder="格式: key=value, 多组用回车分隔" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述信息" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
    </BeeDialog>

    <!-- 详情 Dialog -->
    <BeeDialog v-model="detailDialogVisible" title="命名空间详情" width="600px">
      <el-descriptions :column="1" border v-if="currentNs">
        <el-descriptions-item label="名称">{{ currentNs.name }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentNs.status === 'Active' ? 'success' : 'warning'" size="small">
            {{ currentNs.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentNs.age }}</el-descriptions-item>
        <el-descriptions-item label="标签">
          <el-tag v-for="(value, key) in currentNs.labels" :key="key" size="small" class="label-tag">
            {{ key }}: {{ value }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Pod 数量">{{ currentNs.podCount }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ currentNs.description || '-' }}</el-descriptions-item>
      </el-descriptions>
    </BeeDialog>

    <!-- 删除确认 Dialog -->
    <BeeDialog v-model="deleteDialogVisible" title="确认删除" @confirm="handleConfirmDelete">
      <div class="dialog-content">
        <p>确定要删除命名空间 <strong>{{ currentNs?.name }}</strong> 吗？</p>
        <p class="warning-text">此操作将删除该命名空间下的所有资源！</p>
      </div>
    </BeeDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Delete, EditPen, Plus, Refresh, View } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'

defineOptions({ name: 'ClusterNamespace' })

interface NamespaceInfo {
  id: string
  name: string
  status: string
  labels: Record<string, string>
  podCount: number
  age: string
  description?: string
}

const searchKey = ref('')
const loading = ref(false)
const tableData = ref<NamespaceInfo[]>([])
const detailDialogVisible = ref(false)
const formDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const isEdit = ref(false)
const currentNs = ref<NamespaceInfo | null>(null)
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  labelsInput: '',
  description: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入命名空间名称', trigger: 'blur' }]
}

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

function loadData() {
  loading.value = true
  tableData.value = [
    {
      id: '1',
      name: 'default',
      status: 'Active',
      labels: {},
      podCount: 12,
      age: '2024-01-01 10:00:00',
      description: '默认命名空间'
    },
    {
      id: '2',
      name: 'kube-system',
      status: 'Active',
      labels: { 'kubernetes.io/metadata.name': 'kube-system' },
      podCount: 35,
      age: '2024-01-01 10:00:00',
      description: '系统命名空间'
    },
    {
      id: '3',
      name: 'kube-public',
      status: 'Active',
      labels: { 'kubernetes.io/metadata.name': 'kube-public' },
      podCount: 0,
      age: '2024-01-01 10:00:00',
      description: '公共命名空间'
    },
    {
      id: '4',
      name: 'kube-node-lease',
      status: 'Active',
      labels: { 'kubernetes.io/metadata.name': 'kube-node-lease' },
      podCount: 5,
      age: '2024-01-01 10:00:00',
      description: '节点租约命名空间'
    },
    {
      id: '5',
      name: 'dev',
      status: 'Active',
      labels: { 'environment': 'dev', 'team': 'backend' },
      podCount: 28,
      age: '2024-01-10 14:30:00',
      description: '开发环境'
    },
    {
      id: '6',
      name: 'test',
      status: 'Active',
      labels: { 'environment': 'test', 'team': 'qa' },
      podCount: 15,
      age: '2024-01-10 14:35:00',
      description: '测试环境'
    },
    {
      id: '7',
      name: 'staging',
      status: 'Active',
      labels: { 'environment': 'staging' },
      podCount: 22,
      age: '2024-01-10 14:40:00',
      description: '预发布环境'
    },
    {
      id: '8',
      name: 'production',
      status: 'Active',
      labels: { 'environment': 'production' },
      podCount: 45,
      age: '2024-01-10 14:45:00',
      description: '生产环境'
    }
  ]
  pagination.total = tableData.value.length
  loading.value = false
}

function handleSearch() {
  pagination.page = 1
  loadData()
}

function handleReset() {
  searchKey.value = ''
  pagination.page = 1
  loadData()
}

function handleView(row: NamespaceInfo) {
  currentNs.value = row
  detailDialogVisible.value = true
}

function handleEdit(row: NamespaceInfo) {
  isEdit.value = true
  currentNs.value = row
  form.name = row.name
  form.labelsInput = Object.entries(row.labels).map(([k, v]) => `${k}=${v}`).join('\n')
  form.description = row.description || ''
  formDialogVisible.value = true
}

function handleDelete(row: NamespaceInfo) {
  currentNs.value = row
  deleteDialogVisible.value = true
}

function handleCreate() {
  isEdit.value = false
  form.name = ''
  form.labelsInput = ''
  form.description = ''
  formDialogVisible.value = true
}

async function handleConfirm() {
  if (!formRef.value) return
  await formRef.value.validate()
  // TODO: 调用 API
  ElMessage.success(isEdit.value ? '编辑成功' : '创建成功')
  formDialogVisible.value = false
  loadData()
}

async function handleConfirmDelete() {
  if (!currentNs.value) return
  // TODO: 调用 API
  ElMessage.success('删除成功')
  deleteDialogVisible.value = false
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.cluster-namespace {
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
  padding: 0 20px;

  :deep(.el-table) {
    flex: 1;
    width: auto;

    th.el-table__cell {
      padding: 12px 0;
    }

    .label-tag {
      margin-right: 4px;
      margin-bottom: 2px;
    }

    .el-button + .el-button {
      margin-left: 4px;
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
  p {
    margin: 8px 0;
  }

  .warning-text {
    color: $color-danger;
    font-size: 14px;
  }
}
</style>
