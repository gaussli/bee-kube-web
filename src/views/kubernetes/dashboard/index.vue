<template>
  <BeePage class="cluster-overview">
    <!-- 集群信息 -->
    <BeeClusterOverviewInfo :data="clusterOverviewData" />

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
import BeePage from '@/components/BeePage/index.vue'
import BeeClusterOverviewEvent from './components/BeeClusterOverviewEvent.vue'
import BeeClusterOverviewInfo from './components/BeeClusterOverviewInfo.vue'
import BeeClusterOverviewNode from './components/BeeClusterOverviewNode.vue'
import BeeClusterOverviewResource from './components/BeeClusterOverviewResource.vue'

defineOptions({ name: 'ClusterOverview' })

/** 集群概览 mock 数据，后期替换为 API 接口数据 */
const clusterOverviewData = ref<ClusterOverviewInfoData>({
  name: 'prod-cluster',
  description:
    '生产环境集群生产环境集群生产环境集群生产环境集群生产环境集群生产环境集群生产环境集群生产环境集群生产环境集群生产环境集群生产环境集群生产环境集群生产环境集群生产环境集群生产环境集群生产环境集群生产环境集群',
  status: 1,
  createdAt: '2023-06-15 23:43:12',
  k8sVersion: 'v1.28.0',
  apiServer: 'https://api.production.local:6443',
  certExpireAt: '2026-07-20 23:45:23'
})

onMounted(() => {
  // TODO: 加载真实统计数据
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
