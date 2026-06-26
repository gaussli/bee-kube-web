<template>
  <BeePage class="node-page">
    <!-- 页面标题 -->
    <BeeCard class="node-page__header">
      <BeePageTitle
        icon="kubernetes-node"
        title="节点管理"
        description="节点（Node）是 Kubernetes 集群中的工作机器，负责运行容器化应用（Pod）。通过节点管理可以查看集群中所有节点的运行状态、资源使用情况，并支持节点调度控制等运维操作。"
      />
    </BeeCard>

    <!-- 页面内容 -->
    <BeeCard class="node-page__body">
      <!-- 查询表单 -->
      <div class="table-toolbar">
        <BeeInputSearch v-model="searchKey" placeholder="按 ID、名称或 IP 搜索" class="table-toolbar__search" />
        <BeeSelect v-model="queryForm.status" :options="NODE_STATUS_OPTIONS" placeholder="状态筛选" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <BeeTable :data="tableData" :loading="loading" selectable @selection-change="handleSelectionChange">
          <BeeTableColumn :min-width="180">
            <template #default="{ row }">
              <BeeTableCommonCell :text="row.name" :subtext="row.internalIp" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="130">
            <template #default="{ row }">
              <div class="status-cell">
                <BeeStatusCell :status="row.status" :options="NODE_STATUS_OPTIONS" />
                <BeeTooltip v-if="row.schedulable === false" label="节点已被设置为不可调度，不会分配新的 Pod" placement="top">
                  <BeeIcon name="basic-warning-filled" :size="14" />
                </BeeTooltip>
              </div>
            </template>
          </BeeTableColumn>
          <BeeTableColumn :min-width="150">
            <template #default="{ row }">
              <div class="role-tags">
                <BeeTag v-for="role in row.roles" :key="role" size="small">{{ role }}</BeeTag>
              </div>
            </template>
          </BeeTableColumn>
          <BeeTableColumn :min-width="120">
            <template #default="{ row }">
              <span class="version-text">{{ row.version }}</span>
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="140">
            <template #default="{ row }">
              <div class="resource-cell">
                <span class="resource-text">{{ row.cpu }}</span>
                <div class="resource-bar" :style="{ background: getResourceBarBg(calcPercentage(row.cpu)), width: calcPercentage(row.cpu) + '%' }" />
              </div>
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="140">
            <template #default="{ row }">
              <div class="resource-cell">
                <span class="resource-text">{{ row.memory }}</span>
                <div class="resource-bar" :style="{ background: getResourceBarBg(calcPercentage(row.memory)), width: calcPercentage(row.memory) + '%' }" />
              </div>
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="140">
            <template #default="{ row }">
              <div class="resource-cell">
                <span class="resource-text">{{ row.pods }}</span>
                <div class="resource-bar" :style="{ background: getResourceBarBg(calcPercentage(row.pods)), width: calcPercentage(row.pods) + '%' }" />
              </div>
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="180">
            <template #default="{ row }">
              <BeeAuditCell :username="row.createBy" :datetime="row.createAt" field-name="创建人 / 时间" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="150" fixed="right">
            <template #default="{ row }">
              <div class="table-action">
                <BeeCircleButton v-if="hasPermission('kubernetes:node:edit')" icon="basic-edit" tooltip="编辑" @click="handleEdit(row)" />
                <BeeCircleButton icon="basic-view" tooltip="详情" @click="handleViewDetail(row)" />
                <BeeDropdown v-if="hasPermission('kubernetes:node:edit')" trigger="click">
                  <BeeCircleButton icon="basic-more" tooltip="更多" />
                  <template #dropdown>
                    <BeeDropdownItem v-if="row.schedulable !== false" value="stopScheduler" label="停止调度" icon="basic-stop" @click="handleCordon(row, true)" />
                    <BeeDropdownItem v-else value="enableScheduler" label="允许调度" icon="basic-right" @click="handleCordon(row, false)" />
                    <BeeDropdownItem value="drainPod" label="驱逐Pod" icon="kubernetes-drain" @click="handleDrain(row)" />
                  </template>
                </BeeDropdown>
              </div>
            </template>
          </BeeTableColumn>
        </BeeTable>
      </div>

      <!-- 表格底部 -->
      <div class="table-footer">
        <BeePagination v-model="pagination.page" v-model:pageSize="pagination.pageSize" :total="pagination.total" :page-sizes="[10, 20, 50]" @change="loadData" />
      </div>
    </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { NodeQueryReq, NodeListResp } from '@/types/kubernetes/node'
