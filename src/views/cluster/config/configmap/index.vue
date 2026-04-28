<template>
  <div class="cluster-configmap">
    <!-- 表格头部 -->
    <div class="table-header">
      <div class="query-form">
        <div class="query-form-left">
          <BeeInputSearch v-model="searchKey" placeholder="按名称搜索" @search="handleSearch" />
          <el-select v-model="queryForm.namespace" placeholder="选择命名空间" clearable @change="handleNamespaceChange">
            <el-option v-for="ns in namespaces" :key="ns" :label="ns" :value="ns" />
          </el-select>
        </div>
        <div class="query-form-right">
          <BeeButton @click="handleReset">
            <template #icon><Refresh /></template>
            刷新
          </BeeButton>
          <el-divider type="primary" direction="vertical" />
          <BeeButton type="primary" @click="handleCreate">
            <template #icon><Plus /></template>
            创建配置映射
          </BeeButton>
        </div>
      </div>
    </div>

    <!-- 表格主体 -->
    <div class="table-body">
      <el-table v-loading="loading" :data="tableData" height="100%">
        <el-table-column prop="name" label="名称" min-width="200">
          <template #default="{ row }">
            <el-link type="primary" @click="handleView(row)">{{ row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="namespace" label="命名空间" width="120" />
        <el-table-column prop="dataCount" label="数据项" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.dataCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="data" label="键值对" min-width="300">
          <template #default="{ row }">
            <el-tooltip v-if="row.data && Object.keys(row.data).length > 0" placement="top" :content="formatData(row.data)">
              <div class="data-preview">
                <el-tag v-for="(value, key) in row.data" :key="key" size="small" class="data-tag">
                  {{ key }}
                </el-tag>
              </div>
            </el-tooltip>
            <span v-else class="text-muted">-</span>
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

    <!-- 详情 Dialog -->
    <BeeDialog v-model="detailDialogVisible" title="配置映射详情" width="700px">
      <template v-if="currentConfigmap">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="名称">{{ currentConfigmap.name }}</el-descriptions-item>
          <el-descriptions-item label="命名空间">{{ currentConfigmap.namespace }}</el-descriptions-item>
          <el-descriptions-item label="数据项数量">{{ currentConfigmap.dataCount }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentConfigmap.age }}</el-descriptions-item>
        </el-descriptions>
        <div class="data-section">
          <h4>数据内容</h4>
          <el-input type="textarea" :model-value="formatDataYaml(currentConfigmap.data)" readonly :rows="10" />
        </div>
      </template>
    </BeeDialog>

    <!-- 创建/编辑 Dialog -->
    <BeeDialog v-model="formDialogVisible" :title="isEdit ? '编辑配置映射' : '创建配置映射'" width="700px" @confirm="handleConfirm">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入配置映射名称" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="命名空间" prop="namespace">
          <el-select v-model="form.namespace" placeholder="选择命名空间" style="width: 100%">
            <el-option v-for="ns in namespaces" :key="ns" :label="ns" :value="ns" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据项" prop="data">
          <div class="data-editor">
            <div class="data-editor-header">
              <span>键</span>
              <span>值</span>
              <span>操作</span>
            </div>
            <div v-for="(item, index) in form.dataItems" :key="index" class="data-editor-row">
              <el-input v-model="item.key" placeholder="键" />
              <el-input v-model="item.value" placeholder="值" type="textarea" :rows="2" />
              <el-button circle :icon="Delete" size="small" type="danger" @click="removeDataItem(index)" />
            </div>
            <el-button type="primary" plain @click="addDataItem">
              <template #icon><Plus /></template>
              添加数据项
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </BeeDialog>

    <!-- 删除确认 Dialog -->
    <BeeDialog v-model="deleteDialogVisible" title="确认删除" @confirm="handleConfirmDelete">
      <div class="dialog-content">
        <p>确定要删除配置映射 <strong>{{ currentConfigmap?.name }}</strong> 吗？</p>
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

defineOptions({ name: 'ClusterConfigmap' })

interface ConfigmapInfo {
  id: string
  name: string
  namespace: string
  dataCount: number
  data?: Record<string, string>
  age: string
}

interface DataItem {
  key: string
  value: string
}

const searchKey = ref('')
const namespaces = ['default', 'kube-system', 'dev', 'test', 'production']
const loading = ref(false)
const tableData = ref<ConfigmapInfo[]>([])
const detailDialogVisible = ref(false)
const formDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const isEdit = ref(false)
const currentConfigmap = ref<ConfigmapInfo | null>(null)
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  namespace: 'default',
  dataItems: [] as DataItem[]
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入配置映射名称', trigger: 'blur' }],
  namespace: [{ required: true, message: '请选择命名空间', trigger: 'change' }]
}

