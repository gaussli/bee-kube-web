<template>
  <div class="cluster-daemonset">
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
            创建守护进程
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
        <el-table-column prop="desired" label="期望节点" width="100" align="center" />
        <el-table-column prop="ready" label="就绪" width="100" align="center">
          <template #default="{ row }">
            <span :class="row.ready === row.desired ? 'text-success' : 'text-warning'">
              {{ row.ready }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="current" label="当前" width="100" align="center" />
        <el-table-column prop="upToDate" label="最新" width="100" align="center" />
        <el-table-column prop="available" label="可用" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.available === row.desired ? 'success' : 'warning'" size="small">
              {{ row.available }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="image" label="镜像" min-width="200" show-overflow-tooltip />
        <el-table-column prop="age" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button circle :icon="View" size="small" @click="handleView(row)" />
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button circle :icon="EditPen" size="small" @click="handleEdit(row)" />
            </el-tooltip>
            <el-tooltip content="重启" placement="top">
              <el-button circle :icon="Refresh" size="small" type="warning" @click="handleRestart(row)" />
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
    <BeeDialog v-model="detailDialogVisible" title="守护进程详情" width="800px">
      <el-descriptions :column="2" border v-if="currentDaemonset">
        <el-descriptions-item label="名称">{{ currentDaemonset.name }}</el-descriptions-item>
        <el-descriptions-item label="命名空间">{{ currentDaemonset.namespace }}</el-descriptions-item>
        <el-descriptions-item label="期望节点">{{ currentDaemonset.desired }}</el-descriptions-item>
        <el-descriptions-item label="就绪节点">{{ currentDaemonset.ready }}</el-descriptions-item>
        <el-descriptions-item label="当前运行">{{ currentDaemonset.current }}</el-descriptions-item>
        <el-descriptions-item label="标签">{{ formatLabels(currentDaemonset.labels) }}</el-descriptions-item>
        <el-descriptions-item label="镜像" :span="2">{{ currentDaemonset.image }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentDaemonset.age }}</el-descriptions-item>
      </el-descriptions>
    </BeeDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { EditPen, Plus, Refresh, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'

defineOptions({ name: 'ClusterDaemonset' })

interface DaemonsetInfo {
  id: string
  name: string
  namespace: string
  desired: number
  ready: number
  current: number
  upToDate: number
  available: number
  image: string
  labels: Record<string, string>
  age: string
}

const searchKey = ref('')
const namespaces = ['default', 'kube-system', 'dev', 'production']
const loading = ref(false)
const tableData = ref<DaemonsetInfo[]>([])
const detailDialogVisible = ref(false)
const currentDaemonset = ref<DaemonsetInfo | null>(null)

const queryForm = reactive({
  name: undefined as string | undefined,
  namespace: undefined
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
      name: 'kube-proxy',
      namespace: 'kube-system',
      desired: 5,
      ready: 5,
      current: 5,
      upToDate: 5,
      available: 5,
      image: 'k8s.gcr.io/kube-proxy:v1.28.0',
      labels: { 'k8s-app': 'kube-proxy', 'tier': 'node' },
      age: '2024-01-01 10:00:00'
    },
    {
      id: '2',
      name: 'flannel',
      namespace: 'kube-system',
      desired: 5,
      ready: 5,
      current: 5,
      upToDate: 5,
      available: 5,
      image: 'quay.io/coreos/flannel:v0.21.0',
      labels: { 'app': 'flannel', 'tier': 'network' },
      age: '2024-01-01 10:00:00'
    },
    {
      id: '3',
      name: 'coredns',
      namespace: 'kube-system',
      desired: 2,
      ready: 2,
      current: 2,
      upToDate: 2,
      available: 2,
      image: 'registry.k8s.io/coredns/coredns:v1.10.1',
      labels: { 'app': 'kubernetes', 'k8s-app': 'kube-dns' },
      age: '2024-01-01 10:00:00'
    },
    {
      id: '4',
      name: 'node-exporter',
      namespace: 'default',
      desired: 5,
      ready: 5,
      current: 5,
      upToDate: 1,
      available: 5,
      image: 'prom/node-exporter:v1.6.1',
      labels: { 'app': 'node-exporter', 'monitor': 'metrics' },
      age: '2024-01-10 14:00:00'
    },
    {
      id: '5',
      name: 'fluentd',
      namespace: 'default',
      desired: 5,
      ready: 4,
      current: 4,
      upToDate: 4,
      available: 4,
      image: 'fluent/fluentd:v1.16-1',
      labels: { 'app': 'fluentd', 'tier': 'logging' },
      age: '2024-01-12 09:00:00'
    },
    {
      id: '6',
      name: 'promtail',
      namespace: 'default',
      desired: 5,
      ready: 5,
      current: 5,
      upToDate: 5,
      available: 5,
      image: 'grafana/promtail:2.9.0',
      labels: { 'app': 'promtail', 'tier': 'logging' },
      age: '2024-01-12 09:30:00'
    },
    {
      id: '7',
      name: 'nvidia-device-plugin',
      namespace: 'default',
      desired: 2,
      ready: 2,
      current: 2,
      upToDate: 2,
      available: 2,
      image: 'nvcr.io/nvidia/k8s-device-plugin:v0.14.1',
      labels: { 'app': 'nvidia-device-plugin', 'tier': 'gpu' },
      age: '2024-01-14 11:00:00'
    },
    {
      id: '8',
      name: 'local-path-provisioner',
      namespace: 'local-path-storage',
      desired: 5,
      ready: 5,
      current: 5,
      upToDate: 5,
      available: 5,
      image: 'rancher/local-path-provisioner:v0.0.24',
      labels: { 'app': 'local-path-provisioner' },
      age: '2024-01-15 08:00:00'
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

function handleView(row: DaemonsetInfo) {
  currentDaemonset.value = row
  detailDialogVisible.value = true
}

function handleEdit(row: DaemonsetInfo) {
  console.log('Edit:', row)
}

function handleRestart(row: DaemonsetInfo) {
  ElMessage.info(`重启 ${row.name}`)
}

function handleCreate() {
  console.log('Create daemonset')
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.cluster-daemonset {
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
