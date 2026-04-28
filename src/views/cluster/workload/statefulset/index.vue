<template>
  <div class="cluster-statefulset">
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
            创建有状态应用
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
        <el-table-column prop="ready" label="就绪" width="120">
          <template #default="{ row }">
            <span :class="row.ready === row.desired ? 'text-success' : 'text-warning'">
              {{ row.ready }}/{{ row.desired }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="serviceName" label="服务名" width="150" />
        <el-table-column prop="volumeClaims" label="存储卷" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.volumeClaims }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="image" label="镜像" min-width="200" show-overflow-tooltip />
        <el-table-column prop="age" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button circle :icon="View" size="small" @click="handleView(row)" />
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button circle :icon="EditPen" size="small" @click="handleEdit(row)" />
            </el-tooltip>
            <el-tooltip content="扩缩容" placement="top">
              <el-button circle :icon="ScaleToOriginal" size="small" @click="handleScale(row)" />
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
    <BeeDialog v-model="detailDialogVisible" title="有状态应用详情" width="800px">
      <el-descriptions :column="2" border v-if="currentStatefulset">
        <el-descriptions-item label="名称">{{ currentStatefulset.name }}</el-descriptions-item>
        <el-descriptions-item label="命名空间">{{ currentStatefulset.namespace }}</el-descriptions-item>
        <el-descriptions-item label="就绪 Pod">{{ currentStatefulset.ready }}/{{ currentStatefulset.desired }}</el-descriptions-item>
        <el-descriptions-item label="服务名">{{ currentStatefulset.serviceName }}</el-descriptions-item>
        <el-descriptions-item label="存储卷数量">{{ currentStatefulset.volumeClaims }}</el-descriptions-item>
        <el-descriptions-item label="标签">{{ formatLabels(currentStatefulset.labels) }}</el-descriptions-item>
        <el-descriptions-item label="镜像" :span="2">{{ currentStatefulset.image }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentStatefulset.age }}</el-descriptions-item>
      </el-descriptions>
    </BeeDialog>

    <!-- 扩缩容 Dialog -->
    <BeeDialog v-model="scaleDialogVisible" title="调整副本数" @confirm="handleConfirmScale">
      <el-form :model="scaleForm" label-width="100px">
        <el-form-item label="当前副本数">
          <el-input-number v-model="scaleForm.currentReplicas" :min="0" :max="100" disabled />
        </el-form-item>
        <el-form-item label="目标副本数">
          <el-input-number v-model="scaleForm.targetReplicas" :min="0" :max="100" />
        </el-form-item>
        <el-form-item>
          <el-alert type="warning" :closable="false" show-icon>
            <template #title>
              有状态应用扩缩容会按顺序进行，请确保数据已备份
            </template>
          </el-alert>
        </el-form-item>
      </el-form>
    </BeeDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { EditPen, Plus, Refresh, ScaleToOriginal, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'

defineOptions({ name: 'ClusterStatefulset' })

interface StatefulsetInfo {
  id: string
  name: string
  namespace: string
  ready: number
  desired: number
  serviceName: string
  volumeClaims: number
  image: string
  labels: Record<string, string>
  age: string
}

const searchKey = ref('')
const namespaces = ['default', 'dev', 'test', 'production']
const loading = ref(false)
const tableData = ref<StatefulsetInfo[]>([])
const detailDialogVisible = ref(false)
const scaleDialogVisible = ref(false)
const currentStatefulset = ref<StatefulsetInfo | null>(null)

const queryForm = reactive({
  name: undefined as string | undefined,
  namespace: 'default'
})

const scaleForm = reactive({
  currentReplicas: 0,
  targetReplicas: 0
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

function formatLabels(labels: Record<string, string>) {
  return Object.entries(labels).map(([k, v]) => `${k}=${v}`).join(', ') || '-'
}

function loadData() {
  loading.value = true
  tableData.value = [
    {
      id: '1',
      name: 'mysql-primary',
      namespace: 'production',
      ready: 1,
      desired: 1,
      serviceName: 'mysql-primary',
      volumeClaims: 2,
      image: 'mysql:8.0',
      labels: { app: 'mysql', role: 'primary' },
      age: '2024-01-01 10:00:00'
    },
    {
      id: '2',
      name: 'mysql-replica',
      namespace: 'production',
      ready: 2,
      desired: 2,
      serviceName: 'mysql-replica',
      volumeClaims: 2,
      image: 'mysql:8.0',
      labels: { app: 'mysql', role: 'replica' },
      age: '2024-01-01 10:30:00'
    },
    {
      id: '3',
      name: 'redis-master',
      namespace: 'default',
      ready: 1,
      desired: 1,
      serviceName: 'redis-master',
      volumeClaims: 1,
      image: 'redis:7-alpine',
      labels: { app: 'redis', role: 'master' },
      age: '2024-01-05 14:00:00'
    },
    {
      id: '4',
      name: 'redis-replica',
      namespace: 'default',
      ready: 3,
      desired: 3,
      serviceName: 'redis-replica',
      volumeClaims: 1,
      image: 'redis:7-alpine',
      labels: { app: 'redis', role: 'replica' },
      age: '2024-01-05 14:30:00'
    },
    {
      id: '5',
      name: 'elasticsearch',
      namespace: 'dev',
      ready: 3,
      desired: 3,
      serviceName: 'elasticsearch',
      volumeClaims: 1,
      image: 'elasticsearch:8.11.0',
      labels: { app: 'elasticsearch', cluster: 'dev' },
      age: '2024-01-10 09:00:00'
    },
    {
      id: '6',
      name: 'kafka-broker',
      namespace: 'dev',
      ready: 3,
      desired: 3,
      serviceName: 'kafka',
      volumeClaims: 1,
      image: 'confluentinc/cp-kafka:7.5.0',
      labels: { app: 'kafka', tier: 'broker' },
      age: '2024-01-12 11:00:00'
    },
    {
      id: '7',
      name: 'minio-instance',
      namespace: 'dev',
      ready: 4,
      desired: 4,
      serviceName: 'minio',
      volumeClaims: 1,
      image: 'minio/minio:latest',
      labels: { app: 'minio', mode: 'distributed' },
      age: '2024-01-14 08:30:00'
    },
    {
      id: '8',
      name: 'postgresql-primary',
      namespace: 'test',
      ready: 1,
      desired: 1,
      serviceName: 'postgresql-primary',
      volumeClaims: 1,
      image: 'postgres:16-alpine',
      labels: { app: 'postgresql', role: 'primary' },
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

function handleView(row: StatefulsetInfo) {
  currentStatefulset.value = row
  detailDialogVisible.value = true
}

function handleEdit(row: StatefulsetInfo) {
  console.log('Edit:', row)
}

function handleScale(row: StatefulsetInfo) {
  currentStatefulset.value = row
  scaleForm.currentReplicas = row.desired
  scaleForm.targetReplicas = row.desired
  scaleDialogVisible.value = true
}

function handleCreate() {
  console.log('Create statefulset')
}

function handleConfirmScale() {
  ElMessage.success(`已将副本数调整为 ${scaleForm.targetReplicas}`)
  scaleDialogVisible.value = false
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.cluster-statefulset {
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

    .text-success {
      color: $color-success;
      font-weight: 500;
    }

    .text-warning {
      color: $color-warning;
      font-weight: 500;
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
</style>
