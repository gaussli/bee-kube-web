<template>
  <div class="namespace-edit">
    <!-- 页面标题 -->
    <div class="page-header">
      <BeePageTitle :icon="FolderOpened" :title="`编辑命名空间: ${namespaceName}`" description="编辑命名空间的标签和注解。" />
    </div>

    <!-- 表单内容 -->
    <div class="page-body">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" class="edit-form">
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
import { FolderOpened, Plus, Delete, Close, Check } from '@element-plus/icons-vue'
import { type NamespaceResp, type NamespaceEditReq } from '@/types'
import { getNamespaceDetail, updateNamespace } from '@/api'
import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'

defineOptions({ name: 'NamespaceEdit' })

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

const clusterId = ref(route.query.clusterId as string)
const namespaceName = ref(route.query.name as string)
const loading = ref(false)
const submitting = ref(false)
const namespaceData = ref<NamespaceResp>()

const formData = ref<NamespaceEditReq>({
  labels: {},
  annotations: {}
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
  if (!clusterId.value || !namespaceName.value) return
  loading.value = true
  try {
    namespaceData.value = await getNamespaceDetail(clusterId.value, namespaceName.value)
    // 初始化标签列表
    if (namespaceData.value.labels) {
      labelList.value = Object.entries(namespaceData.value.labels).map(([key, value]) => ({ key, value }))
    }
    // 初始化注解列表
    if (namespaceData.value.annotations) {
      annotationList.value = Object.entries(namespaceData.value.annotations).map(([key, value]) => ({ key, value }))
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

  const data: NamespaceEditReq = {
    labels,
    annotations
  }

  submitting.value = true
  try {
    await updateNamespace(clusterId.value, namespaceName.value, data)
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
.namespace-edit {
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
    color: $text-secondary;
  }
}
</style>
