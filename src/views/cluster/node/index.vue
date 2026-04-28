<template>
  <div class="cluster-node">
    <!-- 表格头部 -->
    <div class="table-header">
      <div class="query-form">
        <div class="query-form-left">
          <BeeInputSearch v-model="searchKey" placeholder="按名称搜索" @search="handleSearch" />
          <BeeRadioSearch v-model="queryForm.status" :options="statusOptions" @select="handleSelect" />
        </div>
        <div class="query-form-right">
          <BeeButton @click="handleReset">
            <template #icon><Refresh /></template>
            刷新
          </BeeButton>
          <el-divider type="primary" direction="vertical" />
          <BeeButton type="primary" @click="handleCreate">
            <template #icon><Plus /></template>
            新增节点
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
            <el-tag :type="row.status === 'Ready' ? 'success' : 'danger'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag v-for="role in row.roles" :key="role" size="small" :type="role === 'master' ? 'warning' : 'info'">
              {{ role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cpu" label="CPU" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.cpuUsage" :color="getCpuColor(row.cpuUsage)" :stroke-width="10" />
            <span class="resource-text">{{ row.cpuUsed }}/{{ row.cpuTotal }} 核</span>
          </template>
        </el-table-column>
        <el-table-column prop="memory" label="内存" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.memoryUsage" :color="getMemoryColor(row.memoryUsage)" :stroke-width="10" />
            <span class="resource-text">{{ row.memoryUsed }}/{{ row.memoryTotal }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pods" label="Pod 数量" width="100" align="center" />
        <el-table-column prop="age" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button circle :icon="View" size="small" @click="handleView(row)" />
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button circle :icon="EditPen" size="small" @click="handleEdit(row)" />
            </el-tooltip>
            <el-tooltip content="驱逐" placement="top">
              <el-button circle :icon="Delete" size="small" type="danger" @click="handleCordon(row)" />
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

    <!-- 节点详情 Dialog -->
    <BeeDialog v-model="detailDialogVisible" title="节点详情" width="700px">
      <el-descriptions :column="2" border v-if="currentNode">
        <el-descriptions-item label="名称">{{ currentNode.name }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentNode.status === 'Ready' ? 'success' : 'danger'" size="small">
            {{ currentNode.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="角色">{{ currentNode.roles.join(', ') }}</el-descriptions-item>
        <el-descriptions-item label="架构">{{ currentNode.arch }}</el-descriptions-item>
        <el-descriptions-item label="操作系统">{{ currentNode.os }}</el-descriptions-item>
        <el-descriptions-item label="内核版本">{{ currentNode.kernelVersion }}</el-descriptions-item>
        <el-descriptions-item label="Kubelet 版本">{{ currentNode.kubeletVersion }}</el-descriptions-item>
        <el-descriptions-item label="容器运行时">{{ currentNode.containerRuntime }}</el-descriptions-item>
        <el-descriptions-item label="IP地址" :span="2">{{ currentNode.ip }}</el-descriptions-item>
        <el-descriptions-item label="Pod CIDR" :span="2">{{ currentNode.podCidr }}</el-descriptions-item>
      </el-descriptions>
    </BeeDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Delete, EditPen, Plus, Refresh, View } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeeRadioSearch from '@/components/BeeRadioSearch/index.vue'

defineOptions({ name: 'ClusterNode' })

interface NodeInfo {
  id: string
  name: string
  status: string
  roles: string[]
  cpuUsed: number
  cpuTotal: number
  cpuUsage: number
  memoryUsed: string
  memoryTotal: string
  memoryUsage: number
  pods: number
  age: string
  arch?: string
  os?: string
  kernelVersion?: string
  kubeletVersion?: string
  containerRuntime?: string
  ip?: string
  podCidr?: string
}

const router = useRouter()
const searchKey = ref('')

const statusOptions = [
  { label: '全部', value: undefined },
  { label: '就绪', value: 'Ready' },
  { label: '未就绪', value: 'NotReady' }
]

const loading = ref(false)
const tableData = ref<NodeInfo[]>([])
const detailDialogVisible = ref(false)
const currentNode = ref<NodeInfo | null>(null)
const queryForm = reactive({
  name: undefined,
  status: undefined,
  page: 1,
  pageSize: 10
})
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

function getCpuColor(percentage: number) {
  if (percentage < 60) return '#67c23a'
  if (percentage < 80) return '#e6a23c'
  return '#f56c6c'
}

function getMemoryColor(percentage: number) {
  if (percentage < 60) return '#67c23a'
  if (percentage < 80) return '#e6a23c'
  return '#f56c6c'
}

function loadData() {
  loading.value = true
  // 模拟数据
  tableData.value = [
    {
      id: '1',
      name: 'node-1',
      status: 'Ready',
      roles: ['master'],
      cpuUsed: 4,
      cpuTotal: 8,
      cpuUsage: 50,
      memoryUsed: '16 Gi',
      memoryTotal: '32 Gi',
      memoryUsage: 50,
      pods: 24,
      age: '2024-01-01 10:00:00',
      arch: 'amd64',
      os: 'Ubuntu 22.04',
      kernelVersion: '5.15.0-89-generic',
      kubeletVersion: 'v1.28.0',
      containerRuntime: 'docker://24.0.7',
      ip: '192.168.1.101',
      podCidr: '10.244.0.0/24'
    },
    {
      id: '2',
      name: 'node-2',
      status: 'Ready',
      roles: ['worker'],
      cpuUsed: 6,
      cpuTotal: 8,
      cpuUsage: 75,
      memoryUsed: '24 Gi',
      memoryTotal: '32 Gi',
      memoryUsage: 75,
      pods: 32,
      age: '2024-01-01 10:05:00',
      arch: 'amd64',
      os: 'Ubuntu 22.04',
      kernelVersion: '5.15.0-89-generic',
      kubeletVersion: 'v1.28.0',
      containerRuntime: 'docker://24.0.7',
      ip: '192.168.1.102',
      podCidr: '10.244.1.0/24'
    },
    {
      id: '3',
      name: 'node-3',
      status: 'Ready',
      roles: ['worker'],
      cpuUsed: 2,
      cpuTotal: 8,
      cpuUsage: 25,
      memoryUsed: '8 Gi',
      memoryTotal: '32 Gi',
      memoryUsage: 25,
      pods: 12,
      age: '2024-01-01 10:10:00',
      arch: 'amd64',
      os: 'Ubuntu 22.04',
      kernelVersion: '5.15.0-89-generic',
      kubeletVersion: 'v1.28.0',
      containerRuntime: 'docker://24.0.7',
      ip: '192.168.1.103',
      podCidr: '10.244.2.0/24'
    },
    {
      id: '4',
      name: 'node-4',
      status: 'NotReady',
      roles: ['worker'],
      cpuUsed: 7,
      cpuTotal: 8,
      cpuUsage: 87,
      memoryUsed: '28 Gi',
      memoryTotal: '32 Gi',
      memoryUsage: 87,
      pods: 45,
      age: '2024-01-01 10:15:00',
      arch: 'amd64',
      os: 'Ubuntu 22.04',
      kernelVersion: '5.15.0-89-generic',
      kubeletVersion: 'v1.28.0',
      containerRuntime: 'docker://24.0.7',
      ip: '192.168.1.104',
      podCidr: '10.244.3.0/24'
    },
    {
      id: '5',
      name: 'node-5',
      status: 'Ready',
      roles: ['worker'],
      cpuUsed: 5,
      cpuTotal: 16,
      cpuUsage: 31,
      memoryUsed: '20 Gi',
      memoryTotal: '64 Gi',
      memoryUsage: 31,
      pods: 18,
      age: '2024-01-01 10:20:00',
      arch: 'arm64',
      os: 'Ubuntu 22.04',
      kernelVersion: '5.15.0-89-generic',
      kubeletVersion: 'v1.28.0',
      containerRuntime: 'docker://24.0.7',
      ip: '192.168.1.105',
      podCidr: '10.244.4.0/24'
    }
  ]
  pagination.total = tableData.value.length
  loading.value = false
}

function handleSearch() {
  queryForm.name = searchKey.value || undefined
  pagination.page = 1
  loadData()
}

function handleSelect(selectValue?: string) {
  queryForm.status = selectValue
  pagination.page = 1
  loadData()
}

function handleReset() {
  searchKey.value = ''
  queryForm.name = undefined
  queryForm.status = undefined
  pagination.page = 1
  loadData()
}

function handleView(row: NodeInfo) {
  currentNode.value = row
  detailDialogVisible.value = true
}

function handleEdit(row: NodeInfo) {
  router.push({ path: '/cluster/node/edit', query: { name: row.name } })
}

function handleCordon(row: NodeInfo) {
  // TODO: 调用驱逐 API
  console.log('Cordon node:', row.name)
}

function handleCreate() {
  router.push('/cluster/node/create')
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.cluster-node {
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

    .el-progress {
      margin-bottom: 4px;
    }

    .resource-text {
      font-size: 12px;
      color: $text-secondary;
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
