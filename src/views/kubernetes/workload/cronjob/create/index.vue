<template>
  <div class="cronjob-create">
    <div class="page-header">
      <BeePageTitle :icon="Clock" title="创建定时任务" description="创建一个新的 Kubernetes CronJob。" />
    </div>
    <div class="page-body">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px" class="create-form">
        <el-form-item label="所属集群" prop="clusterId">
          <el-select v-model="formData.clusterId" placeholder="选择集群" style="width: 300px;"><el-option label="默认集群" value="default" /></el-select>
        </el-form-item>
        <el-form-item label="命名空间" prop="namespace">
          <el-select v-model="formData.namespace" placeholder="选择命名空间" style="width: 300px;"><el-option label="default" value="default" /></el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入任务名称" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="调度规则" prop="schedule">
          <el-input v-model="formData.schedule" placeholder="例如: */5 * * * *" style="width: 300px;">
            <template #append><el-tooltip content="Cron 表达式: 分 时 日 月 周" placement="top"><el-icon><InfoFilled /></el-icon></el-tooltip></template>
          </el-input>
        </el-form-item>
        <el-form-item label="暂停">
          <el-switch v-model="formData.suspend" />
        </el-form-item>
      </el-form>
    </div>
    <div class="page-footer">
      <BeeButton @click="handleCancel"><template #icon><Close /></template>取消</BeeButton>
      <BeeButton type="primary" :loading="submitting" @click="handleSubmit"><template #icon><Check /></template>创建</BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { Clock, Close, Check, InfoFilled } from '@element-plus/icons-vue'
import type { CronJobResp } from '@/types'
import { createCronJob } from '@/api'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'

defineOptions({ name: 'CronJobCreate' })
const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)
const formData = ref<Partial<CronJobResp>>({ name: '', namespace: 'default', clusterId: 'default', schedule: '*/5 * * * *', suspend: false })
const formRules = {
  clusterId: [{ required: true, message: '请选择集群', trigger: 'change' }],
  namespace: [{ required: true, message: '请选择命名空间', trigger: 'change' }],
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  schedule: [{ required: true, message: '请输入调度规则', trigger: 'blur' }]
}
function handleCancel() { router.back() }
async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try { await createCronJob(formData.value); ElMessage.success('创建成功'); router.back() } catch {} finally { submitting.value = false }
}
</script>

<style lang="scss" scoped>
.cronjob-create { height: 100%; display: flex; flex-direction: column; }
.page-header { flex-shrink: 0; padding: 16px 20px 0 20px; margin-bottom: 16px; background-color: $bg-page; }
.page-body { flex: 1; min-height: 0; overflow-y: auto; padding: 0 20px; background-color: $bg-page; }
.page-footer { flex-shrink: 0; display: flex; justify-content: space-between; padding: 16px 20px; background-color: $bg-page; }
.create-form { max-width: 800px; padding: 20px 0; }
</style>
