<template>
  <div class="cluster-overview">
    <!-- 资源雷达图 -->
    <div class="card radar-card">
      <div class="card-header">
        <span>资源使用概览</span>
      </div>
      <div class="card-body">
        <div class="radar-container">
          <BeeRadarChart :data="radarData" :size="280" color="#da8030" />
          <div class="radar-legend">
            <div class="legend-item">
              <span class="legend-label">磁盘已用</span>
              <span class="legend-value">{{ diskUsed }} / {{ diskTotal }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-label">容器数量</span>
              <span class="legend-value">{{ containerUsed }} / {{ containerTotal }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近事件 -->
    <div class="card events-card">
      <div class="card-header">
        <span>最近事件</span>
        <BeeButton size="small" @click="loadEvents">
          <template #icon><Refresh /></template>
          刷新
        </BeeButton>
      </div>
      <div class="card-body">
        <el-table :data="recentEvents" height="300">
          <el-table-column prop="type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="row.type === 'Warning' ? 'warning' : 'info'" size="small">
                {{ row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="原因" width="150" />
          <el-table-column prop="object" label="对象" min-width="200" />
          <el-table-column prop="message" label="消息" min-width="300" show-overflow-tooltip />
          <el-table-column prop="time" label="时间" width="180" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeRadarChart from '@/components/BeeRadarChart/index.vue'

defineOptions({ name: 'ClusterOverview' })

// CPU 使用率
const cpuUsed = ref(12)
const cpuTotal = ref(32)
const cpuUsage = computed(() => Math.round((cpuUsed.value / cpuTotal.value) * 100))

const cpuColor = computed(() => {
  if (cpuUsage.value < 60) return '#67c23a'
  if (cpuUsage.value < 80) return '#e6a23c'
  return '#f56c6c'
})

// 内存使用率
const memoryUsed = ref('48 Gi')
const memoryTotal = ref('64 Gi')
const memoryUsage = ref(75)

const memoryColor = computed(() => {
  if (memoryUsage.value < 60) return '#67c23a'
  if (memoryUsage.value < 80) return '#e6a23c'
  return '#f56c6c'
})

// 雷达图数据
const radarData = computed(() => [
  { label: 'CPU', value: cpuUsage.value, used: `${cpuUsed.value} 核`, total: `${cpuTotal.value} 核` },
  { label: '内存', value: memoryUsage.value, used: memoryUsed.value, total: memoryTotal.value },
  { label: '磁盘', value: diskUsage.value, used: diskUsed.value, total: diskTotal.value },
  { label: '容器数', value: containerUsage.value, used: `${containerUsed.value} 个`, total: `${containerTotal.value} 个` }
])

// 磁盘使用率
const diskUsed = ref('320 Gi')
const diskTotal = ref('500 Gi')
const diskUsage = ref(64)

// 容器数使用率
const containerUsed = ref(42)
const containerTotal = ref(60)
const containerUsage = computed(() => Math.round((containerUsed.value / containerTotal.value) * 100))

// 最近事件
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

function loadEvents() {
  // TODO: 加载真实事件数据
  console.log('Loading events...')
}

onMounted(() => {
  // TODO: 加载真实统计数据
})
</script>

<style lang="scss" scoped>
.cluster-overview {
  .card {
    background-color: $bg_page;

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      font-weight: 500;
    }

    .card-body {
      padding: 20px;
    }

    & + .card {
      margin-top: 16px;
    }
  }

  .radar-card {
    .radar-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 60px;
      padding: 20px 0;

      .radar-legend {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .legend-item {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .legend-label {
            font-size: 12px;
            color: $text-secondary;
          }

          .legend-value {
            font-size: 16px;
            font-weight: 500;
            color: $text-primary;
          }
        }
      }
    }
  }

  .chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;

    .progress-value {
      font-size: 24px;
      font-weight: bold;
      color: $text-primary;
    }

    .chart-info {
      margin-top: 20px;
      text-align: center;

      .info-item {
        margin-top: 8px;

        .info-label {
          color: $text-secondary;
        }

        .info-value {
          color: $text-primary;
          font-weight: 500;
        }
      }
    }
  }

  .events-card {
    .card-body {
      padding: 0;
    }
  }
}
</style>
