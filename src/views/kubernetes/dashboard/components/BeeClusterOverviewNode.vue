<template>
  <BeeCard class="bee-cluster-overview-node">
    <div class="bee-cluster-overview-node__header">
      <div class="bee-cluster-overview-node__title">
        <BeeIcon name="kubernetes-node" :size="16" />
        节点用量
      </div>
    </div>
    <div class="bee-cluster-overview-node__body">
      <div v-for="node in tableData" :key="node.name" class="bee-cluster-overview-node__item">
        <BeeNodeInfoCell
          class="bee-cluster-overview-node__item-info"
          :description="node.description"
          :ip="node.ip"
          :name="node.name"
          :uid="node.uid"
        />
        <BeeResourceUsageCell
          field-name="CPU"
          :percentage="
            calcPercentage(
              toMillicoresOfQuantity(node.resource.usage.cpu),
              toMillicoresOfQuantity(node.resource.allocation.cpu),
            )
          "
        />
        <BeeResourceUsageCell
          field-name="内存"
          :percentage="
            calcPercentage(
              toBytesOfQuantity(node.resource.usage.memory),
              toBytesOfQuantity(node.resource.allocation.memory),
            )
          "
        />
      </div>
    </div>
  </BeeCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import type { NodeListVo } from '@/types/kubernetes/node'

import { getNodeTopN } from '@/api/kubernetes/node'

import BeeCard from '@/components/BeeCard/index.vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeNodeInfoCell from '@/components/BeeNodeInfoCell/index.vue'
import BeeResourceUsageCell from '@/components/BeeResourceUsageCell/index.vue'

import { calcPercentage, toBytesOfQuantity, toMillicoresOfQuantity } from '@/utils'

defineOptions({ name: 'BeeClusterOverviewNode' })

const props = defineProps<{
  /** 集群 UID */
  clusterUid: string
}>()

/** TopN 节点原始数据 */
const tableData = ref<NodeListVo[]>([])

/**
 * 加载节点 TopN 数据
 */
async function loadData() {
  if (!props.clusterUid) return
  tableData.value = await getNodeTopN(props.clusterUid, {
    sorted: 'cpuUsage',
    n: 5,
  })
}

onMounted(() => {
  void loadData()
})
</script>

<style lang="scss" scoped>
.bee-cluster-overview-node {
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 0 0 auto;
    height: 48px;
    padding: 0 $spacing-16;
    font-weight: 500;
  }

  &__title {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  &__body {
    display: flex;
    gap: 8px;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 0 $spacing-16 $spacing-16;
  }

  &__item {
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 8px 16px;
    border-radius: 8px;
    background: $color-bg-elevated;

    &-info {
      flex: 1;
      min-width: 0;
    }
  }
}
</style>
