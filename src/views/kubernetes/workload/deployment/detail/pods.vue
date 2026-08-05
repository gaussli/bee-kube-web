<template>
  <div class="deployment-pods">
    <!-- 查询表单 -->
    <div class="table-toolbar">
      <BeeInputSearch v-model="searchKey" placeholder="按 UID / 名称 / IP 搜索" class="table-toolbar__search" />
      <BeeSelect v-model="queryForm.status" placeholder="状态筛选" :options="POD_STATUS_OPTIONS" />
      <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
      <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
    </div>

    <!-- 表格主体 -->
    <div class="table-body">
      <BeeTable :data="tableData" :loading="loading">
        <BeeTableColumn :width="500">
          <template #default="{ row }">
            <BeePodInfoCell :uid="row.uid" :name="row.name" :ip="row.ip" :icon-size="32" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn :width="120">
          <template #default="{ row }">
            <BeeStatusCell :status="row.status" :status-msg="row.statusMsg" :options="POD_STATUS_OPTIONS" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn :width="100">
          <template #default="{ row }">
            <BeeTableCommonCell :text="String(row.restarts)" subtext="重启次数" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeTableCommonCell :text="row.nodeName" :subtext="row.nodeIp" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn :width="140">
          <template #default="{ row }">
            <BeeTableCommonCell :text="`${row.readyContainerCount} / ${row.containerCount}`" subtext="就绪容器" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn :width="120">
          <template #default="{ row }">
            <BeeTableCommonCell :text="row.cpuUsage" subtext="CPU 使用率" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn :width="120">
          <template #default="{ row }">
            <BeeTableCommonCell :text="row.memoryUsage" subtext="内存使用率" />
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
  </div>
</template>

<script setup lang="ts">
/**
 * Deployment 容器组列表
 * @module views/kubernetes/workload/deployment/detail/pods
 */
import { onMounted, reactive, ref } from 'vue'

import { useRoute } from 'vue-router'

import type { DeploymentPodListVo, DeploymentPodQueryForm } from '@/types/kubernetes/workload/deployment'

import { getDeploymentPodList } from '@/api/kubernetes/workload/deployment'

import BeeButton from '@/components/BeeButton/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeePodInfoCell from '@/components/BeePodInfoCell/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'
import BeeStatusCell from '@/components/BeeStatusCell/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'

import { POD_STATUS_OPTIONS } from '@/config/kubernetes'

defineOptions({ name: 'DeploymentPods' })

// ==================== Constants ====================

const route = useRoute()

// ==================== Reactive State ====================

const clusterUid = ref(route.params.clusterUid as string)
const namespace = ref(route.params.namespace as string)
const deploymentName = ref(route.params.name as string)

const loading = ref(false)
const tableData = ref<DeploymentPodListVo[]>([])
const searchKey = ref('')

/** 查询条件 */
const queryForm = reactive<Partial<Omit<DeploymentPodQueryForm, 'name'>>>({
  status: '',
})

/** 分页 */
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

// ==================== Data Loading ====================

/**
 * 加载 Pod 分页列表
 * @remarks 调用 API 获取 Deployment 下的 Pod 分页数据
 */
async function loadData() {
  if (!clusterUid.value || !namespace.value || !deploymentName.value) {
    tableData.value = []
    pagination.total = 0
    return
  }
  loading.value = true
  try {
    const result = await getDeploymentPodList(clusterUid.value, namespace.value, deploymentName.value, {
      ...queryForm,
      name: searchKey.value,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = result.list
    pagination.total = result.total
  } finally {
    loading.value = false
  }
}

// ==================== Search & Reset ====================

/** 搜索 */
function handleSearch() {
  pagination.page = 1
  void loadData()
}

/** 重置搜索条件 */
function handleReset() {
  searchKey.value = ''
  queryForm.status = ''
  pagination.page = 1
  pagination.pageSize = 10
  void loadData()
}

// ==================== Lifecycle ====================

onMounted(() => {
  void loadData()
})
</script>

<style lang="scss" scoped>
.deployment-pods {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  .table-toolbar {
    display: flex;
    gap: $spacing-8;
    align-items: center;

    &__search {
      flex: 1;
      min-width: 0;
    }
  }

  .table-body {
    flex: 1;
    min-height: 0;
    margin-top: $spacing-16;
  }

  .table-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: $spacing-16;
  }
}
</style>
