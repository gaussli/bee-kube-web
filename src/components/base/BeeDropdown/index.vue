<template>
  <!-- 触发器：click 时显示下拉框 -->
  <div ref="triggerRef" class="bee-dropdown bee-dropdown__trigger" @click.capture="handleToggle">
    <slot />
  </div>

  <!-- 下拉框容器浮层：Teleport 到 body，使用 @floating-ui 智能定位 -->
  <Teleport to="body">
    <Transition name="bee-dropdown">
      <div v-if="isOpen" ref="floatingRef" class="bee-dropdown__menu" :style="floatingStyles" @click.stop>
        <div class="bee-dropdown__menu-wrapper">
          <!-- 渲染菜单项 -->
          <div
            v-for="option in options"
            :key="option.value"
            class="bee-dropdown__menu-item"
            @click="handleSelect(option)"
          >
            <div v-if="option.divided" class="bee-dropdown__menu-item-separator"></div>
            <div class="bee-dropdown__menu-item-content">
              <BeeIcon v-if="option.icon" class="bee-dropdown__menu-item-icon" :name="option.icon" />
              <span>{{ option.label }}</span>
            </div>
          </div>
        </div>
        <div ref="arrowRef" class="bee-dropdown__arrow" :style="arrowStyle" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { arrow, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { onClickOutside, useElementHover, useTimeoutFn } from '@vueuse/core'

import type { DropdownOption } from './types'

import BeeIcon from '@/components/base/BeeIcon/index.vue'

defineOptions({ name: 'BeeDropdown' })

// ==================== Prop & Emit ====================
const modelValue = defineModel<string | number | undefined>()
const props = withDefaults(
  defineProps<{
    /** 选项列表 */
    options?: DropdownOption[]
    /** 触发方式 */
    trigger?: 'click' | 'hover'
    /** 弹出位置 */
    placement?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    options: () => [],
    trigger: 'click',
    placement: 'bottom',
  },
)

const emit = defineEmits<{
  /** 选中值变化 */
  'change': [value: string | number]
  /** 展开状态变化 */
  'visible-change': [visible: boolean]
}>()

// ==================== Reactive State ====================
/** 触发器元素引用 */
const triggerRef = ref<HTMLElement>()
/** 菜单元素引用 */
const floatingRef = ref<HTMLElement>()
/** 箭头元素引用 */
const arrowRef = ref<HTMLElement>()
/** 是否展开 */
const isOpen = ref(false)

// ==================== Computed ====================
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
    [staticSide]: '8px', // 勾股定理获得对角线除以 2，再向上取整（防止出现直角转角）
  }
})

// ==================== Vueuse ====================
const isTriggerHover = useElementHover(triggerRef)
const isFloatingHover = useElementHover(floatingRef)
const { start: startCloseMenuTimeout, stop: stopCloseMenuTimeout } = useTimeoutFn(() => closeMenu(), 150, {
  immediate: false,
})

watch([isTriggerHover, isFloatingHover], ([th, fh]) => {
  if (th && props.trigger == 'hover') {
    showMenu()
  }
  if (th || fh) {
    stopCloseMenuTimeout()
  } else {
    startCloseMenuTimeout()
  }
})

onClickOutside(triggerRef, () => closeMenu(), { ignore: [floatingRef] })

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

// ==================== Method ====================
/**
 * 打开下拉菜单
 */
function showMenu() {
  if (isOpen.value) return
  isOpen.value = true
  emit('visible-change', true)
}

/** 关闭下拉菜单 */
function closeMenu() {
  if (!isOpen.value) return
  isOpen.value = false
  emit('visible-change', false)
}

// ==================== Handler ====================
/**
 * 切换展开/收起
 */
function handleToggle() {
  if (props.trigger === 'click') {
    isOpen.value = !isOpen.value
    emit('visible-change', isOpen.value)
  }
}

/**
 * 处理选项选中
 * @param option
 */
function handleSelect(option: DropdownOption) {
  modelValue.value = option.value
  emit('change', option.value)
  isOpen.value = false
  emit('visible-change', false)
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

// ==================== 触发器 ====================
.bee-dropdown__trigger {
  display: flex;
  cursor: pointer;
}

// ==================== 下拉菜单 ====================
$bee-dropdown-menu-color-bg: rgb(40 40 40);

.bee-dropdown__menu {
  --bee-dropdown-menu-color-bg: #{$bee-dropdown-menu-color-bg};

  filter: drop-shadow(0 0 4px rgba($bee-dropdown-menu-color-bg, 50%));
  position: relative;
  z-index: 1000;
  padding-top: 12px;
  background: transparent;

  .bee-dropdown__arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    border-top-left-radius: 4px;
    background: var(--bee-dropdown-menu-color-bg);
    transform: rotate(45deg);
  }

  .bee-dropdown__menu-wrapper {
    display: flex;
    gap: 8px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 8px;
    border-radius: 8px;
    overflow: hidden;
    background: var(--bee-dropdown-menu-color-bg);

    .bee-dropdown__menu-item {
      display: flex;
      gap: 8px;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &-separator {
        width: 120%;
        height: 1px;
        background: $color-separator;
      }

      &-content {
        display: flex;
        gap: 8px;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 8px 16px;
        border: 1px solid;
        border-color: transparent;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: normal;
        color: var(--bee-dropdown-menu-item-color-text, map.get($colors-default, 'text', 'hover'));
        cursor: pointer;
        transition: background 0.2s;

        .bee-dropdown__menu-item-icon {
          flex-shrink: 0;
        }

        &:hover {
          border-color: transparent;
          color: var(--bee-dropdown-menu-item-color-text-hover, $color-text-primary);
          background: var(--bee-dropdown-menu-item-color-bg-hover, $color-primary);
        }
      }
    }
  }
}

// ==================== 过渡动画 ====================
.bee-dropdown-enter-active,
.bee-dropdown-leave-active {
  transition: opacity 0.2s ease;
}

.bee-dropdown-enter-from,
.bee-dropdown-leave-to {
  opacity: 0;
}
</style>
