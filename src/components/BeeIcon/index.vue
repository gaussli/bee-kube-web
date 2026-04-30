<template>
  <el-icon class="bee-icon" :style="iconStyle">
    <component :is="icon" />
  </el-icon>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

interface Props {
  icon: Component
  size?: number | string
  color?: string
}

defineOptions({ name: 'BeeIcon' })

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: ''
})

const iconStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.size) {
    style['--bee-icon-size'] = typeof props.size === 'number' ? `${props.size}px` : props.size
  }
  if (props.color) {
    style['--bee-icon-color'] = props.color
  }
  return style
})
</script>

<style lang="scss" scoped>
.bee-icon {
  --bee-icon-size: 24px;
  --bee-icon-color: inherit;

  width: var(--bee-icon-size);
  height: var(--bee-icon-size);
  color: var(--bee-icon-color);

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}
</style>
