<template>
  <BeePage class="deployment-detail">
    <BeeBackHeader title="无状态应用详情" @back="handleBack" @action="handleAction" />
    <BeeResourceOverviewInfo :data="resourceData" />
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { DeploymentDetailVo } from '@/types/kubernetes/workload/deployment'
import { getDeploymentDetail } from '@/api/kubernetes/workload/deployment'
import BeeBackHeader from '@/components/BeeBackHeader/index.vue'
import BeePage from '@/components/BeePage/index.vue'
import { type ResourceOverviewInfoData } from '@/views/kubernetes/dashboard/components/BeeResourceOverviewInfo.vue'
import BeeResourceOverviewInfo from '@/views/kubernetes/dashboard/components/BeeResourceOverviewInfo.vue'

defineOptions({ name: 'DeploymentDetail' })

const route = useRoute()

const clusterId = ref(route.params.clusterId as string)
const namespace = ref(route.query.namespace as string)
const deploymentName = ref(route.query.name as string)
const loading = ref(false)

const detailData = ref<DeploymentDetailVo>()

/** 从详情数据映射为资源概览数据 */
const resourceData = computed<ResourceOverviewInfoData>(() => ({
  namespace: detailData.value?.basic.namespace || '',
  name: detailData.value?.basic.name || '',
  description: detailData.value?.basic.description,
  status: detailData.value?.basic.status || 'Unknown',
  createdAt: detailData.value?.basic.createAt || ''
}))

/** 加载 Deployment 详情 */
async function loadData() {
  if (!clusterId.value || !namespace.value || !deploymentName.value) return
  loading.value = true
  try {
    detailData.value = await getDeploymentDetail(clusterId.value, namespace.value, deploymentName.value)
  } finally {
    loading.value = false
  }
}

function handleBack() {
  window.history.back()
}

function handleAction(key: string) {
  // TODO: 处理操作按钮点击
  console.log('[Deployment Detail] action:', key)
}

onMounted(() => {
  loadData()
})
</script>
