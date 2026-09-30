<template>
  <div class="deployment-pods">
    <!-- 工具栏 -->
    <div class="deployment-pods__toolbar">
      <BeeSearchInput
        v-model="searchKey"
        class="deployment-pods__toolbar-search"
        placeholder="按 UID / 名称 / IP 搜索"
      />
      <BeeSelect v-model="queryForm.status" :options="POD_STATUS_OPTIONS" placeholder="状态筛选" />
      <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
      <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
    </div>

    <!-- 表格 -->
    <div class="deployment-pods__table">
      <BeeTable :data="pods" :loading="loading" row-key="uid">
        <!-- 容器组信息 -->
        <BeeTableColumn :width="500">
          <template #default="{ row }">
            <BeePodInfoCell :icon-size="32" :ip="row.ip" :name="row.name" :uid="row.uid" />
          </template>
        </BeeTableColumn>
        <!-- 状态 -->
        <BeeTableColumn :width="160">
          <template #default="{ row }">
            <BeeStatusCell :options="POD_STATUS_OPTIONS" :status="row.status" :status-msg="row.statusMsg" />
          </template>
        </BeeTableColumn>
        <!-- 重启次数 -->
        <BeeTableColumn :width="120">
          <template #default="{ row }">
            <BeeTableCommonCell :label="String(row.restarts)" sublabel="重启次数" />
          </template>
        </BeeTableColumn>
        <!-- 所属节点 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeTableCommonCell :label="row.nodeName" :sublabel="row.nodeIp" />
          </template>
        </BeeTableColumn>
        <!-- 就绪容器 -->
        <BeeTableColumn :width="140">
          <template #default="{ row }">
            <BeeTableCommonCell :label="`${row.readyContainerCount} / ${row.containerCount}`" sublabel="就绪容器" />
          </template>
        </BeeTableColumn>
        <!-- CPU 使用量 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeTableCommonCell
              :label="formatCpu(row.resource.usage.cpu)"
              :sublabel="`CPU 使用率 ${cpuUsagePercent(row)}%`"
            />
          </template>
        </BeeTableColumn>
        <!-- 内存使用量 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeTableCommonCell
              :label="formatMemory(row.resource.usage.memory)"
              :sublabel="`内存使用率 ${memoryUsagePercent(row)}%`"
            />
          </template>
        </BeeTableColumn>
        <!-- 创建信息 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeAuditCell :datetime="row.createAt" field-name="创建人 / 时间" :username="row.createBy" />
          </template>
        </BeeTableColumn>
        <!-- 更新信息 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeAuditCell :datetime="row.updateAt" field-name="更新人 / 时间" :username="row.updateBy" />
          </template>
        </BeeTableColumn>
      </BeeTable>
    </div>

    <!-- 底栏 -->
    <div class="deployment-pods__footer">
      <BeePagination
        v-model:page="pageData.page"
        v-model:page-size="pageData.pageSize"
        :total="pageData.total"
        @change="fetchPods"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Deployment 详情 - 容器组列表
 * @module views/kubernetes/workload/deployment/detail/pods
 */
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute } from 'vue-router'

import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'

import { calcPercentage, formatCpu, formatMemory, toBytesOfQuantity, toMillicoresOfQuantity } from '@/utils/kubernetes'

import { getDeploymentPodList } from '@/api/kubernetes/workload/deployment'

import BeeButton from '@/components/base/BeeButton/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeePagination from '@/components/base/BeePagination/index.vue'
import BeeSearchInput from '@/components/base/BeeSearchInput/index.vue'
import BeeSelect from '@/components/base/BeeSelect/index.vue'
import BeePodInfoCell from '@/components/BeePodInfoCell/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeAuditCell from '@/components/business/BeeAuditCell/index.vue'
import BeeStatusCell from '@/components/business/BeeStatusCell/index.vue'

import { POD_STATUS_OPTIONS } from '@/config/kubernetes/pod'

defineOptions({ name: 'DeploymentPods' })

const route = useRoute()

// ==================== Computed ====================
/** 所属集群 UID（路由参数） */
const clusterUid = computed(() => route.params.clusterUid as string)
/** 所属命名空间名称（路由参数） */
const namespace = computed(() => route.params.namespace as string)
/** 被查看无状态应用名称（路由参数） */
const deploymentName = computed(() => route.params.name as string)

// ==================== Reactive State ====================
/** 列表加载态 */
const loading = ref(false)
/** 容器组列表 */
const pods = ref<PodListVo[]>([])
/** 搜索关键词，同时匹配 UID / 名称 / IP */
const searchKey = ref('')
/** 查询条件 */
const queryForm = reactive<Partial<PodQueryForm>>({ status: undefined })
/** 分页数据 */
const pageData = reactive({ page: 1, pageSize: 10, total: 0 })

// ==================== Method ====================
/**
 * 计算 CPU 使用率（使用量 / 请求量）
 * @param row - 容器组行数据
 * @returns 使用率百分比
 */
function cpuUsagePercent(row: PodListVo): number {
  return calcPercentage(
    toMillicoresOfQuantity(row.resource.usage.cpu),
    toMillicoresOfQuantity(row.resource.request.cpu),
  )
}

/**
 * 计算内存使用率（使用量 / 请求量）
 * @param row - 容器组行数据
 * @returns 使用率百分比
 */
function memoryUsagePercent(row: PodListVo): number {
  return calcPercentage(toBytesOfQuantity(row.resource.usage.memory), toBytesOfQuantity(row.resource.request.memory))
}

/**
 * 加载关联容器组列表
 */
async function fetchPods() {
  if (!clusterUid.value || !namespace.value || !deploymentName.value) {
    pods.value = []
    pageData.total = 0
    return
  }
  loading.value = true
  try {
    const { list, total, page, pageSize } = await getDeploymentPodList(
      clusterUid.value,
      namespace.value,
      deploymentName.value,
      {
        ...queryForm,
        namespace: namespace.value,
        uid: searchKey.value || undefined,
        name: searchKey.value || undefined,
        ip: searchKey.value || undefined,
        page: pageData.page,
        pageSize: pageData.pageSize,
      },
    )
    pods.value = list
    pageData.total = total
    pageData.page = page
    pageData.pageSize = pageSize
  } catch {
    BeeMessage.error('加载容器组列表失败')
  } finally {
    loading.value = false
  }
}

// ==================== Handler ====================
/**
 * 搜索
 */
function handleSearch() {
  pageData.page = 1
  void fetchPods()
}

/**
 * 重置搜索条件
 */
function handleReset() {
  searchKey.value = ''
  queryForm.status = undefined
  pageData.page = 1
  pageData.pageSize = 10
  void fetchPods()
}

// ==================== Lifecycle ====================
onMounted(() => {
  void fetchPods()
})
</script>

<style lang="scss" scoped>
.deployment-pods {
  display: flex;
  gap: 16px;
  flex-flow: column;
  justify-content: flex-start;
  align-items: stretch;
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: hidden;

  &__toolbar {
    display: flex;
    gap: 8px;
    flex-flow: row wrap;
    align-items: center;

    &-search {
      flex: 1;
      min-width: 100px;
    }
  }

  &__table {
    flex: 1;
    min-height: 0;
  }

  &__footer {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
