<template>
  <svg aria-hidden="true" class="bee-icon" :style="iconStyle">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'BeeIcon' })

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
    color?: string
  }>(),
  {
    type: 'basic',
    size: undefined,
    color: undefined,
  },
)

const iconName = computed(() => `#icon-${props.name}`)
const iconStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.size) {
    style['--bee-icon-size'] = `${props.size}px`
  }
  if (props.color) {
    style.color = props.color
  }
  return style
})
</script>

<style lang="scss" scoped>
.bee-icon {
  display: block;
  flex-shrink: 0;
  width: var(--bee-icon-size, 1em);
  height: var(--bee-icon-size, 1em);
  color: inherit;
  fill: currentcolor;
}
</style>
