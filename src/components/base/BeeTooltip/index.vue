<template>
  <!-- 触发器：包裹 slot 默认内容，hover 时显示 tooltip -->
  <div
    ref="triggerRef"
    class="bee-tooltip__trigger"
    @mouseenter="handleTriggerMouseEnter"
    @mouseleave="handleTriggerMouseLeave"
  >
    <slot />
  </div>

  <!-- Tooltip 浮层：Teleport 到 body，使用 @floating-ui 智能定位 -->
  <Teleport to="body">
    <Transition name="bee-tooltip">
      <div
        v-if="visible"
        ref="floatingRef"
        class="bee-tooltip"
        :class="[sizeClass]"
        :style="floatingStyles"
        @mouseenter="handleTooltipMouseEnter"
        @mouseleave="handleTooltipMouseLeave"
      >
        <slot name="tooltip">{{ tooltip }}</slot>
        <div ref="arrowRef" class="bee-tooltip__arrow" :style="arrowStyle" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import { arrow, flip, offset, shift, useFloating } from '@floating-ui/vue'

defineOptions({ name: 'BeeTooltip' })

// ==================== Props ====================
const props = withDefaults(
  defineProps<{
    /** 提示文本 */
    tooltip?: string
    /** 弹出方向，flip 中间件可能自动翻转 */
    placement?: 'top' | 'bottom' | 'left' | 'right'
    /** 提示框尺寸 */
    size?: 'default' | 'small' | 'large'
    /** 禁用标记 */
    disabled?: boolean
  }>(),
  {
    tooltip: '',
    placement: 'top',
    size: 'default',
    disabled: false,
  },
)

// ==================== Reactive State ====================
/** 触发器元素引用 */
const triggerRef = ref<HTMLElement>()
/** 浮层元素引用 */
const floatingRef = ref<HTMLElement>()
/** 箭头元素引用 */
const arrowRef = ref<HTMLElement>()
/** 浮层可见性 */
const visible = ref(false)
/** 鼠标是否悬停在 tooltip 上（防止误隐藏） */
const isHovered = ref(false)

// ==================== Computed ====================
/** 尺寸 class 名称 */
const sizeClass = computed(() => (props.size !== 'default' ? `bee-tooltip--${props.size}` : ''))
/** 箭头动态定位样式，根据 placement 计算箭头坐标和方向侧偏移 */
const arrowStyle = computed(() => {
  const arrowData = middlewareData.value.arrow
  if (!arrowData) return {}

  const { x, y } = arrowData
  const staticSideMap: Record<string, string> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }
  const side = placement.value.split('-')[0]
  const staticSide = staticSideMap[side] || 'bottom'

  return {
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : '',
    [staticSide]: '-4px',
  }
})

// ==================== Floating UI ====================
/**
 * 使用 @floating-ui 实现智能定位，含偏移、翻转、边界约束和箭头
 */
const { floatingStyles, middlewareData, placement } = useFloating(triggerRef, floatingRef, {
  placement: props.placement,
  middleware: [
    offset(12), // tooltip 与触发器间距 12px
    flip(), // 超出视口时自动翻转方向
    shift({ padding: 8 }), // 防止超出视口，保留 8px 安全边距
    arrow({ element: arrowRef }), // 箭头定位
  ],
})

// ==================== Timers ====================
let showTimeout: ReturnType<typeof setTimeout> | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null

// ==================== Methods ====================
/**
 * 立即显示 tooltip，取消待处理的隐藏定时器。
 */
function show() {
  if (props.disabled) return
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

/**
 * 延迟 150ms 隐藏 tooltip（若鼠标未移回 tooltip 上方）
 */
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

// ==================== Handlers ====================
/**
 * 鼠标移入触发器：立即显示
 */
function handleTriggerMouseEnter() {
  show()
}

/**
 * 鼠标移出触发器：延迟隐藏
 */
function handleTriggerMouseLeave() {
  hide()
}

/**
 * 鼠标移入 tooltip：标记悬停，取消隐藏定时器
 */
function handleTooltipMouseEnter() {
  isHovered.value = true
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
}

/**
 * 鼠标移出 tooltip：取消悬停标记，触发延迟隐藏
 */
function handleTooltipMouseLeave() {
  isHovered.value = false
  hide()
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

// ==================== 触发器 ====================
.bee-tooltip__trigger {
  cursor: pointer;
}

// ==================== 浮层主体 ====================
.bee-tooltip {
  --bee-tooltip-bg: rgb(40 40 40);

  filter: drop-shadow(2px 2px 10px rgb(var(--bee-tooltip-bg), 0.4));
  z-index: 9999;
  max-width: 30%;
  padding: 8px;
  border-radius: 8px;
  font-size: 12px;
  color: $color-text-primary;
  background: var(--bee-tooltip-bg);
  cursor: default;
  user-select: text;

  // ==================== 尺寸变体 ====================
  &--large {
    border-radius: 12px;
    font-size: 14px;
  }

  &--small {
    border-radius: 4px;
    font-size: 10px;
  }

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
