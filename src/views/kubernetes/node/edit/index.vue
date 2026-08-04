<template>
  <div class="node-edit">
    <!-- 页面标题 -->
    <div class="page-header">
      <BeePageTitle :icon="Box" :title="`编辑节点: ${nodeName}`" description="编辑节点标签、注解和污点配置。" />
    </div>

    <!-- 表单内容 -->
    <div class="page-body">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" class="edit-form">
        <!-- 标签 -->
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

        <!-- 注解 -->
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

        <!-- 污点 -->
        <el-form-item label="污点">
          <div class="taint-list">
            <div v-for="(item, index) in taintList" :key="index" class="taint-item">
              <el-input v-model="item.key" placeholder="键" />
              <el-input v-model="item.value" placeholder="值" />
              <el-select v-model="item.effect" placeholder="效果">
                <el-option label="NoSchedule" value="NoSchedule" />
                <el-option label="PreferNoSchedule" value="PreferNoSchedule" />
                <el-option label="NoExecute" value="NoExecute" />
              </el-select>
              <el-button circle :icon="Delete" size="small" @click="removeTaint(index)" />
            </div>
            <BeeButton type="primary" @click="addTaint">
              <template #icon><Plus /></template>
              添加污点
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

import { Box, Plus, Delete, Close, Check } from '@element-plus/icons-vue'

import type { NodeListResp, NodeReq } from '@/types/kubernetes/node'

import { getNodeDetail, updateNode } from '@/api/kubernetes/node'

import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'

defineOptions({ name: 'NodeEdit' })

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

const clusterId = ref(route.params.clusterId as string)
const nodeName = ref(route.query.name as string)
const loading = ref(false)
const submitting = ref(false)
const nodeData = ref<NodeListResp>()

const formData = ref<NodeReq>({
  labels: {},
  annotations: {},
  taints: [],
})

const formRules = {}

const labelList = ref<Array<{ key: string; value: string }>>([])
const annotationList = ref<Array<{ key: string; value: string }>>([])
const taintList = ref<Array<{ key: string; value: string; effect: string }>>([])

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

function addTaint() {
  taintList.value.push({ key: '', value: '', effect: 'NoSchedule' })
}

function removeTaint(index: number) {
  taintList.value.splice(index, 1)
}

async function loadData() {
  if (!clusterId.value || !nodeName.value) return
  loading.value = true
  try {
    nodeData.value = await getNodeDetail(clusterId.value, nodeName.value)
    // 初始化标签列表
    if (nodeData.value.labels) {
      labelList.value = Object.entries(nodeData.value.labels).map(([key, value]) => ({ key, value }))
    }
    // 初始化注解列表
    if (nodeData.value.annotations) {
      annotationList.value = Object.entries(nodeData.value.annotations).map(([key, value]) => ({ key, value }))
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

  // 转换污点
  const taints = taintList.value
    .filter(item => item.key)
    .map(item => ({
      key: item.key,
      value: item.value,
      effect: item.effect,
    }))

  const data: NodeReq = {
    labels,
    annotations,
    taints,
  }

  submitting.value = true
  try {
    await updateNode(clusterId.value, nodeName.value, data)
    ElMessage.success('保存成功')
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
.node-edit {
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

.key-value-list,
.taint-list {
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

.taint-item {
  display: flex;
  gap: 8px;
  align-items: center;

  .el-input,
  .el-select {
    flex: 1;
  }
}
</style>
