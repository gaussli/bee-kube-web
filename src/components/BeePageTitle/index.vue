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
    border-radius: calc(var(--height) / 2) 0 calc(var(--height) / 2) calc(var(--height) / 2);
    color: $color-primary;
    background: $bg-cover;
  }

  .title-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    gap: 4px;
    height: var(--height);

    .title-text {
      margin: 0;
      color: $text-primary;
      font-size: 24px;
      font-weight: 600;
      line-height: 32px;
    }

    .title-desc {
      margin: 0;
      color: $text-secondary;
      font-size: 14px;
      line-height: 22px;
    }
  }
}
</style>
