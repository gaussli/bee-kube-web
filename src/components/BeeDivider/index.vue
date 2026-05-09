<template>
  <div class="bee-divider" :class="[`bee-divider--${direction}`]" :style="dividerStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'BeeDivider' })

const props = withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical'
    color?: string
    thickness?: number
    length?: number | string
    margin?: number | string
  }>(),
  {
    direction: 'horizontal',
    color: undefined,
    thickness: 1,
    length: 100,
    margin: 0
  }
)

const dividerStyle = computed(() => {
  const heightValue = typeof props.length === 'number' ? `${props.margin}%` : props.length
  const marginValue = typeof props.margin === 'number' ? `${props.margin}px` : props.margin
  return {
    '--divider-color': props.color,
    '--divider-thickness': `${props.thickness}px`,
    '--divider-length': heightValue,
    '--divider-margin': marginValue
  }
})
</script>

<style lang="scss" scoped>
.bee-divider {
  --divider-color: #{$bee-secondary};
  background-color: var(--divider-color);

  &--horizontal {
    width: var(--divider-length);
    height: var(--divider-thickness);
    margin: var(--divider-margin) 0;
  }

  &--vertical {
    width: var(--divider-thickness);
    height: var(--divider-length);
    margin: 0 var(--divider-margin);
  }
}
</style>
