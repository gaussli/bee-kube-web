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
        <BeeNodeInfoCell class="bee-cluster-overview-node__item-info" :name="node.name" :id="node.id" :ip="node.ip" :description="node.description" :icon-size="32" />
        <BeeResourceUsageCell :percentage="node.cpuUsagePercentage" field-name="CPU" />
        <BeeResourceUsageCell :percentage="node.memoryUsagePercentage" field-name="内存" />
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
import BeeResourceUsageCell from '@/components/BeeResourceUsageCell/index.vue'
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
    cpuUsagePercentage: calcPercentage(node.resource.usage.cpu, node.resource.allocation.cpu),
    memoryUsagePercentage: calcPercentage(node.resource.usage.memory, node.resource.allocation.memory)
  }))
})

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
