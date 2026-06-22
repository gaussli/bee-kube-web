<template>
  <div class="statefulset-create">
    <div class="page-header">
      <BeePageTitle :icon="Collection" title="创建有状态应用" description="创建一个新的 Kubernetes StatefulSet。" />
    </div>
    <div class="page-body">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px" class="create-form">
        <el-form-item label="所属集群" prop="clusterId">
          <el-select v-model="formData.clusterId" placeholder="选择集群" style="width: 300px">
            <el-option label="默认集群" value="default" />
          </el-select>
        </el-form-item>
        <el-form-item label="命名空间" prop="namespace">
          <el-select v-model="formData.namespace" placeholder="选择命名空间" style="width: 300px">
            <el-option label="default" value="default" />
          </el-select>
        </el-form-item>
        <el-form-item label="应用名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入应用名称" style="width: 300px" />
        </el-form-item>
        <el-form-item label="副本数量" prop="replicas">
          <el-input-number v-model="formData.replicas" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="服务名称" prop="serviceName">
          <el-input v-model="formData.serviceName" placeholder="请输入服务名称" style="width: 300px" />
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
import { Collection, Close, Check } from '@element-plus/icons-vue'
import type { StatefulSetResp } from '@/types/kubernetes/workload/statefulset'
import { createStatefulSet } from '@/api/kubernetes/workload/statefulset'
import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'

defineOptions({ name: 'StatefulSetCreate' })
const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)
const formData = ref<Partial<StatefulSetResp>>({
  name: '',
  namespace: 'default',
  clusterId: 'default',
  replicas: 1,
  serviceName: ''
})
const formRules = {
  clusterId: [{ required: true, message: '请选择集群', trigger: 'change' }],
  namespace: [{ required: true, message: '请选择命名空间', trigger: 'change' }],
  name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
  replicas: [{ required: true, message: '请输入副本数量', trigger: 'blur' }],
  serviceName: [{ required: true, message: '请输入服务名称', trigger: 'blur' }]
}
function handleCancel() {
  router.back()
}
async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await createStatefulSet(formData.value)
    ElMessage.success('创建成功')
    router.back()
  } catch {
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.statefulset-create {
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

.create-form {
  max-width: 800px;
  padding: 20px 0;
}
</style>
