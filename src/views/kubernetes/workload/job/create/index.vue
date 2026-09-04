<template>
  <div class="job-create">
    <div class="page-header">
      <BeePageHeader description="创建一个新的 Kubernetes Job。" :icon="Timer" title="创建任务" />
    </div>
    <div class="page-body">
      <el-form ref="formRef" class="create-form" label-width="140px" :model="formData" :rules="formRules">
        <el-form-item label="所属集群" prop="clusterUid">
          <el-select v-model="formData.clusterUid" placeholder="选择集群" style="width: 300px"
            ><el-option label="默认集群" value="default"
          /></el-select>
        </el-form-item>
        <el-form-item label="命名空间" prop="namespace">
          <el-select v-model="formData.namespace" placeholder="选择命名空间" style="width: 300px"
            ><el-option label="default" value="default"
          /></el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入任务名称" style="width: 300px" />
        </el-form-item>
        <el-form-item label="并行度" prop="parallelism">
          <el-input-number v-model="formData.parallelism" :max="100" :min="1" />
        </el-form-item>
        <el-form-item label="完成数" prop="completions">
          <el-input-number v-model="formData.completions" :max="100" :min="1" />
        </el-form-item>
      </el-form>
    </div>
    <div class="page-footer">
      <BeeButton @click="handleCancel"
        ><template #icon><Close /></template>取消</BeeButton
      >
      <BeeButton :loading="submitting" type="primary" @click="handleSubmit"
        ><template #icon><Check /></template>创建</BeeButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { Timer, Close, Check } from '@element-plus/icons-vue'

import type { FormInstance } from 'element-plus'

import type { JobResp } from '@/types/kubernetes/workload/types'

import { createJob } from '@/api/kubernetes/workload/job'

import BeeButton from '@/components/base/BeeButton/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeePageHeader from '@/components/BeePageHeader/index.vue'

defineOptions({ name: 'JobCreate' })
const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)
const formData = ref<Partial<JobResp>>({
  name: '',
  namespace: 'default',
  clusterUid: 'default',
  parallelism: 1,
  completions: 1,
})
const formRules = {
  clusterUid: [{ required: true, message: '请选择集群', trigger: 'change' }],
  namespace: [{ required: true, message: '请选择命名空间', trigger: 'change' }],
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  parallelism: [{ required: true, message: '请输入并行度', trigger: 'blur' }],
  completions: [{ required: true, message: '请输入完成数', trigger: 'blur' }],
}
function handleCancel() {
  router.back()
}
async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await createJob(formData.value)
    BeeMessage.success('创建成功')
    router.back()
  } catch {
    /* 请求失败已由 request 拦截器统一弹窗提示，无需额外处理 */
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.job-create {
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
  justify-content: space-between;
  flex-shrink: 0;
  padding: 16px 20px;
  background-color: $color-bg-surface;
}

.create-form {
  max-width: 800px;
  padding: 20px 0;
}
</style>
