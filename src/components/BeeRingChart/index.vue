<template>
  <div class="bee-ring-chart">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <!-- 背景圆环 -->
      <circle :cx="center" :cy="center" :r="radius" fill="none" :stroke="bgColor" :stroke-width="strokeWidth" />
      <!-- 数据圆环 -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        class="ring-progress"
        :style="ringStyle"
      />
    </svg>
    <div class="ring-center">
      <span class="ring-value">{{ percentage }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { COLOR_GRAY_50, COLOR_PRIMARY } from '@/config/color'

defineOptions({ name: 'BeeRingChart' })

const props = withDefaults(
  defineProps<{
    percentage: number
    size?: number
    strokeWidth?: number
    color?: string
    bgColor?: string
    showAnimation?: boolean
  }>(),
  {
    size: 60,
    strokeWidth: 4,
    color: COLOR_PRIMARY,
    bgColor: COLOR_GRAY_50,
    showAnimation: true,
  },
)

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const dashOffset = computed(() => {
  const progress = Math.min(Math.max(props.percentage, 0), 100) / 100
  return circumference.value * (1 - progress)
})

const ringStyle = computed(() => {
  if (!props.showAnimation) {
    return { transition: 'none' }
  }
  return { transition: 'stroke-dashoffset 1s ease-out' }
})
</script>

<style lang="scss" scoped>
.bee-ring-chart {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    transform: rotate(-90deg);
  }

  .ring-progress {
    transform-origin: center;
  }

  .ring-center {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);

    .ring-value {
      font-size: 12px;
      font-weight: 600;
      color: $color-text-tertiary;
    }
  }
}
</style>
