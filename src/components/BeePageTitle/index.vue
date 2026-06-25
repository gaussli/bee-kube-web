<template>
  <div class="bee-page-title">
    <div class="bee-page-title__icon">
      <BeeIcon :name="icon" :size="40" />
    </div>
    <div class="bee-page-title__content">
      <span class="bee-page-title__text">{{ title }}</span>
      <span class="bee-page-title__desc">{{ description }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 页面标题组件
 * 左侧图标 + 右侧标题和描述的横向布局
 * @module components/BeePageTitle
 */
import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeePageTitle' })

defineProps<{
  /** 图标名称 */
  icon: string
  /** 页面标题 */
  title: string
  /** 页面描述 */
  description: string
}>()
</script>

<style lang="scss" scoped>
.bee-page-title {
  --bee-page-title-icon-size: 64px;

  display: flex;
  gap: $spacing-16;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  padding: 24px 0;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--bee-page-title-icon-size);
    height: var(--bee-page-title-icon-size);
    border-radius: 50% 0 50% 50%;
    color: $color-primary;
    background: $color-bg-elevated;
  }

  &__content {
    display: flex;
    gap: $spacing-4;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    min-width: 0;
  }

  &__text {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    color: $color-text-primary;
  }

  &__desc {
    font-size: $font-size-14;
    line-height: 22px;
    color: $color-text-secondary;
  }
}
</style>
