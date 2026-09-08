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
import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'

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
  display: flex;
  gap: 16px;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 24px 16px;

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    border-radius: 50% 0 50% 50%;
    color: $color-primary;
    background: $color-bg-third;
  }

  &__content {
    display: flex;
    gap: 12px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
    height: 100%;
    min-width: 0;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
    color: $color-text-primary;
  }

  &__desc {
    font-size: 14px;
    color: $color-text-third;
  }
}
</style>
