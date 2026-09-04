<template>
  <div class="namespace-create">
    <!-- 页面标题 -->
    <div class="page-header">
      <BeePageHeader description="创建一个新的 Kubernetes 命名空间。" :icon="FolderOpened" title="创建命名空间" />
    </div>

    <!-- 表单内容 -->
    <div class="page-body">
      <el-form ref="formRef" class="create-form" label-width="120px" :model="formData" :rules="formRules">
        <el-form-item label="所属集群" prop="clusterUid">
          <el-select v-model="formData.clusterUid" placeholder="选择集群" style="width: 300px">
            <el-option label="默认集群" value="default" />
          </el-select>
        </el-form-item>

        <el-form-item label="命名空间名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入命名空间名称" style="width: 300px" />
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

        <el-form-item label="注解">
          <div class="key-value-list">
            <div v-for="(item, index) in annotationList" :key="index" class="key-value-item">
              <el-input v-model="item.key" placeholder="键" />
              <span class="separator">:</span>
              <el-input v-model="item.value" placeholder="值" />
              <el-button circle :icon="Delete" size="small" @click="removeAnnotation(index)" />
            </div>
            <BeeButton type="primary" @click="addAnnotation">
              <template #icon><Plus /></template>
              添加注解
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
      <BeeButton :loading="submitting" type="primary" @click="handleSubmit">
        <template #icon><Check /></template>
        创建
      </BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { FolderOpened, Plus, Delete, Close, Check } from '@element-plus/icons-vue'

import type { FormInstance } from 'element-plus'

import type { NamespaceReq } from '@/types/index'

import { createNamespace } from '@/api/kubernetes/namespace/namespace'

import BeeButton from '@/components/base/BeeButton/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeePageHeader from '@/components/BeePageHeader/index.vue'

defineOptions({ name: 'NamespaceCreate' })

const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)

const formData = ref<NamespaceReq>({
  name: '',
  clusterUid: 'default',
  labels: {},
  annotations: {},
})

const formRules = {
  clusterUid: [{ required: true, message: '请选择集群', trigger: 'change' }],
  name: [
    { required: true, message: '请输入命名空间名称', trigger: 'blur' },
    { pattern: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/, message: '名称只能包含小写字母、数字和连字符', trigger: 'blur' },
  ],
}

const labelList = ref<Array<{ key: string; value: string }>>([])
const annotationList = ref<Array<{ key: string; value: string }>>([])

function addLabel() {
  labelList.value.push({ key: '', value: '' })
}

function removeLabel(index: number) {
  labelList.value.splice(index, 1)
}

function addAnnotation() {
  annotationList.value.push({ key: '', value: '' })
}

function removeAnnotation(index: number) {
  annotationList.value.splice(index, 1)
}

function handleCancel() {
  router.back()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  // 转换标签和注解
  const labels: Record<string, string> = {}
  labelList.value.forEach(item => {
    if (item.key) labels[item.key] = item.value
  })

  const annotations: Record<string, string> = {}
  annotationList.value.forEach(item => {
    if (item.key) annotations[item.key] = item.value
  })

  const data: NamespaceReq = {
    ...formData.value,
    labels,
    annotations,
  }

  submitting.value = true
  try {
    await createNamespace(data)
    BeeMessage.success('创建成功')
    router.back()
  } catch {
    // 失败处理
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.namespace-create {
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
