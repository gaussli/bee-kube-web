<template>
  <div class="cluster-overview">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background: #409eff">
              <el-icon><Box /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.nodeCount }}</div>
              <div class="stat-label">节点数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background: #67c23a">
              <el-icon><FolderOpened /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.namespaceCount }}</div>
              <div class="stat-label">命名空间</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background: #e6a23c">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.podCount }}</div>
              <div class="stat-label">Pod 总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background: #f56c6c">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.warningCount }}</div>
              <div class="stat-label">警告事件</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 资源使用情况 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>CPU 使用率</span>
            </div>
          </template>
          <div class="chart-container">
            <el-progress type="dashboard" :percentage="cpuUsage" :color="cpuColor" :width="180">
              <template #default>
                <span class="progress-value">{{ cpuUsage }}%</span>
              </template>
            </el-progress>
            <div class="chart-info">
              <div class="info-item">
                <span class="info-label">已用：</span>
                <span class="info-value">{{ cpuUsed }} 核</span>
              </div>
              <div class="info-item">
                <span class="info-label">总计：</span>
                <span class="info-value">{{ cpuTotal }} 核</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>内存使用率</span>
            </div>
          </template>
          <div class="chart-container">
            <el-progress type="dashboard" :percentage="memoryUsage" :color="memoryColor" :width="180">
              <template #default>
                <span class="progress-value">{{ memoryUsage }}%</span>
              </template>
            </el-progress>
            <div class="chart-info">
              <div class="info-item">
                <span class="info-label">已用：</span>
                <span class="info-value">{{ memoryUsed }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">总计：</span>
                <span class="info-value">{{ memoryTotal }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近事件 -->
    <el-card shadow="hover" class="events-card">
      <template #header>
        <div class="card-header">
          <span>最近事件</span>
          <BeeButton size="small" @click="loadEvents">
            <template #icon><Refresh /></template>
            刷新
          </BeeButton>
        </div>
      </template>
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
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Box, Document, FolderOpened, Refresh, Warning } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'

defineOptions({ name: 'ClusterOverview' })

// 统计数据
const stats = ref({
  nodeCount: 5,
  namespaceCount: 8,
  podCount: 126,
  warningCount: 3
})

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

// 最近事件
const recentEvents = ref([
  { type: 'Normal', reason: 'Scheduled', object: 'pod/nginx-deployment-7fb96c846b-xk2p9', message: 'Successfully assigned pod to node-1', time: '2024-01-15 10:30:25' },
  { type: 'Warning', reason: 'FailedScheduling', object: 'pod/app-pod-5d8f9c7b4-m8n2p', message: '0/5 nodes are available: 2 Insufficient memory, 3 node(s) were rescheduled.', time: '2024-01-15 10:28:14' },
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
  padding: 20px;

  .stat-row {
    margin-bottom: 20px;
  }

  .chart-row {
    margin-bottom: 20px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: 8px;

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 8px;
      color: white;
      font-size: 24px;
    }

    .stat-info {
      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: $text-primary;
      }

      .stat-label {
        font-size: 14px;
        color: $text-secondary;
        margin-top: 4px;
      }
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 500;
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
    :deep(.el-card__header) {
      padding: 12px 20px;
    }
  }
}
</style>
