<template>
  <div class="user-create">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton :border="false" @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
    </div>

    <!-- 表单主体 -->
    <div class="form-body">
      <UserForm ref="userFormRef" />
    </div>

    <!-- 表单底部 -->
    <div class="form-footer">
      <BeeButton type="danger" @click="handleBack">
        <template #icon><Close /></template>
        取消
      </BeeButton>
      <BeeButton type="primary" @click="handleCreate">
        <template #icon><Check /></template>
        新增
      </BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Close, Check } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'
import UserForm from '@/components/UserForm/index.vue'

defineOptions({ name: 'UserCreate' })

const router = useRouter()
const userFormRef = ref<InstanceType<typeof UserForm>>()

function handleBack() {
  router.back()
}

async function handleCreate() {
  try {
    await userFormRef.value?.validate()
    // TODO: 调用创建 API
    ElMessage.success('创建成功')
    router.push('/system/user')
  } catch {
    // 验证失败
  }
}
</script>

<style lang="scss" scoped>
.user-create {
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
}

.form-body {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.form-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-top: 1px solid rgba($text-secondary, 0.1);
}
</style>
