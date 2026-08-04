<template>
  <div class="node-detail">
    <!-- 页面标题 -->
    <div class="page-header">
      <BeePageTitle
        :icon="Box"
        :title="`节点详情: ${nodeName}`"
        description="查看节点详细信息、资源使用情况、标签和污点等。"
      />
    </div>

    <!-- 页面内容 -->
    <div class="page-body">
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <div v-loading="loading" class="detail-section">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">节点名称:</span>
                <span class="detail-value">{{ nodeData?.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">状态:</span>
                <el-tag :type="getStatusType(nodeData?.status)" size="small">{{ nodeData?.status }}</el-tag>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">集群:</span>
                <span class="detail-value">{{ nodeData?.clusterName || nodeData?.clusterId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">角色:</span>
                <BeeTag v-for="role in nodeData?.roles" :key="role" size="small">{{ role }}</BeeTag>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">Kubernetes 版本:</span>
                <span class="detail-value">{{ nodeData?.version }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">操作系统:</span>
                <span class="detail-value">{{ nodeData?.os }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">架构:</span>
                <span class="detail-value">{{ nodeData?.architecture }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">内部 IP:</span>
                <span class="detail-value">{{ nodeData?.internalIp }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">创建时间:</span>
                <span class="detail-value">{{ nodeData?.createAt }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 资源信息 -->
        <el-tab-pane label="资源信息" name="resources">
          <div v-loading="loading" class="detail-section">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">CPU:</span>
                <span class="detail-value">{{ nodeData?.cpu }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">内存:</span>
                <span class="detail-value">{{ nodeData?.memory }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">Pod 容量:</span>
                <span class="detail-value">{{ nodeData?.pods }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 标签 -->
        <el-tab-pane label="标签" name="labels">
          <div v-loading="loading" class="detail-section">
            <div v-if="nodeData?.labels && Object.keys(nodeData.labels).length > 0">
              <div v-for="(value, key) in nodeData.labels" :key="key" class="label-item">
                <BeeTag>{{ key }}: {{ value }}</BeeTag>
              </div>
            </div>
            <el-empty v-else description="暂无标签" />
          </div>
        </el-tab-pane>

        <!-- 注解 -->
        <el-tab-pane label="注解" name="annotations">
          <div v-loading="loading" class="detail-section">
            <div v-if="nodeData?.annotations && Object.keys(nodeData.annotations).length > 0">
              <div v-for="(value, key) in nodeData.annotations" :key="key" class="annotation-item">
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
      <BeeButton v-if="hasPermission('kubernetes:node:edit')" type="primary" @click="handleEdit">
        <template #icon><EditPen /></template>
        编辑
      </BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { Box, ArrowLeft, EditPen } from '@element-plus/icons-vue'

import type { NodeListResp } from '@/types/kubernetes/node'

import { getNodeDetail } from '@/api/kubernetes/node'

import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'

import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'NodeDetail' })

const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()

const clusterId = ref(route.params.clusterId as string)
const nodeName = ref(route.query.name as string)
const loading = ref(false)
const nodeData = ref<NodeListResp>()
const activeTab = ref('basic')

function getStatusType(status?: string) {
  switch (status) {
    case 'Ready':
      return 'success'
    case 'NotReady':
      return 'danger'
    default:
      return 'info'
  }
}

async function loadData() {
  if (!clusterId.value || !nodeName.value) return
  loading.value = true
  try {
    nodeData.value = await getNodeDetail(clusterId.value, nodeName.value)
  } finally {
    loading.value = false
  }
}

function handleBack() {
  router.back()
}

function handleEdit() {
  router.push({ name: 'kubernetes:node:edit', params: { clusterId: clusterId.value }, query: { name: nodeName.value } })
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.node-detail {
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
  color: $color-text-secondary;
}

.detail-value {
  font-size: 14px;
  color: $color-text-primary;
}

.label-item {
  margin-bottom: 8px;
}

.annotation-item {
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 4px;
  background-color: $color-bg-surface;

  .annotation-key {
    margin-bottom: 4px;
    font-weight: 500;
    color: $color-text-primary;
  }

  .annotation-value {
    font-size: 13px;
    color: $color-text-secondary;
    word-break: break-all;
  }
}
</style>
