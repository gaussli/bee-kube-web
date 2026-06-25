<template>
  <BeeCard class="bee-cluster-overview-resource">
    <div class="bee-cluster-overview-resource__header">
      <span>资源用量</span>
      <div class="bee-cluster-overview-resource__actions">
        <BeeButton size="small" @click="loadRadarData">
          <template #icon><Refresh /></template>
        </BeeButton>
      </div>
    </div>
    <div class="bee-cluster-overview-resource__body">
      <BeeRadarChart :data="radarData" :size="280" color="#da8030" />
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
import { ref, computed } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeRadarChart from '@/components/BeeRadarChart/index.vue'
import BeeRingChart from '@/components/BeeRingChart/index.vue'

defineOptions({ name: 'BeeClusterOverviewResource' })

/**
 * CPU 使用率
 */
const cpuUsed = ref(12)
const cpuTotal = ref(32)
const cpuUsage = computed(() => Math.round((cpuUsed.value / cpuTotal.value) * 100))

/**
 * 内存使用率
 */
const memoryUsed = ref('48 Gi')
const memoryTotal = ref('64 Gi')
const memoryUsage = ref(75)

/**
 * 磁盘使用率
 */
const diskUsed = ref('320 Gi')
const diskTotal = ref('500 Gi')
const diskUsage = ref(64)

/**
 * 容器数使用率
 */
const containerUsed = ref(42)
const containerTotal = ref(60)
const containerUsage = computed(() => Math.round((containerUsed.value / containerTotal.value) * 100))

/**
 * 雷达图数据
 */
const radarData = computed(() => [
  { label: 'CPU', value: cpuUsage.value, used: `${cpuUsed.value} 核`, total: `${cpuTotal.value} 核` },
  { label: '内存', value: memoryUsage.value, used: memoryUsed.value, total: memoryTotal.value },
  { label: '磁盘', value: diskUsage.value, used: diskUsed.value, total: diskTotal.value },
  { label: '容器数', value: containerUsage.value, used: `${containerUsed.value} 个`, total: `${containerTotal.value} 个` }
])

/**
 * 刷新资源用量数据
 */
function loadRadarData() {
  // TODO: 加载真实资源用量数据
  console.log('Loading radar data...')
}
</script>

<style lang="scss" scoped>
.bee-cluster-overview-resource {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    font-weight: 500;

    &-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }

  &__body {
    display: flex;
    gap: 16px;
    flex-direction: row;
    align-items: flex-start;
    padding: 0 16px 16px;
  }

  &__legend {
    display: flex;
    gap: 8px;
    flex-direction: column;
    flex: 1;
    min-width: 0;

    &-row {
      display: grid;
      gap: 12px;
      grid-template-columns: 48px 1fr 1fr 1fr;
      align-items: center;
      padding: 8px 16px;
      border-radius: 8px;
      background: $bg-selected;
    }

    &-ring {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
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
