<template>
  <div class="job-edit">
    <div class="page-header">
      <BeePageTitle :icon="Timer" :title="`编辑任务: ${jobName}`" description="编辑 Job 配置。" />
    </div>
    <div class="page-body">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px" class="edit-form">
        <el-form-item label="并行度" prop="parallelism">
          <el-input-number v-model="formData.parallelism" :min="1" :max="100" />
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
import { Timer, Plus, Delete, Close, Check } from '@element-plus/icons-vue'
import type { JobResp } from '@/types/kubernetes/workload/job'
import { getJobDetail, updateJob } from '@/api/kubernetes/workload/job'
import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'

defineOptions({ name: 'JobEdit' })
const route = useRoute()
const router = useRouter()
const clusterId = ref(route.query.clusterId as string)
const namespace = ref(route.query.namespace as string)
const jobName = ref(route.query.name as string)
const loading = ref(false)
const submitting = ref(false)
const jobData = ref<JobResp>()
const formData = ref<Partial<JobResp>>({ parallelism: 1 })
const labelList = ref<Array<{ key: string; value: string }>>([])
const formRules = { parallelism: [{ required: true, message: '请输入并行度', trigger: 'blur' }] }
async function loadData() {
  if (!clusterId.value || !namespace.value || !jobName.value) return
  loading.value = true
  try {
    jobData.value = await getJobDetail(clusterId.value, namespace.value, jobName.value)
    formData.value.parallelism = jobData.value.parallelism
    if (jobData.value.labels) labelList.value = Object.entries(jobData.value.labels).map(([key, value]) => ({ key, value }))
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
    await updateJob(clusterId.value, namespace.value, jobName.value, { ...formData.value, labels })
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
.job-edit {
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
  overflow-y: auto;
  background-color: $color-bg-surface;
}

.page-footer {
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: $color-bg-surface;
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
    color: $color-text-secondary;
  }
}
</style>
