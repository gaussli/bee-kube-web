<template>
  <div class="bee-status" :style="{ '--bee-status-color': currentConfig.color }">
    <span class="bee-status__dot"></span>
    <span class="bee-status__label">{{ currentConfig.label }}</span>
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
  return { label: '-', color: '#da8030' }
})
</script>

<style lang="scss" scoped>
.bee-status {
  --bee-status-color: #da8030;

  display: inline-flex;
  gap: $spacing-sm;
  align-items: center;
  justify-content: center;

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--bee-status-color);
  }

  &__label {
    font-size: $font-size-base;
  }
}
</style>
