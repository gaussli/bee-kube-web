<template>
  <BeeCard class="bee-cluster-overview-node">
    <div class="bee-cluster-overview-node__header">
      <div class="bee-cluster-overview-node__title">
        <BeeIcon name="basic-id" :size="14" />
        节点用量
      </div>
      <div class="bee-cluster-overview-node__actions">
        <BeeSegmentedControl v-model="sortKey" :options="sortOptions" @select="handleSortChange" />
        <el-divider direction="vertical" />
        <BeeButton size="small" @click="handleViewMore">查看更多</BeeButton>
      </div>
    </div>
    <div class="bee-cluster-overview-node__body">
      <div v-for="node in nodeListData" :key="node.name" class="bee-cluster-overview-node__item">
        <BeeNodeInfoCell class="bee-cluster-overview-node__item-info" :name="node.name" :id="node.id" :description="node.description" :icon-size="32" />
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
  </BeeCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { NodeListResp } from '@/types/kubernetes/node'
import { getNodeTopN } from '@/api/kubernetes/node'
import { useKubernetesStore } from '@/stores/kubernetes'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeNodeInfoCell from '@/components/BeeNodeInfoCell/index.vue'
import BeeSegmentedControl from '@/components/BeeSegmentedControl/index.vue'

defineOptions({ name: 'BeeClusterOverviewNode' })

const kubernetesStore = useKubernetesStore()

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
 * @param value - 排序指标
 */
function handleSortChange(value?: string | number) {
  sortKey.value = (value as SortKey) || 'cpu'
  loadData()
}

/** TopN 节点原始数据 */
const topNNodes = ref<NodeListResp[]>([])

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
 * 加载节点 TopN 数据
 */
async function loadData() {
  if (!kubernetesStore.activeClusterId) return
  topNNodes.value = await getNodeTopN(kubernetesStore.activeClusterId, {
    metric: sortKey.value,
    count: 5
  })
}

/**
 * 模板使用的节点列表数据（含百分比计算）
 */
const nodeListData = computed(() => {
  return topNNodes.value.map(node => ({
    id: node.id,
    name: node.name,
    description: node.description || '',
    cpuUsage: calcPercentage(node.resource.usage.cpu, node.resource.allocation.cpu),
    memoryUsage: calcPercentage(node.resource.usage.memory, node.resource.allocation.memory)
  }))
})

/**
 * 获取使用率颜色
 * @param usage - 使用率百分比
 * @returns 颜色值
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

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.bee-cluster-overview-node {
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;

  &__header {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    font-weight: 500;
  }

  &__title {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  &__actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__body {
    display: flex;
    gap: 8px;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  &__item {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 140px;
    align-items: center;
    padding: 8px 16px;
    border-radius: 8px;
    background: $color-bg-elevated;

    &-info {
      display: flex;
      min-width: 0;
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
