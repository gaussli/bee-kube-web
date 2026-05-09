<template>
  <div class="bee-page-title">
    <div class="title-icon">
      <BeeIcon :name="icon" :size="38" />
    </div>
    <div class="title-text-wrapper">
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
  --height: 64px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: $spacing-md;
  width: 100%;
  padding: 32px 0;

  .title-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--height);
    height: var(--height);
    color: $color-primary;
    background: $bg-cover;
    border-radius: calc(var(--height) / 2) 0 calc(var(--height) / 2) calc(var(--height) / 2);
  }

  .title-text-wrapper {
    height: var(--height);
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
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
}
</style>
