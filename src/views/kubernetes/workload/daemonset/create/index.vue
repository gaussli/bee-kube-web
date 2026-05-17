<template>
  <div class="daemonset-create">
    <div class="page-header">
      <BeePageTitle :icon="Monitor" title="创建守护进程" description="创建一个新的 Kubernetes DaemonSet。" />
    </div>
    <div class="page-body">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px" class="create-form">
        <el-form-item label="所属集群" prop="clusterId">
          <el-select v-model="formData.clusterId" placeholder="选择集群" style="width: 300px"><el-option label="默认集群" value="default" /></el-select>
        </el-form-item>
        <el-form-item label="命名空间" prop="namespace">
          <el-select v-model="formData.namespace" placeholder="选择命名空间" style="width: 300px"><el-option label="default" value="default" /></el-select>
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
      <BeeButton type="primary" :loading="submitting" @click="handleSubmit"
        ><template #icon><Check /></template>创建</BeeButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { Monitor, Close, Check } from '@element-plus/icons-vue'
import type { DaemonSetResp } from '@/types/kubernetes/workload/daemonset'
import { createDaemonSet } from '@/api/kubernetes/workload/daemonset'
import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'

defineOptions({ name: 'DaemonSetCreate' })
const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)
const formData = ref<Partial<DaemonSetResp>>({ name: '', namespace: 'default', clusterId: 'default' })
const formRules = {
  clusterId: [{ required: true, message: '请选择集群', trigger: 'change' }],
  namespace: [{ required: true, message: '请选择命名空间', trigger: 'change' }],
  name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }]
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
    ElMessage.success('创建成功')
    router.back()
  } catch {
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

.create-form {
  max-width: 800px;
  padding: 20px 0;
}
</style>
