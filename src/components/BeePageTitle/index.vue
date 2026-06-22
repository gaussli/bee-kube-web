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
  --height: 64px;

  display: flex;
  gap: $spacing-16;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding: 32px 0;

  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--height);
    height: var(--height);
    border-radius: calc(var(--height) / 2) 0 calc(var(--height) / 2) calc(var(--height) / 2);
    color: $color-primary;
    background: $bg-cover;
  }

  .title-content {
    display: flex;
    gap: 4px;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    height: var(--height);

    .title-text {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      line-height: 32px;
      color: $text-primary;
    }

    .title-desc {
      margin: 0;
      font-size: 14px;
      line-height: 22px;
      color: $text-secondary;
    }
  }
}
</style>
