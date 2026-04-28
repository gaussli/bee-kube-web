<template>
  <div class="cluster-secret">
    <!-- 表格头部 -->
    <div class="table-header">
      <div class="query-form">
        <div class="query-form-left">
          <BeeInputSearch v-model="searchKey" placeholder="按名称搜索" @search="handleSearch" />
          <el-select v-model="queryForm.namespace" placeholder="选择命名空间" clearable @change="handleNamespaceChange">
            <el-option v-for="ns in namespaces" :key="ns" :label="ns" :value="ns" />
          </el-select>
          <el-select v-model="queryForm.type" placeholder="选择类型" clearable @change="handleTypeChange">
            <el-option v-for="t in secretTypes" :key="t.value" :label="t.label" :value="t.value" />
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
            创建密钥
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
        <el-table-column prop="type" label="类型" width="150">
          <template #default="{ row }">
            <el-tag size="small" :type="getTypeTagType(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dataCount" label="数据项" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.dataCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="keys" label="键" min-width="200">
          <template #default="{ row }">
            <el-tag v-for="key in row.keys" :key="key" size="small" class="key-tag">
              {{ key }}
            </el-tag>
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
    <BeeDialog v-model="detailDialogVisible" title="密钥详情" width="700px">
      <template v-if="currentSecret">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="名称">{{ currentSecret.name }}</el-descriptions-item>
          <el-descriptions-item label="命名空间">{{ currentSecret.namespace }}</el-descriptions-item>
          <el-descriptions-item label="类型">
            <el-tag size="small" :type="getTypeTagType(currentSecret.type)">{{ currentSecret.type }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="数据项数量">{{ currentSecret.dataCount }}</el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">{{ currentSecret.age }}</el-descriptions-item>
        </el-descriptions>
        <div class="data-section">
          <h4>数据内容</h4>
          <el-alert type="warning" :closable="false" show-icon>
            <template #title>
              数据已自动解码，以下为原始内容
            </template>
          </el-alert>
          <el-input type="textarea" :model-value="formatDataYaml(currentSecret.data)" readonly :rows="10" class="data-textarea" />
        </div>
      </template>
    </BeeDialog>

    <!-- 创建/编辑 Dialog -->
    <BeeDialog v-model="formDialogVisible" :title="isEdit ? '编辑密钥' : '创建密钥'" width="700px" @confirm="handleConfirm">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入密钥名称" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="命名空间" prop="namespace">
          <el-select v-model="form.namespace" placeholder="选择命名空间" style="width: 100%">
            <el-option v-for="ns in namespaces" :key="ns" :label="ns" :value="ns" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="选择密钥类型" style="width: 100%">
            <el-option v-for="t in secretTypes" :key="t.value" :label="t.label" :value="t.value" />
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
        <p>确定要删除密钥 <strong>{{ currentSecret?.name }}</strong> 吗？</p>
        <el-alert type="error" :closable="false" show-icon>
          <template #title>
            密钥可能正在被使用，删除后相关应用可能无法正常工作
          </template>
        </el-alert>
      </div>
    </BeeDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Delete, EditPen, Plus, Refresh, View } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { TagType } from 'element-plus'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'

defineOptions({ name: 'ClusterSecret' })

interface SecretInfo {
  id: string
  name: string
  namespace: string
  type: string
  dataCount: number
  keys: string[]
  data?: Record<string, string>
  age: string
}

interface DataItem {
  key: string
  value: string
}

const searchKey = ref('')
const namespaces = ['default', 'kube-system', 'dev', 'test', 'production']
const secretTypes = [
  { label: 'Opaque', value: 'Opaque' },
  { label: 'kubernetes.io/tls', value: 'kubernetes.io/tls' },
  { label: 'kubernetes.io/dockerconfigjson', value: 'kubernetes.io/dockerconfigjson' },
  { label: 'kubernetes.io/basic-auth', value: 'kubernetes.io/basic-auth' },
  { label: 'kubernetes.io/ssh-auth', value: 'kubernetes.io/ssh-auth' }
]
const loading = ref(false)
const tableData = ref<SecretInfo[]>([])
const detailDialogVisible = ref(false)
const formDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const isEdit = ref(false)
const currentSecret = ref<SecretInfo | null>(null)
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  namespace: 'default',
  type: 'Opaque',
  dataItems: [] as DataItem[]
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入密钥名称', trigger: 'blur' }],
  namespace: [{ required: true, message: '请选择命名空间', trigger: 'change' }],
  type: [{ required: true, message: '请选择密钥类型', trigger: 'change' }]
}

