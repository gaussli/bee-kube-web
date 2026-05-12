<template>
  <span class="bee-icon-label">
    <BeeIcon :name="icon" :size="14" />
    <span>{{ label }}</span>
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
  gap: 6px;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: $text-secondary;
}
</style>
