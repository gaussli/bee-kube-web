<template>
  <span class="bee-icon-label">
    <BeeIcon class="bee-icon-label__icon" :name="icon" :size="14" />
    <span class="bee-icon-label__label">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import BeeIcon from '@/components/BeeIcon/index.vue'
defineOptions({ name: 'BeeIconLabel' })

defineProps<{
  icon: string
  label: string
}>()
</script>

<style lang="scss" scoped>
.bee-icon-label {
  display: inline-flex;
  gap: $spacing-xs;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: $text-secondary;
}
</style>
