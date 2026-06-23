<template>
  <div ref="triggerRef" class="bee-tooltip-trigger" @mouseenter="handleTriggerMouseEnter" @mouseleave="handleTriggerMouseLeave">
    <slot />
  </div>
  <Teleport to="body">
    <Transition name="bee-tooltip">
      <div
        v-if="visible"
        ref="floatingRef"
        class="bee-tooltip"
        role="tooltip"
        :style="floatingStyles"
        :data-popper-placement="dataPlacement"
        @mouseenter="handleTooltipMouseEnter"
        @mouseleave="handleTooltipMouseLeave"
      >
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
const isHovered = ref(false)

let showTimeout: ReturnType<typeof setTimeout> | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const { floatingStyles, middlewareData, placement } = useFloating(triggerRef, floatingRef, {
  placement: props.placement,
  middleware: [
    offset(12), // tooltip 与触发元素之间的距离
    flip(), // 边界翻转
    shift({ padding: 8 }), // 防止超出视窗
    arrow({ element: arrowRef }) // 箭头
  ]
})

// 实际的 placement（考虑 flip 后的变化）
const dataPlacement = computed(() => placement.value)

// 箭头样式
const arrowStyle = computed(() => {
  const arrowData = middlewareData.value.arrow
  if (!arrowData) return {}

  const { x, y } = arrowData
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
  if (showTimeout) {
    clearTimeout(showTimeout)
    showTimeout = null
  }
  visible.value = true
}

function hide() {
  if (showTimeout) {
    clearTimeout(showTimeout)
    showTimeout = null
  }
  hideTimeout = setTimeout(() => {
    if (!isHovered.value) {
      visible.value = false
    }
    hideTimeout = null
  }, 150)
}

// 触发器鼠标进入：立即显示
function handleTriggerMouseEnter() {
  show()
}

// 触发器鼠标离开：延迟隐藏（给用户时间移到 tooltip）
function handleTriggerMouseLeave() {
  hide()
}

// tooltip 鼠标进入：标记为 hover，取消隐藏
function handleTooltipMouseEnter() {
  isHovered.value = true
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
}

// tooltip 鼠标离开：标记为非 hover，延迟隐藏
function handleTooltipMouseLeave() {
  isHovered.value = false
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
  padding: $spacing-8 $spacing-16;
  border-radius: $radius-4;
  font-size: $font-size-10;
  color: $color-text-regular;
  background: $color-primary-600;
  cursor: default;
  user-select: text; // 允许选中文本

  &__arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    border-top-left-radius: 2px;
    background: $color-primary-600;
    pointer-events: none; // 箭头不拦截事件
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
