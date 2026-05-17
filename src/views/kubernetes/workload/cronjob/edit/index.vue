<template>
  <div class="cronjob-edit">
    <div class="page-header">
      <BeePageTitle :icon="Clock" :title="`编辑定时任务: ${cronjobName}`" description="编辑 CronJob 配置。" />
    </div>
    <div class="page-body">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px" class="edit-form">
        <el-form-item label="调度规则" prop="schedule">
          <el-input v-model="formData.schedule" placeholder="例如: */5 * * * *" style="width: 300px">
            <template #append
              ><el-tooltip content="Cron 表达式: 分 时 日 月 周" placement="top"
                ><el-icon><InfoFilled /></el-icon></el-tooltip
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item label="暂停">
          <el-switch v-model="formData.suspend" />
        </el-form-item>
        <el-form-item label="标签">
          <div class="key-value-list">
            <div v-for="(item, index) in labelList" :key="index" class="key-value-item">
              <el-input v-model="item.key" placeholder="键" /><span class="separator">:</span><el-input v-model="item.value" placeholder="值" />
              <el-button circle :icon="Delete" size="small" @click="removeLabel(index)" />
            </div>
            <BeeButton type="primary" @click="addLabel"
              ><template #icon><Plus /></template>添加标签</BeeButton
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="page-footer">
      <BeeButton @click="handleCancel"
        ><template #icon><Close /></template>取消</BeeButton
      >
      <BeeButton type="primary" :loading="submitting" @click="handleSubmit"
        ><template #icon><Check /></template>保存</BeeButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Clock, Plus, Delete, Close, Check, InfoFilled } from '@element-plus/icons-vue'
import type { CronJobResp } from '@/types/kubernetes/workload/cronjob'
import { getCronJobDetail, updateCronJob } from '@/api/kubernetes/workload/cronjob'
import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'

defineOptions({ name: 'CronJobEdit' })
const route = useRoute()
const router = useRouter()
const clusterId = ref(route.query.clusterId as string)
const namespace = ref(route.query.namespace as string)
const cronjobName = ref(route.query.name as string)
const loading = ref(false)
const submitting = ref(false)
const cronjobData = ref<CronJobResp>()
const formData = ref<Partial<CronJobResp>>({ schedule: '', suspend: false })
const labelList = ref<Array<{ key: string; value: string }>>([])
const formRules = { schedule: [{ required: true, message: '请输入调度规则', trigger: 'blur' }] }
async function loadData() {
  if (!clusterId.value || !namespace.value || !cronjobName.value) return
  loading.value = true
  try {
    cronjobData.value = await getCronJobDetail(clusterId.value, namespace.value, cronjobName.value)
    formData.value.schedule = cronjobData.value.schedule
    formData.value.suspend = cronjobData.value.suspend
    if (cronjobData.value.labels) labelList.value = Object.entries(cronjobData.value.labels).map(([key, value]) => ({ key, value }))
  } finally {
    loading.value = false
  }
}
function addLabel() {
  labelList.value.push({ key: '', value: '' })
}
function removeLabel(index: number) {
  labelList.value.splice(index, 1)
}
function handleCancel() {
  router.back()
}
async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  const labels: Record<string, string> = {}
  labelList.value.forEach(item => {
    if (item.key) labels[item.key] = item.value
  })
  submitting.value = true
  try {
    await updateCronJob(clusterId.value, namespace.value, cronjobName.value, { ...formData.value, labels })
    ElMessage.success('保存成功')
    router.back()
  } catch {
  } finally {
    submitting.value = false
  }
}
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.cronjob-edit {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.page-header {
  flex-shrink: 0;
  padding: 16px 20px 0;
  margin-bottom: 16px;
  background-color: $bg-page;
}

.page-body {
  flex: 1;
  min-height: 0;
  padding: 0 20px;
  overflow-y: auto;
  background-color: $bg-page;
}

.page-footer {
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: $bg-page;
}

.edit-form {
  max-width: 800px;
  padding: 20px 0;
}

.key-value-list {
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.key-value-item {
  display: flex;
  gap: 8px;
  align-items: center;

  .el-input {
    flex: 1;
  }

  .separator {
    color: $text-secondary;
  }
}
</style>
