<template>
  <span class="bee-icon-label">
    <BeeIcon v-if="icon" class="bee-icon-label__icon" :name="icon" :size="14" />
    <span class="bee-icon-label__label">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import BeeIcon from '@/components/base/BeeIcon/index.vue'

defineOptions({ name: 'BeeIconLabel' })

withDefaults(
  defineProps<{
    icon?: string
    label: string
    size?: string
    color?: string
    fontWeight?: number | string
  }>(),
  {
    icon: '',
    size: 'inherit',
    color: 'inherit',
    fontWeight: 'inherit',
  },
)
</script>

<style lang="scss" scoped>
.bee-icon-label {
  display: inline-flex;
  gap: $spacing-4;
  justify-content: center;
  align-items: center;
  font-size: v-bind(size);
  font-weight: v-bind(fontWeight);
  color: v-bind(color);

  .bee-icon-label__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