const queryForm = reactive({
  name: undefined as string | undefined,
  namespace: undefined as string | undefined
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

function formatData(data?: Record<string, string>) {
  if (!data) return ''
  return Object.entries(data).map(([k, v]) => `${k}=${v}`).join('\n')
}

function formatDataYaml(data?: Record<string, string>) {
  if (!data) return ''
  return Object.entries(data)
    .map(([k, v]) => `${k}: |-\n  ${v.replace(/\n/g, '\n  ')}`)
    .join('\n')
}

function loadData() {
  loading.value = true
  tableData.value = [
    {
      id: '1',
      name: 'nginx-config',
      namespace: 'default',
      dataCount: 3,
      data: {
        'nginx.conf': 'worker_processes 4;\nerror_log /var/log/nginx/error.log warn;',
        'default.conf': 'server {\n  listen 80;\n  server_name localhost;\n}',
        'health-check.sh': '#!/bin/bash\necho "OK"'
      },
      age: '2024-01-10 10:00:00'
    },
    {
      id: '2',
      name: 'app-env-config',
      namespace: 'dev',
      dataCount: 5,
      data: {
        'DATABASE_HOST': 'mysql-dev',
        'DATABASE_PORT': '3306',
        'REDIS_HOST': 'redis-dev',
        'LOG_LEVEL': 'debug',
        'API_URL': 'http://api-dev.example.com'
      },
      age: '2024-01-12 14:30:00'
    },
    {
      id: '3',
      name: 'app-env-config',
      namespace: 'production',
      dataCount: 5,
      data: {
        'DATABASE_HOST': 'mysql-prod',
        'DATABASE_PORT': '3306',
        'REDIS_HOST': 'redis-prod',
        'LOG_LEVEL': 'info',
        'API_URL': 'https://api.example.com'
      },
      age: '2024-01-12 14:35:00'
    },
    {
      id: '4',
      name: 'redis-config',
      namespace: 'default',
      dataCount: 2,
      data: {
        'redis.conf': 'maxmemory 2gb\nmaxmemory-policy allkeys-lru',
        'init.sh': '#!/bin/bash\nredis-server /etc/redis/redis.conf'
      },
      age: '2024-01-13 09:00:00'
    },
    {
      id: '5',
      name: 'feature-flags',
      namespace: 'dev',
      dataCount: 4,
      data: {
        'ENABLE_NEW_UI': 'true',
        'ENABLE_ANALYTICS': 'false',
        'MAX_UPLOAD_SIZE': '10MB',
        'RATE_LIMIT': '100'
      },
      age: '2024-01-14 11:00:00'
    },
    {
      id: '6',
      name: 'kube-dns',
      namespace: 'kube-system',
      dataCount: 1,
      data: {
        'stubDomains': '{}',
        'upstreamNameservers': '["8.8.8.8","8.8.4.4"]'
      },
      age: '2024-01-01 10:00:00'
    },
    {
      id: '7',
      name: 'fluentd-config',
      namespace: 'default',
      dataCount: 2,
      data: {
        'fluent.conf': '@include configs.d/*.conf',
        'parsers.conf': '@include parsers.d/*.conf'
      },
      age: '2024-01-15 08:30:00'
    },
    {
      id: '8',
      name: 'prometheus-config',
      namespace: 'default',
      dataCount: 1,
      data: {
        'prometheus.yml': 'global:\n  scrape_interval: 15s\nscrape_configs:\n  - job_name: "kubernetes-nodes"'
      },
      age: '2024-01-15 10:00:00'
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

function handleNamespaceChange() {
  pagination.page = 1
  loadData()
}

function handleView(row: ConfigmapInfo) {
  currentConfigmap.value = row
  detailDialogVisible.value = true
}

function handleEdit(row: ConfigmapInfo) {
  isEdit.value = true
  currentConfigmap.value = row
  form.name = row.name
  form.namespace = row.namespace
  form.dataItems = row.data
    ? Object.entries(row.data).map(([key, value]) => ({ key, value }))
    : []
  formDialogVisible.value = true
}

function handleDelete(row: ConfigmapInfo) {
  currentConfigmap.value = row
  deleteDialogVisible.value = true
}

function handleCreate() {
  isEdit.value = false
  form.name = ''
  form.namespace = 'default'
  form.dataItems = []
  formDialogVisible.value = true
}

function addDataItem() {
  form.dataItems.push({ key: '', value: '' })
}

function removeDataItem(index: number) {
  form.dataItems.splice(index, 1)
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
  if (!currentConfigmap.value) return
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
.cluster-configmap {
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
      gap: 12px;
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

    .data-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      .data-tag {
        margin: 2px;
      }
    }

    .text-muted {
      color: $text-placeholder;
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

.data-section {
  margin-top: 20px;

  h4 {
    margin-bottom: 12px;
    color: $text-primary;
    font-weight: 500;
  }
}

.data-editor {
  width: 100%;

  .data-editor-header {
    display: grid;
    grid-template-columns: 1fr 2fr 50px;
    gap: 8px;
    padding: 8px 0;
    font-size: 12px;
    color: $text-secondary;
  }

  .data-editor-row {
    display: grid;
    grid-template-columns: 1fr 2fr 50px;
    gap: 8px;
    margin-bottom: 8px;
    align-items: start;
  }
}

.dialog-content {
  p {
    margin: 8px 0;
  }
}
</style>
