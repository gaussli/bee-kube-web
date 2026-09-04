<template>
  <div class="namespace-edit">
    <!-- 页面标题 -->
    <div class="page-header">
      <BeePageHeader
        description="编辑命名空间的标签和注解。"
        :icon="FolderOpened"
        :title="`编辑命名空间: ${namespaceName}`"
      />
    </div>

    <!-- 表单内容 -->
    <div class="page-body">
      <el-form ref="formRef" class="edit-form" label-width="120px" :model="formData" :rules="formRules">
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
        保存
      </BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { FolderOpened, Plus, Delete, Close, Check } from '@element-plus/icons-vue'

import type { FormInstance } from 'element-plus'

import type { NamespaceDetailVo, NamespaceUpdateForm } from '@/types/kubernetes/namespace'

import { getNamespaceDetail, updateNamespace } from '@/api/kubernetes/namespace/namespace'

import BeeButton from '@/components/base/BeeButton/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeePageHeader from '@/components/BeePageHeader/index.vue'

defineOptions({ name: 'NamespaceEdit' })

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

const clusterUid = ref(route.params.clusterUid as string)
const namespaceName = ref(route.params.name as string)
const loading = ref(false)
const submitting = ref(false)
const namespaceData = ref<NamespaceDetailVo>()

const formData = ref<NamespaceUpdateForm>({
  labels: {},
  annotations: {},
})

const formRules = {}

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

async function loadData() {
  if (!clusterUid.value || !namespaceName.value) return
  loading.value = true
  try {
    namespaceData.value = await getNamespaceDetail(clusterUid.value, namespaceName.value)
    // 初始化标签列表
    if (namespaceData.value.metadata.labels) {
      labelList.value = Object.entries(namespaceData.value.metadata.labels).map(([key, value]) => ({ key, value }))
    }
    // 初始化注解列表
    if (namespaceData.value.metadata.annotations) {
      annotationList.value = Object.entries(namespaceData.value.metadata.annotations).map(([key, value]) => ({
        key,
        value,
      }))
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

  // 转换标签和注解
  const labels: Record<string, string> = {}
  labelList.value.forEach(item => {
    if (item.key) labels[item.key] = item.value
  })

  const annotations: Record<string, string> = {}
  annotationList.value.forEach(item => {
    if (item.key) annotations[item.key] = item.value
  })

  const data: NamespaceUpdateForm = {
    labels,
    annotations,
  }

  submitting.value = true
  try {
    await updateNamespace(clusterUid.value, namespaceName.value, data)
    BeeMessage.success('保存成功')
    router.back()
  } catch {
    // 失败处理
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  void loadData()
})
</script>

<style lang="scss" scoped>
.namespace-edit {
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
