<template>
  <BeeCard class="bee-cluster-overview-event">
    <div class="bee-cluster-overview-event__header">
      <div class="bee-cluster-overview-event__title">
        <BeeIcon name="basic-id" :size="14" />
        最近事件
      </div>
      <div class="bee-cluster-overview-event__actions">
        <BeeCircleButton icon="basic-refresh" size="small" :border="false" tooltip="刷新" @click="loadEvents" />
      </div>
    </div>
    <div class="bee-cluster-overview-event__body">
      <BeeTable :data="recentEvents">
        <BeeTableColumn :width="100">
          <template #default="{ row }">
            <BeeTag :type="row.type === 'Warning' ? 'warning' : 'default'" size="small">
              {{ row.type }}
            </BeeTag>
          </template>
        </BeeTableColumn>
        <BeeTableColumn :width="180">
          <template #default="{ row }">
            <BeeTableCommonCell :text="row.reason" subtext="原因" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn :min-width="200">
          <template #default="{ row }">
            <BeeTableCommonCell :text="row.object" subtext="关联资源" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn :min-width="300">
          <template #default="{ row }">
            <BeeTableCommonCell :text="row.message" subtext="事件信息" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn :width="180">
          <template #default="{ row }">
            <BeeTableCommonCell :text="row.time" subtext="最后触发时间" />
          </template>
        </BeeTableColumn>
      </BeeTable>
    </div>
  </BeeCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeCircleButton from '@/components/BeeCircleButton/index.vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'

defineOptions({ name: 'BeeClusterOverviewEvent' })

/**
 * 最近事件数据
 */
const recentEvents = ref([
  { type: 'Normal', reason: 'Scheduled', object: 'pod/nginx-deployment-7fb96c846b-xk2p9', message: 'Successfully assigned pod to node-1', time: '2024-01-15 10:30:25' },
  {
    type: 'Warning',
    reason: 'FailedScheduling',
    object: 'pod/app-pod-5d8f9c7b4-m8n2p',
    message: '0/5 nodes are available: 2 Insufficient memory, 3 node(s) were rescheduled.',
    time: '2024-01-15 10:28:14'
  },
  { type: 'Normal', reason: 'Pulled', object: 'pod/redis-master-0', message: 'Container image "redis:7" already present on machine', time: '2024-01-15 10:25:33' },
  { type: 'Normal', reason: 'Created', object: 'pod/redis-master-0', message: 'Created container redis', time: '2024-01-15 10:25:34' },
  { type: 'Normal', reason: 'Started', object: 'pod/redis-master-0', message: 'Started container redis', time: '2024-01-15 10:25:35' },
  { type: 'Warning', reason: 'BackOff', object: 'pod/failing-app-6d9f8c5b4-l3k7j', message: 'Back-off restarting failed container', time: '2024-01-15 10:22:18' },
  { type: 'Normal', reason: 'ScalingReplicaSet', object: 'deployment/nginx-deployment', message: 'Scaled up replica set nginx-deployment-7fb96c846b to 3', time: '2024-01-15 09:15:00' },
  { type: 'Warning', reason: 'NodeMemoryPressure', object: 'node/node-3', message: 'Node is under memory pressure', time: '2024-01-15 08:45:22' }
])

/**
 * 刷新事件数据
 */
function loadEvents() {
  // TODO: 加载真实事件数据
  console.log('Loading events...')
}
</script>

<style lang="scss" scoped>
.bee-cluster-overview-event {
  &__header {
    display: flex;
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
    padding-bottom: 16px;
  }
}
</style>
