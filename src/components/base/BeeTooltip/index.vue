<template>
  <!-- 触发器：包裹 slot 默认内容，hover 时显示 tooltip -->
  <div ref="triggerRef" class="bee-tooltip__trigger">
    <slot />
  </div>

  <!-- Tooltip 浮层：Teleport 到 body，使用 @floating-ui 智能定位 -->
  <Teleport to="body">
    <Transition name="bee-tooltip">
      <div v-if="visible" ref="floatingRef" class="bee-tooltip" :style="floatingStyles">
        <div class="bee-tooltip__wrapper" :class="[sizeClass]">
          <slot name="tooltip">{{ tooltip }}</slot>
        </div>
        <div ref="arrowRef" class="bee-tooltip__arrow" :style="arrowStyle" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { arrow, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { useElementHover, useTimeoutFn } from '@vueuse/core'

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
    [staticSide]: '8px',
  }
})

// ==================== Vueuse ====================
const isTriggerHover = useElementHover(triggerRef)
const isFloatingHover = useElementHover(floatingRef)
const { start: startCloseTooltipTimeout, stop: stopCloseTooltipTimeout } = useTimeoutFn(() => closeTooltip(), 150, {
  immediate: false,
})

watch([isTriggerHover, isFloatingHover], ([th, fh]) => {
  if (th) {
    showTooltip()
  }
  if (th || fh) {
    stopCloseTooltipTimeout()
  } else {
    startCloseTooltipTimeout()
  }
})

// ==================== Floating UI ====================
/**
 * 使用 @floating-ui 实现智能定位，含偏移、翻转、边界约束和箭头
 */
const { floatingStyles, middlewareData, placement } = useFloating(triggerRef, floatingRef, {
  placement: props.placement,
  middleware: [
    offset(0), // tooltip 与触发器间距 0px
    flip(), // 超出视口时自动翻转方向
    shift({ padding: 16 }), // 防止超出视口，保留 16px 安全边距
    arrow({ element: arrowRef }), // 箭头定位
  ],
})

// ==================== Methods ====================
/**
 * 打开 Tooltip
 */
function showTooltip() {
  if (props.disabled) return
  if (visible.value) return
  visible.value = true
}

/**
 * 关闭 Tooltip
 */
function closeTooltip() {
  if (!visible.value) return
  visible.value = false
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

  z-index: 9999;
  max-width: 30%;
  padding: 12px;

  &__wrapper {
    filter: drop-shadow(2px 2px 10px rgb(var(--bee-tooltip-bg), 0.4));
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 12px;
    color: $color-text-primary;
    background: var(--bee-tooltip-bg);
    cursor: default;
    user-select: text;

    // ==================== 尺寸变体 ====================
    &.bee-tooltip--large {
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 14px;
    }

    &.bee-tooltip--small {
      padding: 8px;
      border-radius: 4px;
      font-size: 10px;
    }
  }

  &__arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    border-top-left-radius: 4px;
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
