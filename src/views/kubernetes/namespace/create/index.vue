<template>
  <div class="namespace-create">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton :border="false" @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">创建命名空间</span>
    </div>

    <!-- 表单主体 -->
    <transition name="fade-slide" mode="out-in">
      <div class="form-body">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入命名空间名称" />
          </el-form-item>
          <el-form-item label="标签" prop="labels">
            <BeeKeyValueEditor v-model="formData.labels" placeholder="请输入标签" />
          </el-form-item>
          <el-form-item label="注释" prop="annotations">
            <BeeKeyValueEditor v-model="formData.annotations" placeholder="请输入注释" />
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
import BeeKeyValueEditor from '@/components/BeeKeyValueEditor/index.vue'

defineOptions({ name: 'NamespaceCreate' })

const router = useRouter()
const formRef = ref()
const formData = ref({
  name: '',
  labels: {},
  annotations: {}
})
const rules = {
  name: [{ required: true, message: '请输入命名空间名称', trigger: 'blur' }]
}

function handleBack() {
  router.back()
}

async function handleCreate() {
  try {
    await formRef.value?.validate()
    // TODO: 调用创建命名空间 API
    // await createNamespace(formData.value)
    router.push({ name: 'kubernetes:namespace' })
  } catch {
    // 验证失败
  }
}
</script>

<style lang="scss" scoped>
.namespace-create {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $bg-page;
}

.form-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  border-bottom: 1px solid rgba($text-secondary, 0.1);

  .header-title {
    color: $text-secondary;
    font-weight: 600;
  }
}

.form-body {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 20px;
  animation: fadeSlideIn 0.3s ease-out;
}

.form-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid rgba($text-secondary, 0.1);
}

.fade-slide-enter-active {
  animation: fadeSlideIn 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fadeSlideOut 0.2s ease-in;
}
</style>
