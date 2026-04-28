<template>
  <div class="cluster-overview">
    <!-- 资源雷达图 + 节点列表 -->
    <div class="top-row">
      <!-- 资源雷达图 -->
      <div class="card radar-card">
        <div class="card-header">
          <span>资源使用概览</span>
        </div>
        <div class="card-body">
          <BeeRadarChart :data="radarData" :size="280" color="#da8030" />
          <div class="radar-legend">
            <div v-for="item in radarData" :key="item.label" class="legend-row">
              <div class="legend-ring">
                <BeeRingChart :percentage="item.value" :size="48" color="#da8030" />
              </div>
              <div class="legend-col">
                <span class="col-value">{{ item.value }}%</span>
                <span class="col-label">{{ item.label }}</span>
              </div>
              <div class="legend-col">
                <span class="col-value">{{ item.used }}</span>
                <span class="col-label">已使用</span>
              </div>
              <div class="legend-col">
                <span class="col-value">{{ item.total }}</span>
                <span class="col-label">总计</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 节点列表 -->
      <div class="card node-card">
        <div class="card-header">
          <span>节点列表</span>
          <BeeButton size="small" @click="toggleSort">
            <template #icon><Refresh /></template>
            {{ sortKey === 'cpu' ? 'CPU排序' : '内存排序' }}
          </BeeButton>
        </div>
        <div class="card-body">
          <div class="node-items">
            <div v-for="node in sortedNodeList" :key="node.name" class="node-item">
              <div class="node-icon">
                <el-icon :size="24"><Monitor /></el-icon>
              </div>
              <div class="node-info">
                <span class="node-name">{{ node.name }}</span>
                <span class="node-desc">{{ node.description }}</span>
              </div>
              <div class="node-usage">
                <div class="usage-bar">
                  <span class="usage-label">CPU</span>
                  <div class="usage-track">
                    <div class="usage-fill" :style="{ width: node.cpuUsage + '%', background: getUsageColor(node.cpuUsage) }"></div>
                  </div>
                  <span class="usage-value">{{ node.cpuUsage }}%</span>
                </div>
                <div class="usage-bar">
                  <span class="usage-label">内存</span>
                  <div class="usage-track">
                    <div class="usage-fill" :style="{ width: node.memoryUsage + '%', background: getUsageColor(node.memoryUsage) }"></div>
                  </div>
                  <span class="usage-value">{{ node.memoryUsage }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="node-footer">
            <BeeButton size="small" @click="handleViewMore">查看更多</BeeButton>
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
import { Refresh, Monitor } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeRadarChart from '@/components/BeeRadarChart/index.vue'
import BeeRingChart from '@/components/BeeRingChart/index.vue'

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

// 节点列表排序
type SortKey = 'cpu' | 'memory'
const sortKey = ref<SortKey>('cpu')

// 节点数据
const nodeList = ref([
  { name: 'node-1', description: 'Master节点', cpuUsage: 85, memoryUsage: 72 },
  { name: 'node-2', description: 'Worker节点', cpuUsage: 45, memoryUsage: 58 },
  { name: 'node-3', description: 'Worker节点', cpuUsage: 62, memoryUsage: 81 },
  { name: 'node-4', description: 'Worker节点', cpuUsage: 30, memoryUsage: 45 },
  { name: 'node-5', description: 'Worker节点', cpuUsage: 78, memoryUsage: 65 },
  { name: 'node-6', description: 'Worker节点', cpuUsage: 55, memoryUsage: 70 },
  { name: 'node-7', description: 'Worker节点', cpuUsage: 40, memoryUsage: 52 }
])

// 排序后的节点列表（Top 5）
const sortedNodeList = computed(() => {
  return [...nodeList.value]
    .sort((a, b) => b[sortKey.value + 'Usage'] - a[sortKey.value + 'Usage'])
    .slice(0, 5)
})

function toggleSort() {
  sortKey.value = sortKey.value === 'cpu' ? 'memory' : 'cpu'
}

function getUsageColor(usage: number) {
  if (usage < 60) return '#67c23a'
  if (usage < 80) return '#e6a23c'
  return '#f56c6c'
}

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

function handleViewMore() {
  // TODO: 跳转到节点列表页面
  console.log('View more nodes...')
}

onMounted(() => {
  // TODO: 加载真实统计数据
})
</script>

<style lang="scss" scoped>
.cluster-overview {
  .top-row {
    display: flex;
    gap: 16px;

    .card {
      background-color: $bg_page;
      flex: 1;

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
    }

    .radar-card {
      .card-body {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 24px;
        padding: 20px;
      }

      .radar-legend {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
        min-width: 0;

        .legend-row {
          display: grid;
          grid-template-columns: 48px 1fr 1fr 1fr;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: $bg-selected;
          border-radius: 8px;
        }

        .legend-ring {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
        }

        .legend-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 48px;
          gap: 4px;

          .col-value {
            font-size: 14px;
            font-weight: 600;
            color: $text-primary;
            line-height: 1;
          }

          .col-label {
            font-size: 12px;
            color: $text-secondary;
            line-height: 1;
          }
        }
      }
    }

    .node-card {
      .card-body {
        padding: 0;
      }

      .node-items {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 300px;
        overflow-y: auto;
      }

      .node-item {
        display: grid;
        grid-template-columns: 32px 1fr 140px;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        background: $bg-selected;
        border-radius: 6px;

        .node-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: $color-primary;
        }

        .node-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;

          .node-name {
            font-size: 14px;
            font-weight: 500;
            color: $text-primary;
          }

          .node-desc {
            font-size: 12px;
            color: $text-secondary;
          }
        }

        .node-usage {
          display: flex;
          flex-direction: column;
          gap: 6px;

          .usage-bar {
            display: grid;
            grid-template-columns: 32px 1fr 36px;
            align-items: center;
            gap: 8px;

            .usage-label {
              font-size: 11px;
              color: $text-secondary;
            }

            .usage-track {
              height: 6px;
              background: #e4e7ed;
              border-radius: 3px;
              overflow: hidden;

              .usage-fill {
                height: 100%;
                border-radius: 3px;
                transition: width 0.3s ease;
              }
            }

            .usage-value {
              font-size: 11px;
              font-weight: 500;
              color: $text-primary;
              text-align: right;
            }
          }
        }
      }

      .node-footer {
        display: flex;
        justify-content: center;
        margin-top: 12px;
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
    margin-top: 16px;

    .card-body {
      padding: 0;
    }
  }
}
</style>
