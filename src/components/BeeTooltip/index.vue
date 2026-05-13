<template>
  <div ref="triggerRef" class="bee-tooltip-trigger" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <slot />
  </div>
  <Teleport to="body">
    <Transition name="bee-tooltip">
      <div v-if="visible" ref="floatingRef" class="bee-tooltip" role="tooltip" :style="floatingStyles" :data-popper-placement="dataPlacement">
        <slot name="label">{{ label }}</slot>
        <div ref="arrowRef" class="bee-tooltip__arrow" :style="arrowStyle" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { arrow, flip, offset, shift, useFloating } from '@floating-ui/vue'

defineOptions({ name: 'BeeTooltip' })

const props = withDefaults(
  defineProps<{
    label?: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    label: '',
    placement: 'top'
  }
)

const triggerRef = ref<HTMLElement>()
const floatingRef = ref<HTMLElement>()
const arrowRef = ref<HTMLElement>()
const visible = ref(false)

let hideTimeout: ReturnType<typeof setTimeout> | null = null

const { floatingStyles, middlewareData, placement } = useFloating(triggerRef, floatingRef, {
  placement: props.placement,
  middleware: [offset(12), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })]
})

// 实际的 placement（考虑 flip 后的变化）
const dataPlacement = computed(() => placement.value)

// 箭头样式
const arrowStyle = computed(() => {
  const arrowData = middlewareData.value.arrow
  if (!arrowData) return {}

  const { x, y } = arrowData
  console.log(arrowData)
  console.log(middlewareData.value)
  const staticSideMap: Record<string, string> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right'
  }
  const side = placement.value.split('-')[0]
  const staticSide = staticSideMap[side] || 'bottom'

  const style: Record<string, string> = {
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : ''
  }
  style[staticSide] = '-4px'
  return style
})

function show() {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  visible.value = true
}

function hide() {
  hideTimeout = setTimeout(() => {
    visible.value = false
    hideTimeout = null
  }, 100)
}

function handleMouseEnter() {
  show()
}

function handleMouseLeave() {
  hide()
}

defineExpose({ show, hide })
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<style lang="scss" scoped>
.bee-tooltip-trigger {
  display: inline-flex;
}

.bee-tooltip {
  z-index: 9999;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-xs;
  font-size: $font-size-xs;
  color: $text-regular;
  background: $color-primary-600;
  pointer-events: none;

  &__arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    border-top-left-radius: 2px;
    background: $color-primary-600;
    transform: rotate(45deg);
  }
}

// 过渡动画
.bee-tooltip-enter-active,
.bee-tooltip-leave-active {
  transition: opacity 0.15s ease;
}

.bee-tooltip-enter-from,
.bee-tooltip-leave-to {
  opacity: 0;
}
</style>
