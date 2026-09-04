<template>
  <div class="bee-submenu">
    <div class="bee-submenu__title" @click="toggle">
      <BeeIcon v-if="icon" class="bee-submenu__icon" :name="icon" :size="14" />
      <span class="bee-submenu__label">{{ label }}</span>
      <BeeIcon class="bee-submenu__arrow" :class="{ 'is-expanded': isExpanded }" name="basic-arrow-down" :size="14" />
    </div>
    <Transition
      name="bee-submenu-collapse"
      @after-enter="onAfterEnter"
      @after-leave="onAfterLeave"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div v-if="isExpanded" class="bee-submenu__content">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
/**
 * BeeSubMenu 可折叠子菜单组件
 * @module components/BeeMenu/BeeSubMenu
 */
import { computed, inject } from 'vue'

import BeeIcon from '@/components/base/BeeIcon/index.vue'

import { MenuContextKey } from './types'

defineOptions({ name: 'BeeSubMenu' })

const props = defineProps<{
  /** 唯一标识 */
  index: string | number
  /** 菜单文本 */
  label: string
  /** 图标名称 */
  icon?: string
}>()

const menuContext = inject(MenuContextKey, null)

/** 当前子菜单是否展开 */
const isExpanded = computed(() => menuContext?.isSubMenuExpanded(props.index) ?? false)

/**
 * 切换展开/收起
 */
function toggle() {
  menuContext?.toggleSubMenu(props.index)
}

/**
 * Transition enter 钩子：从 height: 0 过渡到实际内容高度
 * @param el - 过渡元素
 */
function onEnter(el: Element) {
  const element = el as HTMLElement
  element.style.height = '0'
  // 强制回流，确保起始样式生效
  element.offsetHeight
  element.style.height = `${element.scrollHeight}px`
}

/**
 * Transition after-enter 钩子：清除内联 height，让内容自适应
 * @param el - 过渡元素
 */
function onAfterEnter(el: Element) {
  const element = el as HTMLElement
  element.style.height = ''
}

/**
 * Transition leave 钩子：从当前高度过渡到 height: 0
 * @param el - 过渡元素
 */
function onLeave(el: Element) {
  const element = el as HTMLElement
  element.style.height = `${element.scrollHeight}px`
  // 强制回流，确保起始样式生效
  element.offsetHeight
  element.style.height = '0'
}

/**
 * Transition after-leave 钩子：清除内联样式
 * @param el - 过渡元素
 */
function onAfterLeave(el: Element) {
  const element = el as HTMLElement
  element.style.height = ''
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-submenu {
  flex-shrink: 0;

  &__title {
    position: relative;
    display: flex;
    gap: $spacing-8;
    align-items: center;
    box-sizing: border-box;
    height: 40px;
    padding: 0 20px;
    border: 1px solid transparent;
    border-radius: $radius-full;
    font-size: 14px;
    color: $color-text-secondary;
    cursor: pointer;
    user-select: none;
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      background: rgba(map.get($colors, 'primary', 50), 0.1);
    }
  }

  &__icon {
    flex-shrink: 0;
  }

  &__label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__arrow {
    flex-shrink: 0;
    margin-left: auto;
    transition: transform 0.3s ease;

    &.is-expanded {
      transform: rotate(180deg);
    }
  }

  &__content {
    display: flex;
    gap: $spacing-8;
    flex-direction: column;
    padding: $spacing-8 0 0 20px;
  }
}

// 子菜单展开/收缩过渡动画
.bee-submenu-collapse-enter-active,
.bee-submenu-collapse-leave-active {
  overflow: hidden;
  transition: height 0.3s ease;
}
</style>
