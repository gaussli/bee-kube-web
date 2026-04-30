<template>
  <div class="daemonset-detail">
    <div class="page-header">
      <BeePageTitle :icon="Monitor" :title="`守护进程详情: ${daemonsetName}`" description="查看 DaemonSet 详细信息。" />
    </div>
    <div class="page-body">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="基本信息" name="basic">
          <div class="detail-section" v-loading="loading">
            <div class="detail-row">
              <div class="detail-item"><span class="detail-label">应用名称:</span><span class="detail-value">{{ daemonsetData?.name }}</span></div>
              <div class="detail-item"><span class="detail-label">命名空间:</span><span class="detail-value">{{ daemonsetData?.namespace }}</span></div>
            </div>
            <div class="detail-row">
              <div class="detail-item"><span class="detail-label">集群:</span><span class="detail-value">{{ daemonsetData?.clusterName || daemonsetData?.clusterId }}</span></div>
              <div class="detail-item"><span class="detail-label">期望调度:</span><span class="detail-value">{{ daemonsetData?.desiredNumberScheduled }}</span></div>
            </div>
            <div class="detail-row">
              <div class="detail-item"><span class="detail-label">就绪数量:</span><span :class="['detail-value', daemonsetData?.numberReady === daemonsetData?.desiredNumberScheduled ? 'replicas-ready' : 'replicas-pending']">{{ daemonsetData?.numberReady }}</span></div>
              <div class="detail-item"><span class="detail-label">可用数量:</span><span class="detail-value">{{ daemonsetData?.numberAvailable }}</span></div>
            </div>
            <div class="detail-row">
              <div class="detail-item"><span class="detail-label">创建时间:</span><span class="detail-value">{{ daemonsetData?.createAt }}</span></div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="page-footer">
      <BeeButton @click="handleBack"><template #icon><ArrowLeft /></template>返回</BeeButton>
      <BeeButton v-if="hasPermission('kubernetes:workload:daemonset:edit')" type="primary" @click="handleEdit"><template #icon><EditPen /></template>编辑</BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Monitor, ArrowLeft, EditPen } from '@element-plus/icons-vue'
import type { DaemonSetResp } from '@/types'
import { getDaemonSetDetail } from '@/api'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'DaemonSetDetail' })
const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()
const clusterId = ref(route.query.clusterId as string)
const namespace = ref(route.query.namespace as string)
const daemonsetName = ref(route.query.name as string)
const loading = ref(false)
const daemonsetData = ref<DaemonSetResp>()
const activeTab = ref('basic')
async function loadData() {
  if (!clusterId.value || !namespace.value || !daemonsetName.value) return
  loading.value = true
  try { daemonsetData.value = await getDaemonSetDetail(clusterId.value, namespace.value, daemonsetName.value) } finally { loading.value = false }
}
function handleBack() { router.back() }
function handleEdit() { router.push({ name: 'kubernetes:workload:daemonset:edit', query: { clusterId: clusterId.value, namespace: namespace.value, name: daemonsetName.value } }) }
onMounted(() => { loadData() })
</script>

<style lang="scss" scoped>
.daemonset-detail { height: 100%; display: flex; flex-direction: column; }
.page-header { flex-shrink: 0; padding: 16px 20px 0 20px; margin-bottom: 16px; background-color: $bg-page; }
.page-body { flex: 1; min-height: 0; overflow: hidden; padding: 0 20px; background-color: $bg-page; :deep(.el-tabs) { height: 100%; display: flex; flex-direction: column; .el-tabs__content { flex: 1; overflow-y: auto; } } }
.page-footer { flex-shrink: 0; display: flex; justify-content: space-between; padding: 16px 20px; background-color: $bg-page; }
.detail-section { padding: 20px; }
.detail-row { display: flex; gap: 40px; margin-bottom: 20px; &:last-child { margin-bottom: 0; } }
.detail-item { display: flex; align-items: center; gap: 12px; min-width: 300px; }
.detail-label { color: $text-secondary; font-size: 14px; min-width: 100px; }
.detail-value { color: $text-primary; font-size: 14px; }
.replicas-ready { color: $color-success; }
.replicas-pending { color: $color-warning; }
</style>
