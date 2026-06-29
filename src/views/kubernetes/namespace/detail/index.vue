<template>
  <div class="namespace-detail">
    <!-- 页面标题 -->
    <div class="page-header">
      <BeePageTitle :icon="FolderOpened" :title="`命名空间详情: ${namespaceName}`" description="查看命名空间详细信息、标签和注解等。" />
    </div>

    <!-- 页面内容 -->
    <div class="page-body">
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <div class="detail-section" v-loading="loading">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">命名空间名称:</span>
                <span class="detail-value">{{ namespaceData?.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">状态:</span>
                <el-tag :type="getStatusType(namespaceData?.status)" size="small">{{ namespaceData?.status }}</el-tag>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">阶段:</span>
                <span class="detail-value">{{ namespaceData?.phase }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">集群:</span>
                <span class="detail-value">{{ namespaceData?.clusterName || namespaceData?.clusterId }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">创建时间:</span>
                <span class="detail-value">{{ namespaceData?.createAt }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 标签 -->
        <el-tab-pane label="标签" name="labels">
          <div class="detail-section" v-loading="loading">
            <div v-if="namespaceData?.labels && Object.keys(namespaceData.labels).length > 0">
              <div v-for="(value, key) in namespaceData.labels" :key="key" class="label-item">
                <BeeTag>{{ key }}: {{ value }}</BeeTag>
              </div>
            </div>
            <el-empty v-else description="暂无标签" />
          </div>
        </el-tab-pane>

        <!-- 注解 -->
        <el-tab-pane label="注解" name="annotations">
          <div class="detail-section" v-loading="loading">
            <div v-if="namespaceData?.annotations && Object.keys(namespaceData.annotations).length > 0">
              <div v-for="(value, key) in namespaceData.annotations" :key="key" class="annotation-item">
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
      <BeeButton v-if="hasPermission('kubernetes:namespace:edit')" type="primary" @click="handleEdit">
        <template #icon><EditPen /></template>
        编辑
      </BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FolderOpened, ArrowLeft, EditPen } from '@element-plus/icons-vue'
import type { NamespaceResp } from '@/types/kubernetes/namespace'
import { getNamespaceDetail } from '@/api/kubernetes/namespace'
import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'NamespaceDetail' })

const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()

const clusterId = ref(route.params.clusterId as string)
const namespaceName = ref(route.query.name as string)
const loading = ref(false)
const namespaceData = ref<NamespaceResp>()
const activeTab = ref('basic')

function getStatusType(status?: string) {
  switch (status) {
    case 'Active':
      return 'success'
    case 'Terminating':
      return 'warning'
    default:
      return 'info'
  }
}

async function loadData() {
  if (!clusterId.value || !namespaceName.value) return
  loading.value = true
  try {
    namespaceData.value = await getNamespaceDetail(clusterId.value, namespaceName.value)
  } finally {
    loading.value = false
  }
}

function handleBack() {
  router.back()
}

function handleEdit() {
  router.push({ name: 'kubernetes:namespace:edit', params: { clusterId: clusterId.value }, query: { name: namespaceName.value } })
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.namespace-detail {
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
  background-color: $bg-card;

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
