<template>
  <BeeCard class="bee-cluster-overview-resource">
    <div class="bee-cluster-overview-resource__header">
      <div class="bee-cluster-overview-resource__title">
        <BeeIcon name="basic-id" :size="14" />
        资源用量
      </div>
    </div>
    <div class="bee-cluster-overview-resource__body">
      <BeeRadarChart :data="radarData" :size="200" />
      <div class="bee-cluster-overview-resource__legend">
        <div v-for="item in radarData" :key="item.label" class="bee-cluster-overview-resource__legend-row">
          <div class="bee-cluster-overview-resource__legend-ring">
            <BeeRingChart :percentage="item.value" :size="40" />
          </div>
          <div class="bee-cluster-overview-resource__legend-col">
            <span class="bee-cluster-overview-resource__col-value">{{ item.value }}%</span>
            <span class="bee-cluster-overview-resource__col-label">{{ item.label }}</span>
          </div>
          <div class="bee-cluster-overview-resource__legend-col">
            <span class="bee-cluster-overview-resource__col-value">{{ item.used }}</span>
            <span class="bee-cluster-overview-resource__col-label">已使用</span>
          </div>
          <div class="bee-cluster-overview-resource__legend-col">
            <span class="bee-cluster-overview-resource__col-value">{{ item.total }}</span>
            <span class="bee-cluster-overview-resource__col-label">总计</span>
          </div>
        </div>
      </div>
    </div>
  </BeeCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ClusterResourceVo } from '@/types/kubernetes/cluster'

import {
  calcPercentage,
  formatCpu,
  formatStorage,
  formatMemory,
  toMillicoresOfQuantity,
  toBytesOfQuantity,
} from '@/utils/kubernetes'

import BeeCard from '@/components/BeeCard/index.vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeRadarChart from '@/components/BeeRadarChart/index.vue'
import BeeRingChart from '@/components/BeeRingChart/index.vue'

defineOptions({ name: 'BeeClusterOverviewResource' })

const props = defineProps<{
  /** 集群资源：物理容量、可分配容量、已用量 */
  resource: ClusterResourceVo
}>()

/** 雷达图数据（随 resource 变化响应式更新） */
const radarData = computed(() => {
  const { usage, allocation } = props.resource
  return [
    {
      label: 'CPU',
      value: calcPercentage(toMillicoresOfQuantity(usage.cpu), toMillicoresOfQuantity(allocation.cpu)),
      used: formatCpu(usage.cpu),
      total: formatCpu(allocation.cpu),
    },
    {
      label: '内存',
      value: calcPercentage(toBytesOfQuantity(usage.memory), toBytesOfQuantity(allocation.memory)),
      used: formatMemory(usage.memory),
      total: formatMemory(allocation.memory),
    },
    {
      label: '磁盘',
      value: calcPercentage(toBytesOfQuantity(usage.storage), toBytesOfQuantity(allocation.storage)),
      used: formatStorage(usage.storage),
      total: formatStorage(allocation.storage),
    },
    {
      label: '容器数',
      value: calcPercentage(usage.pods?.value ?? 0, allocation.pods?.value ?? 1),
      used: `${usage.pods?.value ?? 0} 个`,
      total: `${allocation.pods?.value ?? 0} 个`,
    },
  ]
})
</script>

<style lang="scss" scoped>
.bee-cluster-overview-resource {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 64px;
    font-weight: 600;

    &-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }

  &__title {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  &__body {
    display: flex;
    gap: 16px;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 0 0 16px 8px;
  }

  &__legend {
    display: flex;
    gap: 8px;
    flex-direction: column;
    flex: 1;
    min-width: 0;

    &-row {
      display: grid;
      gap: 4px;
      align-items: center;
      grid-template-columns: 48px 1fr 1fr 1fr;
      padding: 16px;
      border-radius: 8px;
      background: $color-bg-elevated;
    }

    &-ring {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-col {
      display: flex;
      gap: 8px;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      // height: 48px;
    }
  }

  &__col {
    &-value {
      font-size: 14px;
      font-weight: 600;
      color: $color-text-primary;
    }

    &-label {
      font-size: 12px;
      color: $color-text-tertiary;
    }
  }
}
</style>
