<template>
  <div class="daemonset-detail">
    <div class="page-header">
      <BeePageHeader
        :icon="Monitor"
        :title="`守护进程详情: ${daemonsetName}`"
        description="查看 DaemonSet 详细信息。"
      />
    </div>
    <div class="page-body">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="基本信息" name="basic">
          <div v-loading="loading" class="detail-section">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">应用名称:</span><span class="detail-value">{{ daemonsetData?.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">命名空间:</span
                ><span class="detail-value">{{ daemonsetData?.namespace }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">集群:</span
                ><span class="detail-value">{{ daemonsetData?.clusterName || daemonsetData?.clusterUid }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">期望调度:</span
                ><span class="detail-value">{{ daemonsetData?.desiredNumberScheduled }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">就绪数量:</span
                ><span
                  :class="[
                    'detail-value',
                    daemonsetData?.numberReady === daemonsetData?.desiredNumberScheduled
                      ? 'replicas-ready'
                      : 'replicas-pending',
                  ]"
                  >{{ daemonsetData?.numberReady }}</span
                >
              </div>
              <div class="detail-item">
                <span class="detail-label">可用数量:</span
                ><span class="detail-value">{{ daemonsetData?.numberAvailable }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">创建时间:</span
                ><span class="detail-value">{{ daemonsetData?.createAt }}</span>
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
      <BeeButton v-if="hasPermission('kubernetes:workload:daemonset:edit')" type="primary" @click="handleEdit"
        ><template #icon><EditPen /></template>编辑</BeeButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { Monitor, ArrowLeft, EditPen } from '@element-plus/icons-vue'

import type { DaemonSetResp } from '@/types/kubernetes/workload/daemonset'

import { getDaemonSetDetail } from '@/api/kubernetes/workload/daemonset'

import BeeButton from '@/components/BeeButton/index.vue'
import BeePageHeader from '@/components/BeePageHeader/index.vue'

import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'DaemonSetDetail' })
const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()
const clusterUid = ref(route.params.clusterUid as string)
const namespace = ref(route.query.namespace as string)
const daemonsetName = ref(route.query.name as string)
const loading = ref(false)
const daemonsetData = ref<DaemonSetResp>()
const activeTab = ref('basic')
async function loadData() {
  if (!clusterUid.value || !namespace.value || !daemonsetName.value) return
  loading.value = true
  try {
    daemonsetData.value = await getDaemonSetDetail(clusterUid.value, namespace.value, daemonsetName.value)
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
      name: 'kubernetes:workload:daemonset:edit',
      params: { clusterUid: clusterUid.value },
      query: { namespace: namespace.value, name: daemonsetName.value },
    })
    .catch(() => {})
}
onMounted(() => {
  void loadData()
})
</script>

<style lang="scss" scoped>
.daemonset-detail {
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
