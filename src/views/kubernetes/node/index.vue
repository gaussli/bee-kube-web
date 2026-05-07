<template>
  <div class="node-table">
    <!-- 提示信息和页面标题 -->
    <div class="page-header">
      <BeeAlert type="info" label="节点是 Kubernetes 集群中的工作机器，可以是虚拟机或物理机。" />
      <BeePageTitle :icon="Box" title="节点管理" description="管理 Kubernetes 集群中的节点资源，查看节点状态、资源使用情况等。" />
    </div>

    <!-- 页面内容 -->
    <div class="page-body">
      <!-- 查询表单 -->
      <div class="table-query">
        <div class="table-query-left">
          <BeeInputSearch v-model="searchKey" placeholder="按名称搜索" @search="handleSearch" />
          <BeeRadioSearch v-model="queryForm.status" :options="statusOptions" @select="handleSelect" />
        </div>
        <div class="table-query-right">
          <BeeButton @click="handleReset">
            <template #icon><Refresh /></template>
            刷新
          </BeeButton>
        </div>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <el-table v-loading="loading" :data="tableData" height="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="60" align="center" />
          <el-table-column min-width="150">
            <template #header>
              <IconLabel :icon="Box" label="节点名称" />
            </template>
            <template #default="{ row }">
              <el-link type="primary" @click="handleViewDetail(row)">{{ row.name }}</el-link>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template #header>
              <IconLabel :icon="CircleCheck" label="状态" />
            </template>
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column min-width="150">
            <template #header>
              <IconLabel :icon="User" label="角色" />
            </template>
            <template #default="{ row }">
              <BeeTag v-for="role in row.roles" :key="role" size="small">{{ role }}</BeeTag>
            </template>
          </el-table-column>
          <el-table-column min-width="120">
            <template #header>
              <IconLabel :icon="Monitor" label="版本" />
            </template>
            <template #default="{ row }">
              <span class="version-text">{{ row.version }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="150">
            <template #header>
              <IconLabel :icon="Link" label="内部 IP" />
            </template>
            <template #default="{ row }">
              <TextCopyableCell :text="row.internalIp" />
            </template>
          </el-table-column>
          <el-table-column width="100">
            <template #header>
              <IconLabel :icon="Cpu" label="CPU" />
            </template>
            <template #default="{ row }">
              <span class="resource-text">{{ row.cpu }}</span>
            </template>
          </el-table-column>
          <el-table-column width="100">
            <template #header>
              <IconLabel :icon="Memo" label="内存" />
            </template>
            <template #default="{ row }">
              <span class="resource-text">{{ row.memory }}</span>
            </template>
          </el-table-column>
          <el-table-column width="100">
            <template #header>
              <IconLabel :icon="Grid" label="Pods" />
            </template>
            <template #default="{ row }">
              <span class="resource-text">{{ row.pods }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180">
            <template #header>
              <IconLabel :icon="Clock" label="创建时间" />
            </template>
            <template #default="{ row }">
              <TimeCell :time="row.createAt" />
            </template>
          </el-table-column>
          <el-table-column width="200" fixed="right">
            <template #header>
              <IconLabel :icon="EditPen" label="操作" />
            </template>
            <template #default="{ row }">
              <el-tooltip content="编辑" placement="top">
                <el-button v-if="hasPermission('kubernetes:node:edit')" circle :icon="EditPen" size="default" @click="handleEdit(row)" />
              </el-tooltip>
              <el-tooltip content="详情" placement="top">
                <el-button circle :icon="View" size="default" @click="handleViewDetail(row)" />
              </el-tooltip>
              <el-tooltip v-if="hasPermission('kubernetes:node:edit')" content="更多" placement="top">
                <el-dropdown trigger="click">
                  <template #default>
                    <el-button circle :icon="MoreFilled" size="default" />
                  </template>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleCordon(row, true)" v-if="row.status === 'Ready'">
                        <el-icon><Lock /></el-icon> 设置为不可调度
                      </el-dropdown-item>
                      <el-dropdown-item @click="handleCordon(row, false)" v-else>
                        <el-icon><Unlock /></el-icon> 设置为可调度
                      </el-dropdown-item>
                      <el-dropdown-item divided @click="handleDrain(row)">
                        <el-icon><Download /></el-icon> 驱逐 Pod
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Box, Refresh, CircleCheck, EditPen, MoreFilled, View, User, Monitor, Link, Cpu, Memo, Grid, Clock, Lock, Unlock, Download } from '@element-plus/icons-vue'
import { type NodeQueryReq, type NodeResp } from '@/types'
import { getNodePage, cordonNode, drainNode } from '@/api'
import { useKubernetesStore } from '@/stores'
import BeeAlert from '@/components/BeeAlert/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeeRadioSearch from '@/components/BeeRadioSearch/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import IconLabel from '@/components/IconLabel/index.vue'
import TextCopyableCell from '@/components/TextCopyableCell/index.vue'
import TimeCell from '@/components/TimeCell/index.vue'
import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'NodeManage' })

// 权限校验
const { hasPermission } = usePermission()

const router = useRouter()
const kubernetesStore = useKubernetesStore()
const searchKey = ref('')

const loading = ref(false)
const tableData = ref<NodeResp[]>([])
const selectedRows = ref<NodeResp[]>([])
const queryForm = reactive<NodeQueryReq>({
  name: undefined,
  clusterId: kubernetesStore.activeClusterId || undefined,
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
  { label: '未就绪', value: 'NotReady' }
]

function getStatusType(status: string) {
  switch (status) {
    case 'Ready':
      return 'success'
    case 'NotReady':
      return 'danger'
    default:
      return 'info'
  }
}

async function loadData() {
  if (!queryForm.clusterId) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getNodePage({ ...queryForm, page: pagination.page, pageSize: pagination.pageSize })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryForm.name = searchKey.value
  pagination.page = 1
  loadData()
}



function handleSelect(selectValue?: string | number) {
  queryForm.status = selectValue as string | undefined
  pagination.page = 1
  loadData()
}

function handleReset() {
  queryForm.name = undefined
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
.node-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  flex-shrink: 0;
  padding: 16px 20px 0 20px;
  margin-bottom: 16px;
  background-color: $bg-page;
}

.page-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background-color: $bg-page;
}

.table-query {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  gap: 12px;

  .table-query-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.table-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 20px;

  :deep(.el-table) {
    height: 100%;

    th.el-table__cell {
      padding: 12px 0;
    }

    .el-button + .el-button,
    .el-button + .el-dropdown {
      margin-left: 8px;
    }
  }

  .version-text,
  .resource-text {
    font-family: monospace;
    font-size: 12px;
    color: $text-secondary;
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
