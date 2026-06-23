<template>
  <div class="deployment-edit">
    <!-- 页面标题 -->
    <div class="page-header">
      <BeePageTitle :icon="Document" :title="`编辑无状态应用: ${deploymentName}`" description="编辑 Deployment 的副本数量、标签等配置。" />
    </div>

    <!-- 表单内容 -->
    <div class="page-body">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px" class="edit-form">
        <el-form-item label="副本数量" prop="replicas">
          <el-input-number v-model="formData.replicas" :min="0" :max="100" />
        </el-form-item>

        <el-form-item label="更新策略" prop="strategy">
          <el-radio-group v-model="formData.strategy">
            <el-radio label="RollingUpdate">滚动更新</el-radio>
            <el-radio label="Recreate">重建</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="标签">
          <div class="key-value-list">
            <div v-for="(item, index) in labelList" :key="index" class="key-value-item">
              <el-input v-model="item.key" placeholder="键" />
              <span class="separator">:</span>
              <el-input v-model="item.value" placeholder="值" />
              <el-button circle :icon="Delete" size="small" @click="removeLabel(index)" />
            </div>
            <BeeButton type="primary" @click="addLabel">
              <template #icon><Plus /></template>
              添加标签
            </BeeButton>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 底部操作 -->
    <div class="page-footer">
      <BeeButton @click="handleCancel">
        <template #icon><Close /></template>
        取消
      </BeeButton>
      <BeeButton type="primary" :loading="submitting" @click="handleSubmit">
        <template #icon><Check /></template>
        保存
      </BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { Document, Plus, Delete, Close, Check } from '@element-plus/icons-vue'
import type { DeploymentResp } from '@/types/kubernetes/workload/deployment'
import { getDeploymentDetail, updateDeployment } from '@/api/kubernetes/workload/deployment'
import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'

defineOptions({ name: 'DeploymentEdit' })

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

const clusterId = ref(route.query.clusterId as string)
const namespace = ref(route.query.namespace as string)
const deploymentName = ref(route.query.name as string)
const loading = ref(false)
const submitting = ref(false)

const formData = ref<Partial<DeploymentResp>>({
  replicas: 1,
  strategy: 'RollingUpdate',
  labels: {}
})

const formRules = {
  replicas: [{ required: true, message: '请输入副本数量', trigger: 'blur' }],
  strategy: [{ required: true, message: '请选择更新策略', trigger: 'change' }]
}

const labelList = ref<Array<{ key: string; value: string }>>([])

function addLabel() {
  labelList.value.push({ key: '', value: '' })
}

function removeLabel(index: number) {
  labelList.value.splice(index, 1)
}

async function loadData() {
  if (!clusterId.value || !namespace.value || !deploymentName.value) return
  loading.value = true
  try {
    const data = await getDeploymentDetail(clusterId.value, namespace.value, deploymentName.value)
    formData.value.replicas = data.replicas
    formData.value.strategy = data.strategy
    if (data.labels) {
      labelList.value = Object.entries(data.labels).map(([key, value]) => ({ key, value }))
    }
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  router.back()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  // 转换标签
  const labels: Record<string, string> = {}
  labelList.value.forEach(item => {
    if (item.key) labels[item.key] = item.value
  })

  const data = {
    ...formData.value,
    labels
  }

  submitting.value = true
  try {
    await updateDeployment(clusterId.value, namespace.value, deploymentName.value, data)
    ElMessage.success('保存成功')
    router.back()
  } catch {
    // 失败处理
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.deployment-edit {
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
