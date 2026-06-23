<template>
  <div class="bee-status">
    <span class="bee-status__dot"></span>
    <div class="bee-status__label">
      <span class="bee-status__label-zh">{{ currentConfig.label }}</span>
      <span v-if="currentConfig.labelEn" class="bee-status__label-en">{{ currentConfig.labelEn }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StatusConfig } from './types'

defineOptions({ name: 'BeeStatus' })

const props = defineProps<{
  status?: string | number
  config: StatusConfig[]
}>()

const currentConfig = computed(() => {
  const found = props.config.find(item => item.value === props.status)
  if (found) return found
  return { label: '未知', color: '#da8030', labelEn: 'unknown' }
})

const currentColor = computed(() => currentConfig.value.color)
</script>

<style lang="scss" scoped>
.bee-status {
  display: inline-flex;
  gap: $spacing-8;
  align-items: center;
  justify-content: center;
  line-height: 1;

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: v-bind(currentColor);
  }

  &__label {
    display: flex;
    gap: $spacing-4;
    flex-direction: column;
    font-weight: 600;
  }

  &__label-en {
    font-size: $font-size-12;
    font-weight: 200;
    color: $color-text-secondary;
  }
}
</style>
