<template>
  <BeeCard class="bee-cluster-overview-node">
    <div class="bee-cluster-overview-node__header">
      <span>节点用量</span>
      <div class="bee-cluster-overview-node__actions">
        <BeeSegmentedControl v-model="sortKey" :options="sortOptions" @select="handleSortChange" />
        <el-divider direction="vertical" />
        <BeeButton size="small" @click="handleViewMore">查看更多</BeeButton>
      </div>
    </div>
    <div class="bee-cluster-overview-node__body">
      <div class="bee-cluster-overview-node__items">
        <div v-for="node in sortedNodeList" :key="node.name" class="bee-cluster-overview-node__item">
          <div class="bee-cluster-overview-node__item-icon">
            <el-icon :size="24"><Monitor /></el-icon>
          </div>
          <div class="bee-cluster-overview-node__item-info">
            <span class="bee-cluster-overview-node__item-name">{{ node.name }}</span>
            <span class="bee-cluster-overview-node__item-desc">{{ node.description }}</span>
          </div>
          <div class="bee-cluster-overview-node__item-usage">
            <div class="bee-cluster-overview-node__usage-bar">
              <span class="bee-cluster-overview-node__usage-label">CPU</span>
              <div class="bee-cluster-overview-node__usage-track">
                <div class="bee-cluster-overview-node__usage-fill" :style="{ width: node.cpuUsage + '%', background: getUsageColor(node.cpuUsage) }"></div>
              </div>
              <span class="bee-cluster-overview-node__usage-value">{{ node.cpuUsage }}%</span>
            </div>
            <div class="bee-cluster-overview-node__usage-bar">
              <span class="bee-cluster-overview-node__usage-label">内存</span>
              <div class="bee-cluster-overview-node__usage-track">
                <div class="bee-cluster-overview-node__usage-fill" :style="{ width: node.memoryUsage + '%', background: getUsageColor(node.memoryUsage) }"></div>
              </div>
              <span class="bee-cluster-overview-node__usage-value">{{ node.memoryUsage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BeeCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Monitor } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeSegmentedControl from '@/components/BeeSegmentedControl/index.vue'

defineOptions({ name: 'BeeClusterOverviewNode' })

/**
 * 节点排序
 */
type SortKey = 'cpu' | 'memory'
const sortKey = ref<SortKey>('cpu')
const sortOptions = [
  { label: 'CPU排名', value: 'cpu' },
  { label: '内存排名', value: 'memory' }
]

/**
 * 排序切换
 */
function handleSortChange(value?: string | number) {
  sortKey.value = (value as SortKey) || 'cpu'
}

/**
 * 节点数据
 */
const nodeList = ref([
  { name: 'node-1', description: 'Master节点', cpuUsage: 85, memoryUsage: 72 },
  { name: 'node-2', description: 'Worker节点', cpuUsage: 45, memoryUsage: 58 },
  { name: 'node-3', description: 'Worker节点', cpuUsage: 62, memoryUsage: 81 },
  { name: 'node-4', description: 'Worker节点', cpuUsage: 30, memoryUsage: 45 },
  { name: 'node-5', description: 'Worker节点', cpuUsage: 78, memoryUsage: 65 },
  { name: 'node-6', description: 'Worker节点', cpuUsage: 55, memoryUsage: 70 },
  { name: 'node-7', description: 'Worker节点', cpuUsage: 40, memoryUsage: 52 }
])

/**
 * 排序后的节点列表（Top 5）
 */
const sortedNodeList = computed(() => {
  const key = (sortKey.value + 'Usage') as 'cpuUsage' | 'memoryUsage'
  return [...nodeList.value].sort((a, b) => b[key] - a[key]).slice(0, 5)
})

/**
 * 获取使用率颜色
 */
function getUsageColor(usage: number) {
  if (usage < 60) return '#67c23a'
  if (usage < 80) return '#e6a23c'
  return '#f56c6c'
}

/**
 * 查看更多节点
 */
function handleViewMore() {
  // TODO: 跳转到节点列表页面
  console.log('View more nodes...')
}
</script>

<style lang="scss" scoped>
.bee-cluster-overview-node {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    font-weight: 500;
  }

  &__actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__body {
    padding: 0 16px 16px;
  }

  &__items {
    display: flex;
    gap: 8px;
    flex-direction: column;
    overflow-y: auto;
  }

  &__item {
    display: grid;
    gap: 16px;
    grid-template-columns: 32px 1fr 140px;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    background: $bg-selected;

    &-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: $color-primary;
    }

    &-info {
      display: flex;
      gap: 2px;
      flex-direction: column;
      min-width: 0;
    }

    &-name {
      font-size: 14px;
      font-weight: 500;
      color: $color-text-primary;
    }

    &-desc {
      font-size: 12px;
      color: $color-text-secondary;
    }

    &-usage {
      display: flex;
      gap: 6px;
      flex-direction: column;
    }
  }

  &__usage {
    &-bar {
      display: grid;
      gap: 8px;
      grid-template-columns: 32px 1fr 36px;
      align-items: center;
    }

    &-label {
      font-size: 11px;
      color: $color-text-secondary;
    }

    &-track {
      height: 6px;
      border-radius: 3px;
      overflow: hidden;
      background: #e4e7ed;
    }

    &-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    &-value {
      font-size: 11px;
      font-weight: 500;
      color: $color-text-primary;
      text-align: right;
    }
  }
}
</style>
