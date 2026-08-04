<template>
  <div class="job-detail">
    <div class="page-header">
      <BeePageTitle :icon="Timer" :title="`任务详情: ${jobName}`" description="查看 Job 详细信息。" />
    </div>
    <div class="page-body">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="基本信息" name="basic">
          <div v-loading="loading" class="detail-section">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">任务名称:</span><span class="detail-value">{{ jobData?.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">命名空间:</span><span class="detail-value">{{ jobData?.namespace }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">集群:</span
                ><span class="detail-value">{{ jobData?.clusterName || jobData?.clusterId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">并行度:</span><span class="detail-value">{{ jobData?.parallelism }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">完成数:</span><span class="detail-value">{{ jobData?.completions }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">活跃:</span><span class="detail-value">{{ jobData?.active }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">成功:</span
                ><span
                  :class="[
                    'detail-value',
                    jobData?.succeeded === jobData?.completions ? 'replicas-ready' : 'replicas-pending',
                  ]"
                  >{{ jobData?.succeeded }}</span
                >
              </div>
              <div class="detail-item">
                <span class="detail-label">失败:</span
                ><span :class="['detail-value', (jobData?.failed || 0) > 0 ? 'replicas-pending' : '']">{{
                  jobData?.failed
                }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">创建时间:</span><span class="detail-value">{{ jobData?.createAt }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="page-footer">
      <BeeButton @click="handleBack"
        ><template #icon><ArrowLeft /></template>返回</BeeButton
      >
      <BeeButton v-if="hasPermission('kubernetes:workload:job:edit')" type="primary" @click="handleEdit"
        ><template #icon><EditPen /></template>编辑</BeeButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { Timer, ArrowLeft, EditPen } from '@element-plus/icons-vue'

import type { JobResp } from '@/types/kubernetes/workload/job'

import { getJobDetail } from '@/api/kubernetes/workload/job'

import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'

import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'JobDetail' })
const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()
const clusterId = ref(route.params.clusterId as string)
const namespace = ref(route.query.namespace as string)
const jobName = ref(route.query.name as string)
const loading = ref(false)
const jobData = ref<JobResp>()
const activeTab = ref('basic')
async function loadData() {
  if (!clusterId.value || !namespace.value || !jobName.value) return
  loading.value = true
  try {
    jobData.value = await getJobDetail(clusterId.value, namespace.value, jobName.value)
  } finally {
    loading.value = false
  }
}
function handleBack() {
  router.back()
}
function handleEdit() {
  router
    .push({
      name: 'kubernetes:workload:job:edit',
      params: { clusterId: clusterId.value },
      query: { namespace: namespace.value, name: jobName.value },
    })
    .catch(() => {})
}
onMounted(() => {
  void loadData()
})
</script>

<style lang="scss" scoped>
.job-detail {
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
  justify-content: space-between;
  flex-shrink: 0;
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

.replicas-ready {
  color: $color-success;
}

.replicas-pending {
  color: $color-warning;
}
</style>
