<template>
  <BeeCard class="bee-page-header">
    <div class="bee-page-header__icon">
      <BeeIcon :name="icon" :size="40" />
    </div>
    <div class="bee-page-header__content">
      <span class="bee-page-header__title">{{ title }}</span>
      <span class="bee-page-header__desc">{{ description }}</span>
    </div>
  </BeeCard>
</template>

<script setup lang="ts">
/**
 * 页面标题组件
 * 左侧图标 + 右侧标题和描述的横向布局
 * @module components/BeePageHeader
 */
import BeeCard from '@/components/BeeCard/index.vue'
import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeePageHeader' })

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
.bee-page-header {
  --bee-page-header-icon-size: 64px;

  display: flex;
  gap: $spacing-16;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  padding: 24px $spacing-16;

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--bee-page-header-icon-size);
    height: var(--bee-page-header-icon-size);
    border-radius: 50% 0 50% 50%;
    color: $color-primary;
    background: $color-bg-elevated;
  }

  &__content {
    display: flex;
    gap: $spacing-4;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    color: $color-text-primary;
  }

  &__desc {
    font-size: $font-size-14;
    line-height: 24px;
    color: $color-text-secondary;
  }
}
</style>
