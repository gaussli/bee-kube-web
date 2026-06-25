<template>
  <BeeCard class="bee-cluster-overview-event">
    <div class="bee-cluster-overview-event__header">
      <span>最近事件</span>
      <BeeButton size="small" @click="loadEvents">
        <template #icon><Refresh /></template>
      </BeeButton>
    </div>
    <div class="bee-cluster-overview-event__body">
      <el-table :data="recentEvents">
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <BeeTag :type="row.type === 'Warning' ? 'warning' : 'default'">
              {{ row.type }}
            </BeeTag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" width="150" />
        <el-table-column prop="object" label="对象" min-width="200" />
        <el-table-column prop="message" label="消息" min-width="300" show-overflow-tooltip />
        <el-table-column prop="time" label="时间" width="180" />
      </el-table>
    </div>
  </BeeCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
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
    padding: 12px 20px;
    font-weight: 500;
  }

  &__body {
    padding: 0;
  }
}
</style>
