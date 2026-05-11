<template>
  <svg class="bee-icon" :style="iconStyle" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  size?: number | string
  color?: string
}

defineOptions({ name: 'BeeIcon' })

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: ''
})

const iconName = computed(() => `#icon-${props.name}`)
const iconStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.size) {
    style['--bee-icon-size'] = typeof props.size === 'number' ? `${props.size}px` : props.size
  }
  if (props.color) {
    style.color = props.color
  }
  return style
})
</script>

<style lang="scss" scoped>
.bee-icon {
  --bee-icon-size: 24px;

  width: var(--bee-icon-size);
  height: var(--bee-icon-size);
  color: inherit;
  fill: currentcolor;
}
</style>
