<template>
  <div class="bee-page-title">
    <div class="title-icon">
      <BeeIcon :name="icon" :size="38" />
    </div>
    <div class="title-content">
      <span class="title-text">{{ title }}</span>
      <span class="title-desc">{{ description }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import BeeIcon from '@/components/BeeIcon/index.vue'

interface Props {
  icon: string
  title: string
  description: string
}

defineOptions({ name: 'BeePageTitle' })

defineProps<Props>()
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
  padding: 32px 0;

  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--bee-page-title-icon-size);
    height: var(--bee-page-title-icon-size);
    border-radius: 50% 0 50% 50%;
    color: $color-primary;
    background: $color-bg-elevated;
  }

  .title-content {
    display: flex;
    gap: $spacing-4;
    flex-direction: column;
    flex: 1;
    justify-content: center;

    .title-text {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      line-height: 32px;
      color: $color-text-primary;
    }

    .title-desc {
      margin: 0;
      font-size: $font-size-14;
      line-height: 22px;
      color: $color-text-secondary;
    }
  }
}
</style>
