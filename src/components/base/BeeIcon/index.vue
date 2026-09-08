<template>
  <svg aria-hidden="true" class="bee-icon">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'BeeIcon' })

// ==================== Prop & Emit ====================
const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    color?: string
  }>(),
  {
    size: '1em',
    color: 'inherit',
  },
)

// ==================== Computed ====================
const iconName = computed(() => `#icon-${props.name}`)
const sizeStyle = computed(() => {
  const size = props.size
  if (typeof size === 'number') return `${size}px`
  if (typeof size === 'string' && size.trim() !== '') return size
  return '1em'
})
</script>

<style lang="scss" scoped>
.bee-icon {
  --bee-icon-color: v-bind(color);
  --bee-icon-size: v-bind(sizeStyle);

  display: block;
  flex-shrink: 0;
  width: var(--bee-icon-size);
  height: var(--bee-icon-size);
  color: var(--bee-icon-color);
  fill: currentcolor;
}
</style>
