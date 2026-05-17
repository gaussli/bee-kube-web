<template>
  <BeePage class="node-page">
    <!-- 页面标题 -->
    <BeeCard class="page-header">
      <BeePageTitle
        icon="kubernetes-node"
        title="节点管理"
        description="节点（Node）是 Kubernetes 集群中的工作机器，负责运行容器化应用（Pod）。通过节点管理可以查看集群中所有节点的运行状态、资源使用情况，并支持节点调度控制等运维操作。"
      />
    </BeeCard>

    <!-- 页面内容 -->
    <BeeCard class="page-body">
      <!-- 查询表单 -->
      <div class="table-query">
        <div class="table-query-left">
          <BeeInputSearch v-model="searchKey" placeholder="按 ID、名称或 IP 搜索" @search="handleSearch" />
          <BeeRadioSearch v-model="queryForm.status" :options="statusOptions" @select="handleSelect" />
        </div>
        <div class="table-query-right">
          <BeeButton type="info" icon="basic-refresh" @click="handleReset"> 刷新 </BeeButton>
        </div>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <el-table v-loading="loading" :data="tableData" height="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="60" align="center" />
          <el-table-column min-width="180">
            <template #header>
              <BeeIconLabel icon="kubernetes-node" label="名称" />
            </template>
            <template #default="{ row }">
              <BeeLabelGroup :main="row.name" :sub="row.internalIp" />
            </template>
          </el-table-column>
          <el-table-column width="130">
            <template #header>
              <BeeIconLabel icon="basic-status" label="状态" />
            </template>
            <template #default="{ row }">
              <div class="status-cell">
                <BeeStatus :status="row.status" :config="nodeStatusConfig" />
                <BeeTooltip v-if="row.schedulable === false" label="节点已被设置为不可调度，不会分配新的 Pod" placement="top">
                  <BeeIcon name="basic-warning-filled" :size="14" />
                </BeeTooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="150" class-name="bee-table-category">
            <template #header>
              <BeeIconLabel icon="basic-category" label="角色" />
            </template>
            <template #default="{ row }">
              <BeeTag v-for="role in row.roles" :key="role" size="small">{{ role }}</BeeTag>
            </template>
          </el-table-column>
          <el-table-column min-width="120">
            <template #header>
              <BeeIconLabel icon="kubernetes-version" label="版本" />
            </template>
            <template #default="{ row }">
              <span class="version-text">{{ row.version }}</span>
            </template>
          </el-table-column>
          <el-table-column width="140">
            <template #header>
              <BeeIconLabel icon="kubernetes-cpu" label="CPU" />
            </template>
            <template #default="{ row }">
              <div class="resource-cell">
                <span class="resource-text">{{ row.cpu }}</span>
                <el-progress :percentage="calcPercentage(row.cpu)" :stroke-width="4" :show-text="false" :color="getResourceColor(row.cpu)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column width="140">
            <template #header>
              <BeeIconLabel icon="kubernetes-memory" label="内存" />
            </template>
            <template #default="{ row }">
              <div class="resource-cell">
                <span class="resource-text">{{ row.memory }}</span>
                <el-progress :percentage="calcPercentage(row.memory)" :stroke-width="4" :show-text="false" :color="getResourceColor(row.memory)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column width="140">
            <template #header>
              <BeeIconLabel icon="kubernetes-pod" label="Pods" />
            </template>
            <template #default="{ row }">
              <div class="resource-cell">
                <span class="resource-text">{{ row.pods }}</span>
                <el-progress :percentage="calcPercentage(row.pods)" :stroke-width="4" :show-text="false" :color="getResourceColor(row.pods)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column width="180">
            <template #header>
              <BeeIconLabel icon="basic-audit" label="创建" />
            </template>
            <template #default="{ row }">
              <AuditCell :user="row.createBy" :time="row.createAt" />
            </template>
          </el-table-column>
          <el-table-column width="150" fixed="right" class-name="bee-table-operation">
            <template #header>
              <BeeIconLabel icon="basic-operation" label="操作" />
            </template>
            <template #default="{ row }">
              <BeeButton v-if="hasPermission('kubernetes:node:edit')" icon="basic-edit" type="info" tooltip="编辑" @click="handleEdit(row)" />
              <BeeButton icon="basic-view" type="info" tooltip="详情" @click="handleViewDetail(row)" />
              <BeeDropdown v-if="hasPermission('kubernetes:node:edit')" trigger="click">
                <BeeButton icon="basic-more" type="info" tooltip="更多" />
                <template #dropdown>
                  <BeeDropdownItem v-if="row.schedulable !== false" value="stopScheduler" label="停止调度" icon="basic-stop" @click="handleCordon(row, true)" />
                  <BeeDropdownItem v-else value="enableScheduler" label="允许调度" icon="basic-right" @click="handleCordon(row, false)" />
                  <BeeDropdownItem value="drainPod" label="驱逐Pod" icon="kubernetes-drain" @click="handleDrain(row)" />
                </template>
              </BeeDropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 表格底部 -->
      <div class="table-footer">
        <div></div>
        <BeePagination v-model="pagination.page" v-model:pageSize="pagination.pageSize" :total="pagination.total" :page-sizes="[10, 20, 50]" @change="loadData" />
      </div>
    </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { NodeQueryReq, NodeResp } from '@/types/kubernetes/node'
