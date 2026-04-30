<template>
  <div class="cronjob-detail">
    <div class="page-header">
      <BeePageTitle :icon="Clock" :title="`定时任务详情: ${cronjobName}`" description="查看 CronJob 详细信息。" />
    </div>
    <div class="page-body">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="基本信息" name="basic">
          <div class="detail-section" v-loading="loading">
            <div class="detail-row">
              <div class="detail-item"><span class="detail-label">任务名称:</span><span class="detail-value">{{ cronjobData?.name }}</span></div>
              <div class="detail-item"><span class="detail-label">命名空间:</span><span class="detail-value">{{ cronjobData?.namespace }}</span></div>
            </div>
            <div class="detail-row">
              <div class="detail-item"><span class="detail-label">集群:</span><span class="detail-value">{{ cronjobData?.clusterName || cronjobData?.clusterId }}</span></div>
              <div class="detail-item"><span class="detail-label">调度规则:</span><code class="schedule-code">{{ cronjobData?.schedule }}</code></div>
            </div>
            <div class="detail-row">
              <div class="detail-item"><span class="detail-label">暂停:</span><el-tag :type="cronjobData?.suspend ? 'warning' : 'success'" size="small">{{ cronjobData?.suspend ? '是' : '否' }}</el-tag></div>
              <div class="detail-item"><span class="detail-label">活跃任务:</span><span class="detail-value">{{ cronjobData?.active }}</span></div>
            </div>
            <div class="detail-row">
              <div class="detail-item"><span class="detail-label">上次调度:</span><TimeCell :time="cronjobData?.lastScheduleTime" /></div>
              <div class="detail-item"><span class="detail-label">创建时间:</span><span class="detail-value">{{ cronjobData?.createAt }}</span></div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="page-footer">
      <BeeButton @click="handleBack"><template #icon><ArrowLeft /></template>返回</BeeButton>
      <BeeButton v-if="hasPermission('kubernetes:workload:cronjob:edit')" type="primary" @click="handleEdit"><template #icon><EditPen /></template>编辑</BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Clock, ArrowLeft, EditPen } from '@element-plus/icons-vue'
import type { CronJobResp } from '@/types'
import { getCronJobDetail } from '@/api'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import TimeCell from '@/components/TimeCell/index.vue'
import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'CronJobDetail' })
const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()
const clusterId = ref(route.query.clusterId as string)
const namespace = ref(route.query.namespace as string)
const cronjobName = ref(route.query.name as string)
const loading = ref(false)
const cronjobData = ref<CronJobResp>()
const activeTab = ref('basic')
async function loadData() {
  if (!clusterId.value || !namespace.value || !cronjobName.value) return
  loading.value = true
  try { cronjobData.value = await getCronJobDetail(clusterId.value, namespace.value, cronjobName.value) } finally { loading.value = false }
}
function handleBack() { router.back() }
function handleEdit() { router.push({ name: 'kubernetes:workload:cronjob:edit', query: { clusterId: clusterId.value, namespace: namespace.value, name: cronjobName.value } }) }
onMounted(() => { loadData() })
</script>

<style lang="scss" scoped>
.cronjob-detail { height: 100%; display: flex; flex-direction: column; }
.page-header { flex-shrink: 0; padding: 16px 20px 0 20px; margin-bottom: 16px; background-color: $bg-page; }
.page-body { flex: 1; min-height: 0; overflow: hidden; padding: 0 20px; background-color: $bg-page; :deep(.el-tabs) { height: 100%; display: flex; flex-direction: column; .el-tabs__content { flex: 1; overflow-y: auto; } } }
.page-footer { flex-shrink: 0; display: flex; justify-content: space-between; padding: 16px 20px; background-color: $bg-page; }
.detail-section { padding: 20px; }
.detail-row { display: flex; gap: 40px; margin-bottom: 20px; &:last-child { margin-bottom: 0; } }
.detail-item { display: flex; align-items: center; gap: 12px; min-width: 300px; }
.detail-label { color: $text-secondary; font-size: 14px; min-width: 100px; }
.detail-value { color: $text-primary; font-size: 14px; }
.schedule-code { font-family: monospace; font-size: 13px; background-color: $bg-card; padding: 4px 8px; border-radius: 4px; }
</style>
