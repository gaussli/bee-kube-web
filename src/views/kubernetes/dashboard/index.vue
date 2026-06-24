<template>
  <div class="cluster-overview">
    <!-- 集群信息 -->
    <BeeCard class="cluster-info-card">
      <div class="cluster-main">
        <div class="cluster-icon">
          <BeeIcon name="kubernetes-cluster" :size="48" />
        </div>
        <div class="cluster-basic">
          <div class="cluster-name">{{ clusterInfo.name }}</div>
          <div class="cluster-desc">{{ clusterInfo.description }}</div>
          <div class="cluster-meta">
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              创建于 {{ clusterInfo.createdAt }}
            </span>
          </div>
        </div>
      </div>
      <el-divider direction="vertical" class="vertical-divider" />
      <div class="cluster-details">
        <div class="detail-item">
          <span class="detail-label">Kubernetes 版本</span>
          <span class="detail-value">{{ clusterInfo.k8sVersion }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">API Server</span>
          <span class="detail-value api-url">{{ clusterInfo.apiServer }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">证书有效期</span>
          <span class="detail-value" :class="{ 'text-warning': clusterInfo.certExpireDays <= 30 }"> {{ clusterInfo.certExpireAt }} ({{ clusterInfo.certExpireDays }} 天) </span>
        </div>
      </div>
      <el-divider direction="vertical" class="vertical-divider" />
      <div class="cluster-status">
        <span class="status-label">集群状态</span>
        <el-tag :type="clusterInfo.status === 'Ready' ? 'success' : 'danger'" size="large" effect="dark">
          {{ clusterInfo.status }}
        </el-tag>
      </div>
    </BeeCard>

    <!-- 可滚动内容区域 -->
    <div class="scroll-content">
      <!-- 资源雷达图 + 节点列表 -->
      <div class="top-row">
        <!-- 资源雷达图 -->
        <BeeCard class="radar-card">
          <div class="card-header">
            <span>资源用量</span>
            <div class="header-actions">
              <BeeButton size="small" @click="loadRadarData">
                <template #icon><Refresh /></template>
              </BeeButton>
            </div>
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
        </BeeCard>

        <!-- 节点列表 -->
        <BeeCard class="node-card">
          <div class="card-header">
            <span>节点用量</span>
            <div class="header-actions">
              <BeeSegmentedControl v-model="sortKey" :options="sortOptions" @select="handleSortChange" />
              <el-divider direction="vertical" />
              <BeeButton size="small" @click="handleViewMore">查看更多</BeeButton>
            </div>
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
          </div>
        </BeeCard>
      </div>

      <!-- 最近事件 -->
      <BeeCard class="events-card">
        <div class="card-header">
          <span>最近事件</span>
          <BeeButton size="small" @click="loadEvents">
            <template #icon><Refresh /></template>
          </BeeButton>
        </div>
        <div class="card-body">
          <el-table :data="recentEvents">
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <BeeTag :type="row.type === 'Warning' ? 'warning' : 'info'">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Refresh, Monitor, Clock } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeRadarChart from '@/components/BeeRadarChart/index.vue'
import BeeRingChart from '@/components/BeeRingChart/index.vue'
import BeeSegmentedControl from '@/components/BeeSegmentedControl/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'

defineOptions({ name: 'ClusterOverview' })

// 集群信息
const clusterInfo = ref({
  name: 'prod-cluster',
  description: '生产环境集群',
  status: 'Ready',
  createdAt: '2023-06-15',
  k8sVersion: 'v1.28.0',
  apiServer: 'https://api.production.local:6443',
  certExpireAt: '2026-08-20',
  certExpireDays: 114
})

// CPU 使用率
const cpuUsed = ref(12)
const cpuTotal = ref(32)
const cpuUsage = computed(() => Math.round((cpuUsed.value / cpuTotal.value) * 100))

// 内存使用率
const memoryUsed = ref('48 Gi')
const memoryTotal = ref('64 Gi')
const memoryUsage = ref(75)

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
const sortOptions = [
  { label: 'CPU排名', value: 'cpu' },
  { label: '内存排名', value: 'memory' }
]

function handleSortChange(value?: string | number) {
  sortKey.value = (value as SortKey) || 'cpu'
}

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
  const key = (sortKey.value + 'Usage') as 'cpuUsage' | 'memoryUsage'
  return [...nodeList.value].sort((a, b) => b[key] - a[key]).slice(0, 5)
})

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

