<template>
  <BeePage class="deployment-detail">
    <BeeBackHeader title="无状态应用详情" @back="handleBack" @action="handleAction" />
    <BeeResourceOverviewInfo :data="resourceData" />
    <BeeCard class="deployment-detail__tabs">
      <BeeSegmentedControl v-model="activeTab" :options="tabOptions" />
    </BeeCard>
    <BeeCard class="deployment-detail__content">
      <DeploymentOverview v-if="activeTab === 'overview' && detailData" :data="detailData" />
      <DeploymentPods v-else-if="activeTab === 'pods'" />
      <DeploymentScheduling v-else-if="activeTab === 'scheduling'" />
      <DeploymentHistory v-else-if="activeTab === 'history'" />
      <DeploymentNetwork v-else-if="activeTab === 'network'" />
      <DeploymentStorage v-else-if="activeTab === 'storage'" />
      <DeploymentMonitor v-else-if="activeTab === 'monitor'" />
      <DeploymentEvents v-else-if="activeTab === 'events'" />
      <DeploymentAdvanced v-else-if="activeTab === 'advanced'" />
      <DeploymentYaml v-else-if="activeTab === 'yaml'" />
    </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useRoute } from 'vue-router'

import type { DeploymentDetailVo } from '@/types/kubernetes/workload/deployment'

import { getDeploymentDetail } from '@/api/kubernetes/workload/deployment'

import BeeBackHeader from '@/components/BeeBackHeader/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeePage from '@/components/BeePage/index.vue'
import BeeSegmentedControl from '@/components/BeeSegmentedControl/index.vue'

import { type ResourceOverviewInfoData } from '@/views/kubernetes/dashboard/components/BeeResourceOverviewInfo.vue'
import BeeResourceOverviewInfo from '@/views/kubernetes/dashboard/components/BeeResourceOverviewInfo.vue'

import DeploymentAdvanced from './advanced.vue'
import DeploymentEvents from './events.vue'
import DeploymentHistory from './history.vue'
import DeploymentMonitor from './monitor.vue'
import DeploymentNetwork from './network.vue'
import DeploymentOverview from './overview.vue'
import DeploymentPods from './pods.vue'
import DeploymentScheduling from './scheduling.vue'
import DeploymentStorage from './storage.vue'
import DeploymentYaml from './yaml.vue'

defineOptions({ name: 'DeploymentDetail' })

const route = useRoute()

const clusterId = ref(route.params.clusterId as string)
const namespace = ref(route.params.namespace as string)
const deploymentName = ref(route.params.name as string)
const loading = ref(false)

const detailData = ref<DeploymentDetailVo>()

/** 当前激活的标签页 */
const activeTab = ref('overview')

/** 标签页选项 */
const tabOptions = [
  { label: '概览', value: 'overview', icon: 'basic-id' },
  { label: '容器组', value: 'pods', icon: 'basic-id' },
  { label: '调度策略', value: 'scheduling', icon: 'basic-id' },
  { label: '部署历史', value: 'history', icon: 'basic-id' },
  { label: '关联网络', value: 'network', icon: 'basic-id' },
  { label: '挂载存储', value: 'storage', icon: 'basic-id' },
  { label: '监控数据', value: 'monitor', icon: 'basic-id' },
  { label: '事件信息', value: 'events', icon: 'basic-id' },
  { label: '高级配置', value: 'advanced', icon: 'basic-id' },
  { label: 'YAML', value: 'yaml', icon: 'basic-id' },
]

/** 从详情数据映射为资源概览数据 */
const resourceData = computed<ResourceOverviewInfoData>(() => ({
  namespace: detailData.value?.basic.namespace || '',
  name: detailData.value?.basic.name || '',
  description: detailData.value?.basic.description,
  status: detailData.value?.basic.status || 'Unknown',
  createdAt: detailData.value?.basic.createAt || '',
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
  void loadData()
})
</script>

<style lang="scss" scoped>
.deployment-detail {
  &__tabs {
    padding: $spacing-16;
  }

  &__content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
}
</style>
