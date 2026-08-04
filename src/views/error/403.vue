<template>
  <div class="no-permission">
    <div class="no-permission-content">
      <div class="icon">
        <el-icon><Lock /></el-icon>
      </div>
      <h1 class="title">403</h1>
      <p class="description">抱歉，您没有访问该页面的权限</p>
      <p class="hint">请联系管理员为您分配相应权限</p>
      <div class="actions">
        <BeeButton @click="handleGoHome">返回首页</BeeButton>
        <BeeButton type="primary" @click="handleGoBack">返回上一页</BeeButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { Lock } from '@element-plus/icons-vue'

import BeeButton from '@/components/BeeButton/index.vue'

defineOptions({ name: 'NoPermission' })

const router = useRouter()

function handleGoHome() {
  router.push('/').catch(() => {})
}

function handleGoBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.no-permission {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: $color-bg-surface;

  .no-permission-content {
    text-align: center;

    .icon {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 80px;
      margin-bottom: 24px;
      border-radius: 20px;
      font-size: 40px;
      color: $color-primary;
      background: linear-gradient(135deg, rgba($color-primary, 0.1) 0%, rgba($color-primary, 0.05) 100%);
    }

    .title {
      margin: 0 0 16px;
      font-size: 72px;
      font-weight: 700;
      line-height: 1;
      color: $color-text-primary;
    }

    .description {
      margin: 0 0 8px;
      font-size: 20px;
      color: $color-text-primary;
    }

    .hint {
      margin: 0 0 32px;
      font-size: 14px;
      color: $color-text-secondary;
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
  }
}
</style>
