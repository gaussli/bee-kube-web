<template>
  <div class="daemonset-edit">
    <div class="page-header">
      <BeePageHeader description="编辑 DaemonSet 配置。" :icon="Monitor" :title="`编辑守护进程集: ${daemonsetName}`" />
    </div>
    <div class="page-body">
      <el-form ref="formRef" class="edit-form" label-width="140px" :model="formData">
        <el-form-item label="标签">
          <div class="key-value-list">
            <div v-for="(item, index) in labelList" :key="index" class="key-value-item">
              <el-input v-model="item.key" placeholder="键" /><span class="separator">:</span
              ><el-input v-model="item.value" placeholder="值" />
              <el-button circle :icon="Delete" size="small" @click="removeLabel(index)" />
            </div>
            <BeeButton type="primary" @click="addLabel"
              ><template #icon><Plus /></template>添加标签</BeeButton
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="page-footer">
      <BeeButton @click="handleCancel"
        ><template #icon><Close /></template>取消</BeeButton
      >
      <BeeButton :loading="submitting" type="primary" @click="handleSubmit"
        ><template #icon><Check /></template>保存</BeeButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { Monitor, Plus, Delete, Close, Check } from '@element-plus/icons-vue'

import type { DaemonSetResp } from '@/types/kubernetes/workload/types'

import { getDaemonSetDetail, updateDaemonSet } from '@/api/kubernetes/workload/daemonset'

import BeeButton from '@/components/base/BeeButton/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeePageHeader from '@/components/BeePageHeader/index.vue'

defineOptions({ name: 'DaemonSetEdit' })
const route = useRoute()
const router = useRouter()
const clusterUid = ref(route.params.clusterUid as string)
const namespace = ref(route.query.namespace as string)
const daemonsetName = ref(route.query.name as string)
const loading = ref(false)
const submitting = ref(false)
const daemonsetData = ref<DaemonSetResp>()
const labelList = ref<Array<{ key: string; value: string }>>([])
async function loadData() {
  if (!clusterUid.value || !namespace.value || !daemonsetName.value) return
  loading.value = true
  try {
    daemonsetData.value = await getDaemonSetDetail(clusterUid.value, namespace.value, daemonsetName.value)
    if (daemonsetData.value.labels)
      labelList.value = Object.entries(daemonsetData.value.labels).map(([key, value]) => ({ key, value }))
  } finally {
    loading.value = false
  }
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
  const labels: Record<string, string> = {}
  labelList.value.forEach(item => {
    if (item.key) labels[item.key] = item.value
  })
  submitting.value = true
  try {
    await updateDaemonSet(clusterUid.value, namespace.value, daemonsetName.value, { labels })
    BeeMessage.success('保存成功')
    router.back()
  } catch {
    /* 请求失败已由 request 拦截器统一弹窗提示，无需额外处理 */
  } finally {
    submitting.value = false
  }
}
onMounted(() => {
  void loadData()
})
</script>

<style lang="scss" scoped>
.daemonset-edit {
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
