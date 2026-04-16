<template>
  <div class="status-cell">
    <span class="dot" :style="{ backgroundColor: currentConfig.color }"></span>
    <span class="label">{{ currentConfig.label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'StatusCell' })

interface StatusConfig {
  value: string | number | undefined
  label: string
  color: string
}

const props = defineProps<{
  status?: string | number
  config: StatusConfig[]
}>()

const currentConfig = computed(() => {
  const found = props.config.find(item => item.value === props.status)
  if (found) return found
  return { label: '-', color: '#909399' }
})
</script>

<style lang="scss" scoped>
.status-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
}
</style>
