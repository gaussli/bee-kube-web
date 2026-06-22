<template>
  <div class="deployment-create">
    <!-- 页面标题 -->
    <div class="page-header">
      <BeePageTitle :icon="Document" title="创建无状态应用" description="创建一个新的 Kubernetes Deployment。" />
    </div>

    <!-- 表单内容 -->
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

        <el-form-item label="更新策略" prop="strategy">
          <el-radio-group v-model="formData.strategy">
            <el-radio label="RollingUpdate">滚动更新</el-radio>
            <el-radio label="Recreate">重建</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="标签选择器">
          <div class="key-value-list">
            <div v-for="(item, index) in selectorList" :key="index" class="key-value-item">
              <el-input v-model="item.key" placeholder="键" />
              <span class="separator">:</span>
              <el-input v-model="item.value" placeholder="值" />
              <el-button circle :icon="Delete" size="small" @click="removeSelector(index)" />
            </div>
            <BeeButton type="primary" @click="addSelector">
              <template #icon><Plus /></template>
              添加选择器
            </BeeButton>
          </div>
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
        创建
      </BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { Document, Plus, Delete, Close, Check } from '@element-plus/icons-vue'
import type { DeploymentResp } from '@/types/kubernetes/workload/deployment'
import { createDeployment } from '@/api/kubernetes/workload/deployment'
import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'

defineOptions({ name: 'DeploymentCreate' })

const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)

const formData = ref<Partial<DeploymentResp>>({
  name: '',
  namespace: 'default',
  clusterId: 'default',
  replicas: 1,
  strategy: 'RollingUpdate',
  selector: {},
  labels: {}
})

const formRules = {
  clusterId: [{ required: true, message: '请选择集群', trigger: 'change' }],
  namespace: [{ required: true, message: '请选择命名空间', trigger: 'change' }],
  name: [
    { required: true, message: '请输入应用名称', trigger: 'blur' },
    { pattern: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/, message: '名称只能包含小写字母、数字和连字符', trigger: 'blur' }
  ],
  replicas: [{ required: true, message: '请输入副本数量', trigger: 'blur' }],
  strategy: [{ required: true, message: '请选择更新策略', trigger: 'change' }]
}

const selectorList = ref<Array<{ key: string; value: string }>>([])
const labelList = ref<Array<{ key: string; value: string }>>([])

function addSelector() {
  selectorList.value.push({ key: '', value: '' })
}

function removeSelector(index: number) {
  selectorList.value.splice(index, 1)
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

  // 转换选择器
  const selector: Record<string, string> = {}
  selectorList.value.forEach(item => {
    if (item.key) selector[item.key] = item.value
  })

  // 转换标签
  const labels: Record<string, string> = {}
  labelList.value.forEach(item => {
    if (item.key) labels[item.key] = item.value
  })

  const data = {
    ...formData.value,
    selector,
    labels
  }

  submitting.value = true
  try {
    await createDeployment(data)
    ElMessage.success('创建成功')
    router.back()
  } catch {
    // 失败处理
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.deployment-create {
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