function loadRadarData() {
  // TODO: 刷新资源用量数据
  console.log('Loading radar data...')
}

onMounted(() => {
  // TODO: 加载真实统计数据
})
</script>

<style lang="scss" scoped>
.cluster-overview {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;

  .cluster-info-card {
    display: flex;
    gap: 24px;
    flex-shrink: 0;
    align-items: center;
    padding: 20px 24px;
    margin-bottom: 16px;

    .cluster-main {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .cluster-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 12px;
      color: $color-primary;
      background: $bg-selected;
    }

    .cluster-basic {
      .cluster-name {
        font-size: 18px;
        font-weight: 600;
        line-height: 1.4;
        color: $color-text-primary;
      }

      .cluster-desc {
        margin-top: 4px;
        font-size: 14px;
        color: $color-text-secondary;
      }

      .cluster-meta {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-top: 8px;

        .meta-item {
          display: flex;
          gap: 4px;
          align-items: center;
          font-size: 12px;
          color: $color-text-secondary;
        }
      }
    }

    .vertical-divider {
      height: 64px;
    }

    .cluster-details {
      display: flex;
      gap: 32px;

      .detail-item {
        display: flex;
        gap: 4px;
        flex-direction: column;

        .detail-label {
          font-size: 12px;
          color: $color-text-secondary;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 500;
          color: $color-text-primary;

          &.api-url {
            font-family: monospace;
            font-size: 13px;
          }

          &.text-warning {
            color: $color-warning;
          }
        }
      }
    }

    .cluster-status {
      display: flex;
      gap: 8px;
      flex-direction: column;
      align-items: center;

      .status-label {
        font-size: 12px;
        color: $color-text-secondary;
      }
    }
  }

  .bee-card {
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      font-weight: 500;

      .header-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }
    }

    .card-body {
      padding: 0 16px 16px;
    }
  }

  .top-row {
    display: flex;
    gap: 16px;

    .bee-card {
      flex: 1;
    }

    .radar-card {
      .card-body {
        display: flex;
        gap: 16px;
        flex-direction: row;
        align-items: flex-start;
      }

      .radar-legend {
        display: flex;
        gap: 8px;
        flex-direction: column;
        flex: 1;
        min-width: 0;

        .legend-row {
          display: grid;
          gap: 12px;
          grid-template-columns: 48px 1fr 1fr 1fr;
          align-items: center;
          padding: 8px 16px;
          border-radius: 8px;
          background: $bg-selected;
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
          gap: 4px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 48px;

          .col-value {
            font-size: 14px;
            font-weight: 600;
            line-height: 1;
            color: $color-text-primary;
          }

          .col-label {
            font-size: 12px;
            line-height: 1;
            color: $color-text-secondary;
          }
        }
      }
    }

    .node-card {
      .node-items {
        display: flex;
        gap: 8px;
        flex-direction: column;
        overflow-y: auto;
      }

      .node-item {
        display: grid;
        gap: 16px;
        grid-template-columns: 32px 1fr 140px;
        align-items: center;
        padding: 8px 12px;
        border-radius: 6px;
        background: $bg-selected;

        .node-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: $color-primary;
        }

        .node-info {
          display: flex;
          gap: 2px;
          flex-direction: column;
          min-width: 0;

          .node-name {
            font-size: 14px;
            font-weight: 500;
            color: $color-text-primary;
          }

          .node-desc {
            font-size: 12px;
            color: $color-text-secondary;
          }
        }

        .node-usage {
          display: flex;
          gap: 6px;
          flex-direction: column;

          .usage-bar {
            display: grid;
            gap: 8px;
            grid-template-columns: 32px 1fr 36px;
            align-items: center;

            .usage-label {
              font-size: 11px;
              color: $color-text-secondary;
            }

            .usage-track {
              height: 6px;
              border-radius: 3px;
              overflow: hidden;
              background: #e4e7ed;

              .usage-fill {
                height: 100%;
                border-radius: 3px;
                transition: width 0.3s ease;
              }
            }

            .usage-value {
              font-size: 11px;
              font-weight: 500;
              color: $color-text-primary;
              text-align: right;
            }
          }
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