import { getNodePage, cordonNode, drainNode } from '@/api/kubernetes/node'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeCircleButton from '@/components/BeeCircleButton/index.vue'
import BeeDropdown from '@/components/BeeDropdown/index.vue'
import BeeDropdownItem from '@/components/BeeDropdownItem/index.vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeePage from '@/components/BeePage/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'
import BeeStatusCell from '@/components/BeeStatusCell/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import BeeTooltip from '@/components/BeeTooltip/index.vue'
import { usePermission } from '@/composables/usePermission'
import { NODE_STATUS_OPTIONS } from '@/config/kubernetes'
import { useKubernetesStore } from '@/stores'

defineOptions({ name: 'NodeManage' })

// 权限校验
const { hasPermission } = usePermission()

const router = useRouter()
const kubernetesStore = useKubernetesStore()
const searchKey = ref('')

const loading = ref(false)
const tableData = ref<NodeListResp[]>([])
const selectedRows = ref<NodeListResp[]>([])
const queryForm = reactive<Partial<NodeQueryReq>>({
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

function calcPercentage(value: string) {
  if (!value || typeof value !== 'string') return 0
  const parts = value.split('/')
  if (parts.length !== 2) return 0
  const used = parseFloat(parts[0])
  const total = parseFloat(parts[1])
  if (isNaN(used) || isNaN(total) || total === 0) return 0
  return Math.min(Math.round((used / total) * 100), 100)
}

/**
 * 根据使用百分比获取进度条颜色
 * @param percent - 使用百分比
 * @returns CSS 颜色值
 */
function getResourceBarBg(percent: number) {
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

/**
 * 搜索
 * @remarks 将 searchKey 同时映射到 name/ip 字段进行模糊匹配
 */
function handleSearch() {
  const key = searchKey.value
  queryForm.name = key
  queryForm.ip = key
  pagination.page = 1
  loadData()
}

/**
 * 重置搜索条件
 */
function handleReset() {
  queryForm.name = undefined
  queryForm.ip = undefined
  queryForm.status = undefined
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  loadData()
}

/**
 * 表格选中行变化
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as NodeListResp[]
}

function handleViewDetail(row: NodeListResp) {
  router.push({ name: 'kubernetes:node:detail', query: { clusterId: row.clusterId, name: row.name } })
}

function handleEdit(row: NodeListResp) {
  router.push({ name: 'kubernetes:node:edit', query: { clusterId: row.clusterId, name: row.name } })
}

async function handleCordon(row: NodeListResp, unschedulable: boolean) {
  try {
    await cordonNode(row.clusterId, row.name, unschedulable)
    ElMessage.success(unschedulable ? '已设置为不可调度' : '已设置为可调度')
    loadData()
  } catch {
    // 失败处理
  }
}

async function handleDrain(row: NodeListResp) {
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
  .node-page__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;

    .table-toolbar {
      display: flex;
      gap: $spacing-8;
      align-items: center;
      padding: $spacing-16 0;

      &__search {
        flex: 1;
        min-width: 0;
      }
    }

    .table-body {
      flex: 1;
      min-height: 0;

      .version-text,
      .resource-text {
        font-family: monospace;
        font-size: 12px;
        color: $color-text-secondary;
      }

      .status-cell {
        display: flex;
        gap: 4px;
        align-items: center;
      }

      .role-tags {
        display: flex;
        gap: $spacing-8;
        flex-flow: row wrap;
      }

      .resource-cell {
        display: flex;
        gap: 4px;
        flex-direction: column;

        .resource-bar {
          width: 100%;
          height: 4px;
          border-radius: 2px;
          transition: width 0.3s ease;
        }
      }
    }

    .table-action {
      display: flex;
      gap: $spacing-8;
      width: 100%;
      height: auto;
    }

    .table-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: $spacing-16 0;
    }
  }
}
</style>
