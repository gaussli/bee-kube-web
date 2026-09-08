<template>
  <span class="bee-icon-label">
    <BeeIcon v-if="icon" class="bee-icon-label__icon" :name="icon" />
    <span class="bee-icon-label__label">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import BeeIcon from '@/components/base/BeeIcon/index.vue'

defineOptions({ name: 'BeeIconLabel' })

// ==================== Prop & Emit ====================
withDefaults(
  defineProps<{
    icon?: string
    label: string
    color?: string
    fontSize?: string
    fontWeight?: number | string
  }>(),
  {
    icon: undefined,
    color: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
  },
)
</script>

<style lang="scss" scoped>
.bee-icon-label {
  --bee-icon-label-color: v-bind(color);
  --bee-icon-label-font-size: v-bind(fontSize);
  --bee-icon-label-font-weight: v-bind(fontWeight);

  display: inline-flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
  font-size: var(--bee-icon-label-font-size);
  font-weight: var(--bee-icon-label-font-weight);
  color: var(--bee-icon-label-color);

  .bee-icon-label__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
