<template>
  <div class="cluster-create">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton :border="false" @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">创建集群</span>
    </div>

    <!-- 表单主体 -->
    <transition name="fade-slide" mode="out-in">
      <div class="form-body">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入集群名称" />
          </el-form-item>
          <el-form-item label="API Server" prop="apiServer">
            <el-input v-model="formData.apiServer" placeholder="请输入 Kubernetes API Server 地址" />
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
      <BeeButton type="primary" @click="handleCreate">
        <template #icon><Check /></template>
        创建
      </BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Check, Close } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'

defineOptions({ name: 'ClusterCreate' })

const router = useRouter()
const formRef = ref()
const formData = ref({
  name: '',
  apiServer: '',
  description: ''
})
const rules = {
  name: [{ required: true, message: '请输入集群名称', trigger: 'blur' }],
  apiServer: [{ required: true, message: '请输入 API Server 地址', trigger: 'blur' }]
}

function handleBack() {
  router.back()
}

async function handleCreate() {
  try {
    await formRef.value?.validate()
    // TODO: 调用创建集群 API
    router.push({ name: 'kubernetes:cluster' })
  } catch {
    // 验证失败
  }
}
</script>

<style lang="scss" scoped>
.cluster-create {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $bg-page;
}

.form-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  border-bottom: 1px solid rgba($text-secondary, 0.1);

  .header-title {
    font-weight: 600;
    color: $text-secondary;
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
  border-top: 1px solid rgba($text-secondary, 0.1);
}

.fade-slide-enter-active {
  animation: fade-slide-in 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fade-slide-out 0.2s ease-in;
}
</style>
