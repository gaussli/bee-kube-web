<template>
  <div class="bee-page-title">
    <div class="title-content">
      <div class="title-icon">
        <BeeIcon :icon="icon" :size="40" />
      </div>
      <div class="title-text-wrapper">
        <span class="title-text">{{ title }}</span>
        <span class="title-desc">{{ description }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BeeIcon from '@/components/BeeIcon/index.vue'
import type { Component } from 'vue'

interface Props {
  icon: Component
  title: string
  description: string
}

defineOptions({ name: 'BeePageTitle' })

defineProps<Props>()
</script>

<style lang="scss" scoped>
.bee-page-title {
  width: 100%;
  padding: 32px 0;
  box-sizing: border-box;

  .title-content {
    display: flex;
    align-items: stretch;
    gap: 12px;
  }

  .title-icon {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $bg-hover;
    border-radius: 32px 0 32px 32px;
  }

  .title-text-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    height: 64px;
  }

  .title-text {
    font-size: 24px;
    font-weight: 600;
    color: $text-primary;
    line-height: 32px;
  }

  .title-desc {
    font-size: 14px;
    color: $text-secondary;
    line-height: 22px;
  }

  .title-divider {
    margin-top: 16px;
    margin-bottom: 0;
  }
}
</style>
