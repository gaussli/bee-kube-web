<template>
  <div class="menu-create">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">创建菜单</span>
    </div>

    <!-- 表单主体 -->
    <transition mode="out-in" name="fade-slide">
      <div class="form-body">
        <MenuForm ref="menuFormRef" />
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
        新增
      </BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { ArrowLeft, Check, Close } from '@element-plus/icons-vue'

import { createMenu } from '@/api/platform/menu'

import BeeButton from '@/components/base/BeeButton/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeeDivider from '@/components/BeeDivider/index.vue'
import MenuForm from '@/components/MenuForm/index.vue'

defineOptions({ name: 'MenuCreate' })

const router = useRouter()
const menuFormRef = ref<InstanceType<typeof MenuForm>>()

function handleBack() {
  router.back()
}

async function handleCreate() {
  try {
    await menuFormRef.value?.validate()
    const formData = menuFormRef.value?.getFormData()
    await createMenu(formData!)
    BeeMessage.success('创建成功')
    router.push({ name: 'platform:system:menu' }).catch(() => {})
  } catch {
    // 验证失败
  }
}
</script>

<style lang="scss" scoped>
.menu-create {
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
