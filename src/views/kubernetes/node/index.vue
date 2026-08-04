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
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <BeeNodeInfoCell
                :id="row.id"
                :name="row.name"
                :ip="row.ip"
                :description="row.description"
                :icon-size="32"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeStatusCell :status="row.status" :status-msg="row.statusMsg" :options="NODE_STATUS_OPTIONS" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="140">
            <template #default="{ row }">
              <BeeResourceUsageCell
                :percentage="calcPercentage(row.resource.usage.cpu, row.resource.allocation.cpu)"
                field-name="CPU"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="140">
            <template #default="{ row }">
              <BeeResourceUsageCell
                :percentage="calcPercentage(row.resource.usage.memory, row.resource.allocation.memory)"
                field-name="内存"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="140">
            <template #default="{ row }">
              <BeeResourceUsageCell
                :percentage="calcPercentage(row.resource.usage.storage, row.resource.allocation.storage)"
                field-name="磁盘"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="140">
            <template #default="{ row }">
              <BeeResourceUsageCell
                :percentage="calcPercentage(row.resource.usage.pod, row.resource.allocation.pod)"
                field-name="容器数"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAuditCell :username="row.createBy" :datetime="row.createAt" field-name="创建人 / 时间" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAuditCell :username="row.updateBy" :datetime="row.updateAt" field-name="更新人 / 时间" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="150" fixed="right">
            <template #default="{ row }">
              <div class="table-action">
                <BeeCircleButton
                  v-if="hasPermission('kubernetes:node:edit')"
                  icon="basic-edit"
                  tooltip="编辑"
                  @click="handleEdit(row)"
                />
                <BeeCircleButton icon="basic-view" tooltip="详情" @click="handleViewDetail(row)" />
                <BeeDropdown v-if="hasPermission('kubernetes:node:edit')" trigger="click">
                  <BeeCircleButton icon="basic-more" tooltip="更多" />
                  <template #dropdown>
                    <BeeDropdownItem
                      v-if="row.schedulable !== false"
                      value="stopScheduler"
                      label="停止调度"
                      icon="basic-stop"
                      @click="handleCordon(row, true)"
                    />
                    <BeeDropdownItem
                      v-else
                      value="enableScheduler"
                      label="允许调度"
                      icon="basic-right"
                      @click="handleCordon(row, false)"
                    />
                    <BeeDropdownItem
                      value="drainPod"
                      label="驱逐Pod"
                      icon="kubernetes-drain"
                      @click="handleDrain(row)"
                    />
                  </template>
                </BeeDropdown>
              </div>
            </template>
          </BeeTableColumn>
        </BeeTable>
      </div>

      <!-- 表格底部 -->
      <div class="table-footer">
        <BeePagination
          v-model="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          @change="loadData"
        />
      </div>
    </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { ElMessage } from 'element-plus'

import type { NodeQueryReq, NodeListResp } from '@/types/kubernetes/node'

import { calcPercentage } from '@/utils/kubernetes'

import { getNodePage, cordonNode, drainNode } from '@/api/kubernetes/node'

import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeCircleButton from '@/components/BeeCircleButton/index.vue'
import BeeDropdown from '@/components/BeeDropdown/index.vue'
import BeeDropdownItem from '@/components/BeeDropdownItem/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeeNodeInfoCell from '@/components/BeeNodeInfoCell/index.vue'
import BeePage from '@/components/BeePage/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeResourceUsageCell from '@/components/BeeResourceUsageCell/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'
import BeeStatusCell from '@/components/BeeStatusCell/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTable from '@/components/BeeTable/index.vue'

import { usePermission } from '@/composables/usePermission'
import { NODE_STATUS_OPTIONS } from '@/config/kubernetes'

defineOptions({ name: 'NodeManage' })

// 权限校验
const { hasPermission } = usePermission()

const route = useRoute()
const router = useRouter()
const clusterId = computed(() => route.params.clusterId as string)
const searchKey = ref('')

const loading = ref(false)
const tableData = ref<NodeListResp[]>([])
const selectedRows = ref<NodeListResp[]>([])
const queryForm = reactive<Partial<NodeQueryReq>>({
  id: undefined,
  name: undefined,
  ip: undefined,
  status: undefined,
})
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

/**
 * 加载节点列表数据
 * @remarks 根据当前查询条件与分页参数获取节点分页数据
 */
async function loadData() {
  if (!clusterId.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getNodePage(clusterId.value, {
      ...queryForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

/**
 * 搜索
 * @remarks 将 searchKey 同时映射到 id/name/ip 字段进行模糊匹配
 */
function handleSearch() {
  const key = searchKey.value
  queryForm.id = key
  queryForm.name = key
  queryForm.ip = key
  pagination.page = 1
  void loadData()
}

/**
 * 重置搜索条件
 */
function handleReset() {
  queryForm.id = undefined
  queryForm.name = undefined
  queryForm.ip = undefined
  queryForm.status = undefined
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  void loadData()
}

/**
 * 表格选中行变化
 * @param rows
 * @remarks BeeTable 的 selection-change 事件固定返回 Record<string, unknown>[]，需通过 unknown 桥接断言为目标类型
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as NodeListResp[]
}

/**
 * 查看节点详情
 * @param row - 当前行节点数据
 */
function handleViewDetail(row: NodeListResp) {
  router
    .push({ name: 'kubernetes:node:detail', params: { clusterId: clusterId.value }, query: { name: row.name } })
    .catch(() => {})
}

/**
 * 编辑节点
 * @param row - 当前行节点数据
 */
function handleEdit(row: NodeListResp) {
  router
    .push({ name: 'kubernetes:node:edit', params: { clusterId: clusterId.value }, query: { name: row.name } })
    .catch(() => {})
}

async function handleCordon(row: NodeListResp, unschedulable: boolean) {
  try {
    await cordonNode(row.clusterId, row.name, unschedulable)
    ElMessage.success(unschedulable ? '已设置为不可调度' : '已设置为可调度')
    await loadData()
  } catch (err) {
    console.error('[handleCordon]', err)
  }
}

async function handleDrain(row: NodeListResp) {
  try {
    await drainNode(row.clusterId, row.name)
    ElMessage.success('已开始驱逐节点上的 Pod')
    await loadData()
  } catch (err) {
    console.error('[handleDrain]', err)
  }
}

onMounted(() => {
  void loadData()
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