import { getNodePage, cordonNode, drainNode } from '@/api/kubernetes/node'
import AuditCell from '@/components/AuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeDropdown from '@/components/BeeDropdown/index.vue'
import BeeDropdownItem from '@/components/BeeDropdownItem/index.vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeIconLabel from '@/components/BeeIconLabel/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeeLabelGroup from '@/components/BeeLabelGroup/index.vue'
import BeePage from '@/components/BeePage/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeRadioSearch from '@/components/BeeRadioSearch/index.vue'
import BeeStatus from '@/components/BeeStatus/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import BeeTooltip from '@/components/BeeTooltip/index.vue'
import { usePermission } from '@/composables/usePermission'
import { useKubernetesStore } from '@/stores'

defineOptions({ name: 'NodeManage' })

// 权限校验
const { hasPermission } = usePermission()

const router = useRouter()
const kubernetesStore = useKubernetesStore()
const searchKey = ref('')

const loading = ref(false)
const tableData = ref<NodeResp[]>([])
const selectedRows = ref<NodeResp[]>([])
const queryForm = reactive<Partial<NodeQueryReq>>({
  id: undefined,
  name: undefined,
  ip: undefined,
  status: undefined,
  page: 1,
  pageSize: 10
})
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const statusOptions = [
  { label: '所有', value: undefined },
  { label: '就绪', value: 'Ready' },
  { label: '未就绪', value: 'NotReady' },
  { label: '未知', value: 'Unknown' }
]

const nodeStatusConfig = [
  { value: 'Ready', label: '就绪', color: 'rgb(103, 194, 58)' },
  { value: 'NotReady', label: '未就绪', color: 'rgb(245, 108, 108)' },
  { value: 'Unknown', label: '未知', color: 'rgb(144, 147, 153)' }
]

function calcPercentage(value: string) {
  if (!value || typeof value !== 'string') return 0
  const parts = value.split('/')
  if (parts.length !== 2) return 0
  const used = parseFloat(parts[0])
  const total = parseFloat(parts[1])
  if (isNaN(used) || isNaN(total) || total === 0) return 0
  return Math.min(Math.round((used / total) * 100), 100)
}

function getResourceColor(value: string) {
  const percent = calcPercentage(value)
  if (percent >= 90) return '#f56c6c'
  if (percent >= 70) return '#e6a23c'
  return '#67c23a'
}

async function loadData() {
  if (!kubernetesStore.activeClusterId) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getNodePage(kubernetesStore.activeClusterId, { ...queryForm, page: pagination.page, pageSize: pagination.pageSize })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  const key = searchKey.value.trim()
  queryForm.id = key
  queryForm.name = key
  queryForm.ip = key
  pagination.page = 1
  loadData()
}

function handleSelect(selectValue?: string | number) {
  queryForm.status = selectValue as string | undefined
  pagination.page = 1
  loadData()
}

function handleReset() {
  queryForm.id = undefined
  queryForm.name = undefined
  queryForm.ip = undefined
  queryForm.status = undefined
  queryForm.page = 1
  queryForm.pageSize = 10
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  loadData()
}

function handleSelectionChange(rows: NodeResp[]) {
  selectedRows.value = rows
}

function handleViewDetail(row: NodeResp) {
  router.push({ name: 'kubernetes:node:detail', query: { clusterId: row.clusterId, name: row.name } })
}

function handleEdit(row: NodeResp) {
  router.push({ name: 'kubernetes:node:edit', query: { clusterId: row.clusterId, name: row.name } })
}

async function handleCordon(row: NodeResp, unschedulable: boolean) {
  try {
    await cordonNode(row.clusterId, row.name, unschedulable)
    ElMessage.success(unschedulable ? '已设置为不可调度' : '已设置为可调度')
    loadData()
  } catch {
    // 失败处理
  }
}

async function handleDrain(row: NodeResp) {
  try {
    await drainNode(row.clusterId, row.name)
    ElMessage.success('已开始驱逐节点上的 Pod')
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
.node-page {
  .page-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;

    .table-query {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $spacing-md 0;

      .table-query-left {
        display: flex;
        gap: $spacing-sm;
        flex-direction: row;
        align-items: center;
      }

      .table-query-right {
        display: flex;
        gap: $spacing-sm;
        flex-direction: row;
        align-items: center;
      }
    }

    .table-body {
      flex: 1;
      min-height: 0;

      :deep(.el-table) {
        height: 100%;

        th.el-table__cell {
          padding: $spacing-md 0;
        }

        .bee-table-category {
          .cell {
            display: flex;
            gap: $spacing-sm;
            flex-flow: row wrap;
          }
        }

        .bee-table-operation {
          .cell {
            display: flex;
            gap: $spacing-sm;
            flex-direction: row;
          }
        }
      }

      .version-text,
      .resource-text {
        font-family: monospace;
        font-size: 12px;
        color: $text-secondary;
      }

      .status-cell {
        display: flex;
        gap: 4px;
        align-items: center;
      }

      .resource-cell {
        display: flex;
        gap: 4px;
        flex-direction: column;

        .el-progress {
          width: 100%;
        }
      }
    }

    .table-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $spacing-md 0;
    }
  }
}
</style>
