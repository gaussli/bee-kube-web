<template>
  <div class="cluster-edit">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">编辑集群</span>
    </div>

    <!-- 表单主体 -->
    <transition name="fade-slide" mode="out-in">
      <div v-if="loaded" class="form-body">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="formData.name" disabled />
          </el-form-item>
          <el-form-item label="API Server">
            <el-input v-model="formData.apiServer" disabled />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="formData.description" type="textarea" placeholder="请输入描述" />
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <!-- 表单底部 -->
    <div class="form-footer">
      <BeeButton @click="handleBack">
        <template #icon><Close /></template>
        取消
      </BeeButton>
      <BeeButton type="primary" @click="handleUpdate">
        <template #icon><Check /></template>
        保存
      </BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'

import { ArrowLeft, Check, Close } from '@element-plus/icons-vue'

import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'

defineOptions({ name: 'ClusterEdit' })

const router = useRouter()
const formRef = ref()
const loaded = ref(false)

const formData = ref({
  name: '',
  apiServer: '',
  description: '',
})
const rules = {}

async function loadData() {
  try {
    // TODO: 调用获取集群详情 API
    // const data = await getClusterDetail(clusterId)
  } finally {
    loaded.value = true
  }
}

function handleBack() {
  router.back()
}

async function handleUpdate() {
  try {
    await formRef.value?.validate()
    // TODO: 调用更新集群 API
    router.push({ name: 'kubernetes:cluster' }).catch(() => {})
  } catch {
    // 验证失败
  }
}

onMounted(() => {
  void loadData()
})
</script>

<style lang="scss" scoped>
.cluster-edit {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $color-bg-surface;
}

.form-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  border-bottom: 1px solid rgba($color-text-secondary, 0.1);

  .header-title {
    font-weight: 600;
    color: $color-text-secondary;
  }
}

.form-body {
  flex: 1;
  min-height: 0;
  padding: 20px;
  overflow-y: auto;
  animation: fade-slide-in 0.3s ease-out;
}

.form-footer {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid rgba($color-text-secondary, 0.1);
}

.fade-slide-enter-active {
  animation: fade-slide-in 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fade-slide-out 0.2s ease-in;
}
</style>
