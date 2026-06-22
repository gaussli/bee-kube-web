<template>
  <div class="deployment-detail">
    <!-- 页面标题 -->
    <div class="page-header">
      <BeePageTitle :icon="Document" :title="`无状态应用详情: ${deploymentName}`" description="查看 Deployment 详细信息、Pod 状态、事件等。" />
    </div>

    <!-- 页面内容 -->
    <div class="page-body">
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <div class="detail-section" v-loading="loading">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">应用名称:</span>
                <span class="detail-value">{{ deploymentData?.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">命名空间:</span>
                <span class="detail-value">{{ deploymentData?.namespace }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">集群:</span>
                <span class="detail-value">{{ deploymentData?.clusterName || deploymentData?.clusterId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">更新策略:</span>
                <span class="detail-value">{{ deploymentData?.strategy }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">期望副本:</span>
                <span class="detail-value">{{ deploymentData?.replicas }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">可用副本:</span>
                <span :class="['detail-value', deploymentData?.availableReplicas === deploymentData?.replicas ? 'replicas-ready' : 'replicas-pending']">
                  {{ deploymentData?.availableReplicas }}
                </span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">就绪副本:</span>
                <span :class="['detail-value', deploymentData?.readyReplicas === deploymentData?.replicas ? 'replicas-ready' : 'replicas-pending']">
                  {{ deploymentData?.readyReplicas }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">创建时间:</span>
                <span class="detail-value">{{ deploymentData?.createAt }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 标签选择器 -->
        <el-tab-pane label="标签选择器" name="selector">
          <div class="detail-section" v-loading="loading">
            <div v-if="deploymentData?.selector && Object.keys(deploymentData.selector).length > 0">
              <div v-for="(value, key) in deploymentData.selector" :key="key" class="label-item">
                <BeeTag>{{ key }}: {{ value }}</BeeTag>
              </div>
            </div>
            <el-empty v-else description="暂无标签选择器" />
          </div>
        </el-tab-pane>

        <!-- 标签 -->
        <el-tab-pane label="标签" name="labels">
          <div class="detail-section" v-loading="loading">
            <div v-if="deploymentData?.labels && Object.keys(deploymentData.labels).length > 0">
              <div v-for="(value, key) in deploymentData.labels" :key="key" class="label-item">
                <BeeTag>{{ key }}: {{ value }}</BeeTag>
              </div>
            </div>
            <el-empty v-else description="暂无标签" />
          </div>
        </el-tab-pane>

        <!-- 注解 -->
        <el-tab-pane label="注解" name="annotations">
          <div class="detail-section" v-loading="loading">
            <div v-if="deploymentData?.annotations && Object.keys(deploymentData.annotations).length > 0">
              <div v-for="(value, key) in deploymentData.annotations" :key="key" class="annotation-item">
                <div class="annotation-key">{{ key }}</div>
                <div class="annotation-value">{{ value }}</div>
              </div>
            </div>
            <el-empty v-else description="暂无注解" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 底部操作 -->
    <div class="page-footer">
      <BeeButton @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeButton v-if="hasPermission('kubernetes:workload:deployment:edit')" type="primary" @click="handleEdit">
        <template #icon><EditPen /></template>
        编辑
      </BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, ArrowLeft, EditPen } from '@element-plus/icons-vue'
import type { DeploymentResp } from '@/types/kubernetes/workload/deployment'
import { getDeploymentDetail } from '@/api/kubernetes/workload/deployment'
import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'DeploymentDetail' })

const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()

const clusterId = ref(route.query.clusterId as string)
const namespace = ref(route.query.namespace as string)
const deploymentName = ref(route.query.name as string)
const loading = ref(false)
const deploymentData = ref<DeploymentResp>()
const activeTab = ref('basic')

async function loadData() {
  if (!clusterId.value || !namespace.value || !deploymentName.value) return
  loading.value = true
  try {
    deploymentData.value = await getDeploymentDetail(clusterId.value, namespace.value, deploymentName.value)
  } finally {
    loading.value = false
  }
}

function handleBack() {
  router.back()
}

function handleEdit() {
  router.push({ name: 'kubernetes:workload:deployment:edit', query: { clusterId: clusterId.value, namespace: namespace.value, name: deploymentName.value } })
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.deployment-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.page-header {
  flex-shrink: 0;
  padding: 16px 20px 0;
  margin-bottom: 16px;
  background-color: $color-bg-surface;
}

.page-body {
  flex: 1;
  min-height: 0;
  padding: 0 20px;
  overflow: hidden;
  background-color: $color-bg-surface;

  :deep(.el-tabs) {
    display: flex;
    flex-direction: column;
    height: 100%;

    .el-tabs__content {
      flex: 1;
      overflow-y: auto;
    }
  }
}

.page-footer {
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: $color-bg-surface;
}

.detail-section {
  padding: 20px;
}

.detail-row {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.detail-item {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 300px;
}

.detail-label {
  min-width: 100px;
  font-size: 14px;
  color: $text-secondary;
}

.detail-value {
  font-size: 14px;
  color: $text-primary;
}

.replicas-ready {
  color: $color-success;
}

.replicas-pending {
  color: $color-warning;
}

.label-item {
  margin-bottom: 8px;
}

.annotation-item {
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 4px;
  background-color: $bg-card;

  .annotation-key {
    margin-bottom: 4px;
    font-weight: 500;
    color: $text-primary;
  }

  .annotation-value {
    font-size: 13px;
    color: $text-secondary;
    word-break: break-all;
  }
}
</style>
