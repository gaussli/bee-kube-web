<template>
  <BeeCard class="bee-cluster-overview-resource">
    <div class="bee-cluster-overview-resource__header">
      <div class="bee-cluster-overview-resource__title">
        <BeeIcon name="basic-id" :size="14" />
        资源用量
      </div>
      <div class="bee-cluster-overview-resource__actions">
        <BeeCircleButton icon="basic-refresh" size="small" :border="false" tooltip="刷新" @click="loadData" />
      </div>
    </div>
    <div class="bee-cluster-overview-resource__body">
      <BeeRadarChart :data="radarData" :size="200" color="#da8030" />
      <div class="bee-cluster-overview-resource__legend">
        <div v-for="item in radarData" :key="item.label" class="bee-cluster-overview-resource__legend-row">
          <div class="bee-cluster-overview-resource__legend-ring">
            <BeeRingChart :percentage="item.value" :size="48" color="#da8030" />
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
import { onMounted, ref } from 'vue'
import { formatCpu, formatDisk, formatMemory } from '@/utils/kubernetes'
import { getClusterResource } from '@/api/kubernetes/cluster'
import { useKubernetesStore } from '@/stores/kubernetes'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeCircleButton from '@/components/BeeCircleButton/index.vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeRadarChart from '@/components/BeeRadarChart/index.vue'
import BeeRingChart from '@/components/BeeRingChart/index.vue'

defineOptions({ name: 'BeeClusterOverviewResource' })

const kubernetesStore = useKubernetesStore()

/** 雷达图数据 */
const radarData = ref([
  { label: 'CPU', value: 0, used: '0', total: '0' },
  { label: '内存', value: 0, used: '0', total: '0' },
  { label: '磁盘', value: 0, used: '0', total: '0' },
  { label: '容器数', value: 0, used: '0 个', total: '0 个' }
])

/**
 * 计算使用百分比
 * @param used - 已用量
 * @param total - 总量
 * @returns 百分比（0-100），总量为 0 时返回 0
 */
function calcPercentage(used: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((used / total) * 100)
}

/**
 * 加载资源用量数据并构建雷达图数据
 */
async function loadData() {
  if (!kubernetesStore.activeClusterId) return
  const res = await getClusterResource(kubernetesStore.activeClusterId)
  radarData.value = [
    {
      label: 'CPU',
      value: calcPercentage(res.usage.cpu, res.total.cpu),
      used: formatCpu(res.usage.cpu),
      total: formatCpu(res.total.cpu)
    },
    {
      label: '内存',
      value: calcPercentage(res.usage.memory, res.total.memory),
      used: formatMemory(res.usage.memory, 'B'),
      total: formatMemory(res.total.memory, 'B')
    },
    {
      label: '磁盘',
      value: calcPercentage(res.usage.storage, res.total.storage),
      used: formatDisk(res.usage.storage, 'B'),
      total: formatDisk(res.total.storage, 'B')
    },
    {
      label: '容器数',
      value: calcPercentage(res.usage.pod, res.total.pod),
      used: `${res.usage.pod} 个`,
      total: `${res.total.pod} 个`
    }
  ]
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.bee-cluster-overview-resource {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
      grid-template-columns: 48px 1fr 1fr 1fr;
      align-items: center;
      padding: 8px 16px;
      border-radius: 8px;
      background: $color-bg-elevated;
    }

    &-ring {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
    }

    &-col {
      display: flex;
      gap: 4px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 48px;
    }
  }

  &__col {
    &-value {
      font-size: 14px;
      font-weight: 600;
      line-height: 1;
      color: $color-text-primary;
    }

    &-label {
      font-size: 12px;
      line-height: 1;
      color: $color-text-secondary;
    }
  }
}
</style>
