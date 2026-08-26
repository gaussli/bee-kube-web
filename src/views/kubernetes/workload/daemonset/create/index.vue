<template>
  <div class="daemonset-create">
    <div class="page-header">
      <BeePageHeader description="创建一个新的 Kubernetes DaemonSet。" :icon="Monitor" title="创建守护进程集" />
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
        <el-form-item label="应用名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入应用名称" style="width: 300px" />
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

import { Monitor, Close, Check } from '@element-plus/icons-vue'

import type { FormInstance } from 'element-plus'

import type { DaemonSetResp } from '@/types/kubernetes/workload/types'

import { createDaemonSet } from '@/api/kubernetes/workload/daemonset'

import BeeButton from '@/components/BeeButton/index.vue'
import { BeeMessage } from '@/components/BeeMessage'
import BeePageHeader from '@/components/BeePageHeader/index.vue'

defineOptions({ name: 'DaemonSetCreate' })
const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)
const formData = ref<Partial<DaemonSetResp>>({ name: '', namespace: 'default', clusterUid: 'default' })
const formRules = {
  clusterUid: [{ required: true, message: '请选择集群', trigger: 'change' }],
  namespace: [{ required: true, message: '请选择命名空间', trigger: 'change' }],
  name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
}
function handleCancel() {
  router.back()
}
async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await createDaemonSet(formData.value)
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
.daemonset-create {
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
