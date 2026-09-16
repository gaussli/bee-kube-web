<template>
  <button class="bee-button" :class="[typeClass, sizeClass, isDisabledClass, isLoadingClass]" @click="handleClick">
    <BeeIcon v-if="iconName" class="bee-button__icon" :name="iconName" />
    <span><slot /></span>
  </button>
</template>

<script setup lang="ts">
/**
 * BeeButton 按钮组件
 * @module components/base/BeeButton
 * @description 基础按钮；加载态为组件内部行为，click 同步派发，不等待异步监听器完成
 */
import { computed } from 'vue'

import type { BeeType } from '@/config'

import BeeIcon from '@/components/base/BeeIcon/index.vue'

defineOptions({ name: 'BeeButton' })

// ==================== Prop & Emit ====================
const props = withDefaults(
  defineProps<{
    /** 按钮类型 */
    type?: BeeType
    /** 按钮尺寸 */
    size?: 'default' | 'small' | 'large'
    /** 按钮图标（BeeIcon 名称，不含 `#icon-` 前缀） */
    icon?: string
    /** 是否禁用 */
    disabled?: boolean
    /** 加载标记 */
    loading?: boolean
  }>(),
  {
    type: 'default',
    size: 'default',
    icon: undefined,
    disabled: false,
    loading: false,
  },
)

const emit = defineEmits<{
  /** 点击事件：透传原生 MouseEvent，loading 期间不会派发 */
  click: [event: MouseEvent]
}>()

// ==================== Reactive State ====================

// ==================== Computed ====================
/** 类型修饰 class */
const typeClass = computed(() => (props.type !== 'default' ? `bee-button--${props.type}` : ''))
/** 尺寸修饰 class */
const sizeClass = computed(() => (props.size !== 'default' ? `bee-button--${props.size}` : ''))
/** 禁用态 class */
const isDisabledClass = computed(() => (props.disabled || props.loading ? 'is-disabled' : ''))
/** 加载态 class */
const isLoadingClass = computed(() => (props.loading ? 'is-loading' : ''))
/** 实际渲染的图标名：加载中固定使用 basic-loading，否则透传 props.icon */
const iconName = computed(() => (props.loading ? 'basic-loading' : props.icon))

// ==================== Handler ====================
/**
 * 点击事件处理
 * @param event - 原生鼠标事件对象
 */
function handleClick(event: MouseEvent) {
  if (props.loading || props.disabled) return
  emit('click', event)
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

$width: auto;
$types: primary, success, warning, danger;

.bee-button {
  display: flex;
  gap: 4px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: var(--bee-button-width, $width);
  height: 40px;
  padding: 0 20px;
  border: 1px solid;
  border-color: var(--bee-button-color-border-default, map.get($colors-default, 'border', 'base'));
  border-radius: 9999px;
  font-size: 14px;
  font-weight: normal;
  color: var(--bee-button-color-text-default, map.get($colors-default, 'text', 'base'));
  white-space: nowrap;
  background: var(--bee-button-color-bg-default, map.get($colors-default, 'bg', 'base'));
  cursor: pointer;
  user-select: none;

  &--small {
    height: 32px;
    padding: 0 14px;
    font-size: 12px;
  }

  &--large {
    height: 48px;
    padding: 0 28px;
    font-size: 16px;
  }

  &:hover:not(.is-disabled) {
    border-color: var(--bee-button-color-border-default-hover, map.get($colors-default, 'border', 'hover'));
    color: var(--bee-button-color-text-default-hover, map.get($colors-default, 'text', 'hover'));
    background: var(--bee-button-color-bg-default-hover, map.get($colors-default, 'bg', 'hover'));
  }

  &:active:not(.is-disabled) {
    border-color: var(--bee-button-color-border-default-active, map.get($colors-default, 'border', 'active'));
    color: var(--bee-button-color-text-default-active, map.get($colors-default, 'text', 'active'));
    background: var(--bee-button-color-bg-default-active, map.get($colors-default, 'bg', 'active'));
  }

  @each $type in $types {
    $colors-type: map.get($color, $type);

    &.bee-button--#{$type} {
      border-color: var(--bee-button-color-border-#{$type}, map.get($colors-type, 'border', 'base'));
      color: var(--bee-button-color-text-#{$type}, map.get($colors-type, 'text', 'base'));
      background: var(--bee-button-color-bg-#{$type}, map.get($colors-type, 'bg', 'base'));

      &:hover {
        border-color: var(--bee-button-color-border-#{$type}-hover, map.get($colors-type, 'border', 'hover'));
        color: var(--bee-button-color-text-#{$type}-hover, map.get($colors-type, 'text', 'hover'));
        background: var(--bee-button-color-bg-#{$type}-hover, map.get($colors-type, 'bg', 'hover'));
      }

      &:active {
        border-color: var(--bee-button-color-border-#{$type}-active, map.get($colors-type, 'border', 'active'));
        color: var(--bee-button-color-text-#{$type}-active, map.get($colors-type, 'text', 'active'));
        background: var(--bee-button-color-bg-#{$type}-active, map.get($colors-type, 'bg', 'active'));
      }
    }
  }

  &.is-disabled {
    border-color: var(--bee-button-color-border-default-disabled, map.get($colors-default, 'border', 'disabled'));
    color: var(--bee-button-color-text-default-disabled, map.get($colors-default, 'text', 'disabled'));
    background: var(--bee-button-color-bg-default-disabled, map.get($colors-default, 'bg', 'disabled'));
    cursor: not-allowed;

    @each $type in $types {
      $colors-type: map.get($color, $type);
      &.bee-button--#{$type} {
        border-color: var(--bee-button-color-border-#{$type}-disabled, map.get($colors-type, 'border', 'disabled'));
        color: var(--bee-button-color-text-#{$type}-disabled, map.get($colors-type, 'text', 'disabled'));
        background: var(--bee-button-color-bg-#{$type}-disabled, map.get($colors-type, 'bg', 'disabled'));
      }
    }
  }

  &.is-loading {
    cursor: wait;

    .bee-button__icon {
      animation: rotating 2s linear infinite;
    }
  }
}

/** 加载态图标的旋转动画 */
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
