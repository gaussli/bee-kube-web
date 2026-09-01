<template>
  <BeePage class="cluster-overview">
    <!-- 集群信息 -->
    <BeeClusterOverviewInfo :data="clusterOverviewInfoData" />

    <!-- 资源雷达图 + 节点列表 -->
    <div class="cluster-overview__metrics-row">
      <!-- 资源用量 -->
      <BeeClusterOverviewResource :resource="clusterResource" />
      <!-- 节点列表 -->
      <BeeClusterOverviewNode :cluster-uid="clusterUid" />
    </div>

    <!-- 最近事件 -->
    <BeeClusterOverviewEvent :cluster-uid="clusterUid" />
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useRoute } from 'vue-router'

import { getClusterDetail } from '@/api/kubernetes/cluster'
import type { ClusterResourceVo } from '@/types/kubernetes/cluster'

import BeePage from '@/components/BeePage/index.vue'

import BeeClusterOverviewEvent from './components/BeeClusterOverviewEvent.vue'
import BeeClusterOverviewInfo, { type ClusterOverviewInfoData } from './components/BeeClusterOverviewInfo.vue'
import BeeClusterOverviewNode from './components/BeeClusterOverviewNode.vue'
import BeeClusterOverviewResource from './components/BeeClusterOverviewResource.vue'

defineOptions({ name: 'ClusterOverview' })

const route = useRoute()

/** 当前集群 UID（响应式） */
const clusterUid = computed(() => route.params.clusterUid as string)

/** 集群概览数据 */
const clusterOverviewInfoData = ref<ClusterOverviewInfoData>({
  name: '',
  description: '',
  status: 'Unknown',
  createdAt: '',
  k8sVersion: '',
  apiServer: '',
  certExpireAt: '',
})

/** 集群资源（物理容量 / 可分配容量 / 已用量） */
const clusterResource = ref<ClusterResourceVo>({
  capacity: {},
  allocation: {},
  usage: {},
})

/**
 * 加载集群概览数据
 * @remarks 从 API 获取集群详情，转换为 ClusterOverviewInfoData 格式
 */
async function loadClusterOverview() {
  const clusterUid = route.params.clusterUid as string | undefined
  if (!clusterUid) return
  const detail = await getClusterDetail(clusterUid)
  clusterOverviewInfoData.value = {
    name: detail.name,
    description: detail.description,
    status: detail.status,
    createdAt: detail.createAt || '',
    k8sVersion: detail.k8sVersion,
    apiServer: detail.apiServer,
    certExpireAt: detail.certExpireAt,
  }
  clusterResource.value = detail.resource
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

    > * {
      flex: 1;
      min-width: 0;
    }
  }
}
</style>
