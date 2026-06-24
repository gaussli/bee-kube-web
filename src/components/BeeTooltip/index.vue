<template>
  <!-- 触发器：包裹 slot 默认内容，hover 时显示 tooltip -->
  <div ref="triggerRef" class="bee-tooltip-trigger" @mouseenter="handleTriggerMouseEnter" @mouseleave="handleTriggerMouseLeave">
    <slot />
  </div>

  <!-- Tooltip 浮层：Teleport 到 body，使用 @floating-ui 智能定位 -->
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
/**
 * BeeTooltip - 通用提示框组件
 * @module components/BeeTooltip
 * @description 基于 @floating-ui/vue 的悬浮提示框，支持智能定位、边界翻转和箭头指示。默认 slot 作为触发器，label slot 自定义提示内容。支持 hover 时短暂延迟隐藏，防止鼠标移动时闪烁。
 */
import { ref, computed } from 'vue'
import { arrow, flip, offset, shift, useFloating } from '@floating-ui/vue'

defineOptions({ name: 'BeeTooltip' })

// ==================== Props ====================

const props = withDefaults(
  defineProps<{
    /** 提示文本（优先使用 label slot） */
    label?: string
    /** 弹出方向，flip 中间件可能自动翻转 */
    placement?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    label: '',
    placement: 'top'
  }
)

// ==================== Refs ====================

/** 触发器元素引用 */
const triggerRef = ref<HTMLElement>()
/** 浮层元素引用 */
const floatingRef = ref<HTMLElement>()
/** 箭头元素引用 */
const arrowRef = ref<HTMLElement>()

// ==================== State ====================

/** 浮层可见性 */
const visible = ref(false)
/** 鼠标是否悬停在 tooltip 上（防止误隐藏） */
const isHovered = ref(false)

// ==================== Timers ====================

let showTimeout: ReturnType<typeof setTimeout> | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null

// ==================== Floating UI ====================

/** 使用 @floating-ui 实现智能定位，含偏移、翻转、边界约束和箭头 */
const { floatingStyles, middlewareData, placement } = useFloating(triggerRef, floatingRef, {
  placement: props.placement,
  middleware: [
    offset(12), // tooltip 与触发器间距 12px
    flip(), // 超出视口时自动翻转方向
    shift({ padding: 8 }), // 防止超出视口，保留 8px 安全边距
    arrow({ element: arrowRef }) // 箭头定位
  ]
})

// ==================== Computed ====================

/** flip 中间件计算后的实际 placement */
const dataPlacement = computed(() => placement.value)

/**
 * 箭头动态定位样式
 * @remarks 根据 placement 计算箭头坐标和方向侧偏移
 */
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

// ==================== Methods: 显示/隐藏 ====================

/** 立即显示 tooltip，取消待处理的隐藏定时器 */
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

/** 延迟 150ms 隐藏 tooltip（若鼠标未移回 tooltip 上方） */
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

// ==================== Event Handlers ====================

/** 鼠标移入触发器：立即显示 */
function handleTriggerMouseEnter() {
  show()
}

/** 鼠标移出触发器：延迟隐藏 */
function handleTriggerMouseLeave() {
  hide()
}

/** 鼠标移入 tooltip：标记悬停，取消隐藏定时器 */
function handleTooltipMouseEnter() {
  isHovered.value = true
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
}

/** 鼠标移出 tooltip：取消悬停标记，触发延迟隐藏 */
function handleTooltipMouseLeave() {
  isHovered.value = false
  hide()
}

// ==================== Expose ====================

defineExpose({ show, hide })
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

// ==================== 触发器 ====================
.bee-tooltip-trigger {
  display: inline-flex;
}

// ==================== 浮层主体 ====================
$tooltip-bg: map.get($colors, 'gray', 25);

.bee-tooltip {
  // CSS 变量：使用者可通过覆盖 --bee-tooltip-bg 和 --bee-tooltip-box-shadow 自定义样式
  --bee-tooltip-bg: #{$tooltip-bg};
  --bee-tooltip-box-shadow: #{2px 2px 10px 0 rgba($tooltip-bg, 0.4)};

  z-index: 9999;
  padding: $spacing-8;
  border-radius: $radius-8;
  font-size: $font-size-12;
  color: $color-text-primary;
  background: var(--bee-tooltip-bg);
  box-shadow: var(--bee-tooltip-box-shadow);
  cursor: default;
  user-select: text;

  &__arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    border-top-left-radius: 2px;
    background: var(--bee-tooltip-bg);
    pointer-events: none;
    transform: rotate(45deg);
  }
}

// ==================== 过渡动画 ====================
.bee-tooltip-enter-active,
.bee-tooltip-leave-active {
  transition: opacity 0.15s ease;
}

.bee-tooltip-enter-from,
.bee-tooltip-leave-to {
  opacity: 0;
}
</style>
