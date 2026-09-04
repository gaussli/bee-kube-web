<template>
  <svg aria-hidden="true" class="bee-icon" :style="iconStyle">
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
  type: 'basic',
  size: 24,
  color: '',
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

  display: block;
  width: var(--bee-icon-size);
  height: var(--bee-icon-size);
  color: inherit;
  fill: currentcolor;

  &.is-loading {
    animation: bee-icon-rotating 2s linear infinite;
  }
}

@keyframes bee-icon-rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
