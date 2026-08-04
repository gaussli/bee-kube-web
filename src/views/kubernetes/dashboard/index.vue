<template>
  <BeePage class="cluster-overview">
    <!-- 集群信息 -->
    <BeeClusterOverviewInfo :data="clusterOverviewInfoData" />

    <!-- 资源雷达图 + 节点列表 -->
    <div class="cluster-overview__metrics-row">
      <!-- 资源用量 -->
      <BeeClusterOverviewResource />
      <!-- 节点列表 -->
      <BeeClusterOverviewNode />
    </div>

    <!-- 最近事件 -->
    <BeeClusterOverviewEvent />
  </BeePage>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import type { ClusterOverviewInfoData } from './components/BeeClusterOverviewInfo.vue'

import { getClusterDetail } from '@/api/kubernetes/cluster'

import { useKubernetesStore } from '@/stores/kubernetes'

import BeePage from '@/components/BeePage/index.vue'

import BeeClusterOverviewEvent from './components/BeeClusterOverviewEvent.vue'
import BeeClusterOverviewInfo from './components/BeeClusterOverviewInfo.vue'
import BeeClusterOverviewNode from './components/BeeClusterOverviewNode.vue'
import BeeClusterOverviewResource from './components/BeeClusterOverviewResource.vue'

defineOptions({ name: 'ClusterOverview' })

const kubernetesStore = useKubernetesStore()

/** 集群概览数据 */
const clusterOverviewInfoData = ref<ClusterOverviewInfoData>({
  name: '',
  description: '',
  status: 0,
  createdAt: '',
  k8sVersion: '',
  apiServer: '',
  certExpireAt: '',
})

/**
 * 加载集群概览数据
 * @remarks 从 API 获取集群详情，转换为 ClusterOverviewInfoData 格式
 */
async function loadClusterOverview() {
  if (!kubernetesStore.activeClusterId) return
  const detail = await getClusterDetail(kubernetesStore.activeClusterId)
  clusterOverviewInfoData.value = {
    name: detail.name,
    description: detail.description,
    status: detail.status,
    createdAt: detail.createAt || '',
    k8sVersion: detail.k8sVersion,
    apiServer: detail.apiServer,
    certExpireAt: detail.certExpireAt,
  }
}

onMounted(() => {
  void loadClusterOverview()
})
</script>

<style lang="scss" scoped>
.cluster-overview {
  overflow-y: auto;

  &__metrics-row {
    display: flex;
    gap: 16px;

    .bee-card {
      flex: 1;
    }
  }
}
</style>
