<template>
  <div class="menu-create">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton :border="false" @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">创建菜单</span>
    </div>

    <!-- 表单主体 -->
    <transition name="fade-slide" mode="out-in">
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
import { ElMessage } from 'element-plus'
import { ArrowLeft, Check, Close } from '@element-plus/icons-vue'
import { createMenu } from '@/api'
import BeeButton from '@/components/BeeButton/index.vue'
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
    ElMessage.success('创建成功')
    router.push({ name: 'platform:system:menu' })
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

// 渐入渐出动画
.fade-slide-enter-active {
  animation: fade-slide-in 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fade-slide-out 0.2s ease-in;
}
</style>