const queryForm = reactive({
  name: undefined as string | undefined,
  namespace: undefined as string | undefined,
  type: undefined as string | undefined
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

function getTypeTagType(type: string): TagType {
  switch (type) {
    case 'kubernetes.io/tls':
      return 'success'
    case 'kubernetes.io/dockerconfigjson':
      return 'warning'
    case 'kubernetes.io/basic-auth':
      return 'info'
    default:
      return ''
  }
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
      name: 'mysql-secret',
      namespace: 'production',
      type: 'Opaque',
      dataCount: 3,
      keys: ['username', 'password', 'root-password'],
      data: {
        'username': 'admin',
        'password': 'MySecretPass123',
        'root-password': 'RootPass456'
      },
      age: '2024-01-10 10:00:00'
    },
    {
      id: '2',
      name: 'redis-auth',
      namespace: 'default',
      type: 'Opaque',
      dataCount: 2,
      keys: ['password', 'requirepass'],
      data: {
        'password': 'redis2024',
        'requirepass': 'redis2024'
      },
      age: '2024-01-10 11:00:00'
    },
    {
      id: '3',
      name: 'tls-cert',
      namespace: 'default',
      type: 'kubernetes.io/tls',
      dataCount: 2,
      keys: ['tls.crt', 'tls.key'],
      data: {
        'tls.crt': '-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJAJC1...\n-----END CERTIFICATE-----',
        'tls.key': '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0...\n-----END PRIVATE KEY-----'
      },
      age: '2024-01-11 09:00:00'
    },
    {
      id: '4',
      name: 'dockerhub-secret',
      namespace: 'default',
      type: 'kubernetes.io/dockerconfigjson',
      dataCount: 1,
      keys: ['.dockerconfigjson'],
      data: {
        '.dockerconfigjson': '{"auths":{"docker.io":{"username":"user","password":"pass","email":"user@example.com"}}}'
      },
      age: '2024-01-12 14:00:00'
    },
    {
      id: '5',
      name: 'app-api-key',
      namespace: 'dev',
      type: 'Opaque',
      dataCount: 2,
      keys: ['api-key', 'secret-key'],
      data: {
        'api-key': 'ak_test_1234567890',
        'secret-key': 'sk_test_abcdefghijklmnop'
      },
      age: '2024-01-13 10:00:00'
    },
    {
      id: '6',
      name: 'rabbitmq-credentials',
      namespace: 'production',
      type: 'Opaque',
      dataCount: 4,
      keys: ['username', 'password', 'vhost', 'management-password'],
      data: {
        'username': 'rabbitmq_user',
        'password': 'RabbitPass789',
        'vhost': '/production',
        'management-password': 'MgmtPass456'
      },
      age: '2024-01-14 08:30:00'
    },
    {
      id: '7',
      name: 'gitlab-token',
      namespace: 'dev',
      type: 'kubernetes.io/basic-auth',
      dataCount: 2,
      keys: ['username', 'password'],
      data: {
        'username': 'gitlab-bot',
        'password': 'gitlab_token_xyz'
      },
      age: '2024-01-14 15:00:00'
    },
    {
      id: '8',
      name: 'kubeconfig-token',
      namespace: 'dev',
      type: 'kubernetes.io/ssh-auth',
      dataCount: 1,
      keys: ['ssh-publickey'],
      data: {
        'ssh-publickey': 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ...'
      },
      age: '2024-01-15 09:00:00'
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

function handleTypeChange() {
  pagination.page = 1
  loadData()
}

function handleView(row: SecretInfo) {
  currentSecret.value = row
  detailDialogVisible.value = true
}

function handleEdit(row: SecretInfo) {
  isEdit.value = true
  currentSecret.value = row
  form.name = row.name
  form.namespace = row.namespace
  form.type = row.type
  form.dataItems = row.data
    ? Object.entries(row.data).map(([key, value]) => ({ key, value }))
    : []
  formDialogVisible.value = true
}

function handleDelete(row: SecretInfo) {
  currentSecret.value = row
  deleteDialogVisible.value = true
}

function handleCreate() {
  isEdit.value = false
  form.name = ''
  form.namespace = 'default'
  form.type = 'Opaque'
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
  if (!currentSecret.value) return
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
.cluster-secret {
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

    .key-tag {
      margin: 2px;
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

  .data-textarea {
    margin-top: 12px;

    :deep(.el-textarea__inner) {
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 12px;
    }
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
