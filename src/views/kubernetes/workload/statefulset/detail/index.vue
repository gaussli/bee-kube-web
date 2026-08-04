<template>
  <div class="statefulset-detail">
    <div class="page-header">
      <BeePageTitle
        :icon="Collection"
        :title="`有状态应用详情: ${statefulsetName}`"
        description="查看 StatefulSet 详细信息。"
      />
    </div>
    <div class="page-body">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="基本信息" name="basic">
          <div v-loading="loading" class="detail-section">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">应用名称:</span
                ><span class="detail-value">{{ statefulsetData?.basic.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">命名空间:</span
                ><span class="detail-value">{{ statefulsetData?.basic.namespace }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">集群:</span
                ><span class="detail-value">{{
                  statefulsetData?.basic.clusterName || statefulsetData?.basic.clusterId
                }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">服务名称:</span
                ><span class="detail-value">{{ statefulsetData?.basic.serviceName }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">期望副本:</span
                ><span class="detail-value">{{ statefulsetData?.replicas.replicas }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">就绪副本:</span
                ><span
                  :class="[
                    'detail-value',
                    statefulsetData?.replicas.readyReplicas === statefulsetData?.replicas.replicas
                      ? 'replicas-ready'
                      : 'replicas-pending',
                  ]"
                  >{{ statefulsetData?.replicas.readyReplicas }}</span
                >
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">创建时间:</span
                ><span class="detail-value">{{ statefulsetData?.basic.createAt }}</span>
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
      <BeeButton v-if="hasPermission('kubernetes:workload:statefulset:edit')" type="primary" @click="handleEdit"
        ><template #icon><EditPen /></template>编辑</BeeButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { Collection, ArrowLeft, EditPen } from '@element-plus/icons-vue'

import type { StatefulSetDetailVo } from '@/types/kubernetes/workload/statefulset'

import { getStatefulSetDetail } from '@/api/kubernetes/workload/statefulset'

import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'

import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'StatefulSetDetail' })
const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()
const clusterId = ref(route.params.clusterId as string)
const namespace = ref(route.query.namespace as string)
const statefulsetName = ref(route.query.name as string)
const loading = ref(false)
const statefulsetData = ref<StatefulSetDetailVo>()
const activeTab = ref('basic')
async function loadData() {
  if (!clusterId.value || !namespace.value || !statefulsetName.value) return
  loading.value = true
  try {
    statefulsetData.value = await getStatefulSetDetail(clusterId.value, namespace.value, statefulsetName.value)
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
      name: 'kubernetes:workload:statefulset:edit',
      params: { clusterId: clusterId.value },
      query: { namespace: namespace.value, name: statefulsetName.value },
    })
    .catch(() => {})
}
onMounted(() => {
  void loadData()
})
</script>

<style lang="scss" scoped>
.statefulset-detail {
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

.replicas-ready {
  color: $color-success;
}

.replicas-pending {
  color: $color-warning;
}
</style>
