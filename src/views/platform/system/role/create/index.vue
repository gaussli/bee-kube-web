<template>
  <div class="role-create">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">创建角色</span>
    </div>

    <!-- 表单主体 -->
    <transition name="fade-slide" mode="out-in">
      <div class="form-body">
        <RoleForm ref="roleFormRef" />
      </div>
    </transition>

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

import { createRole } from '@/api/platform/role'

import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import RoleForm from '@/components/RoleForm/index.vue'

defineOptions({ name: 'RoleCreate' })

const router = useRouter()
const roleFormRef = ref<InstanceType<typeof RoleForm>>()

function handleBack() {
  router.back()
}

async function handleCreate() {
  try {
    await roleFormRef.value?.validate()
    const formData = roleFormRef.value?.getFormData()
    await createRole(formData!)
    ElMessage.success('创建成功')
    router.push({ name: 'platform:system:role' }).catch(() => {})
  } catch {
    // 验证失败
  }
}
</script>

<style lang="scss" scoped>
.role-create {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $color-bg-surface;
}

.form-header {
  display: flex;
  align-items: center;
  flex-shrink: 0;
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
  overflow-y: auto;
  animation: fade-slide-in 0.3s ease-out;
}

.form-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  padding: 16px 20px;
  border-top: 1px solid rgba($color-text-secondary, 0.1);
}

// 渐入渐出动画
.fade-slide-enter-active {
  animation: fade-slide-in 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fade-slide-out 0.2s ease-in;
}
</style>
