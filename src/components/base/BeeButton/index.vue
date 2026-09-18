<template>
  <button class="bee-button" :class="[typeClass, sizeClass, isDisabledClass, isLoadingClass]" @click="handleClick">
    <BeeIcon v-if="iconName" class="bee-button__icon" :name="iconName" />
    <span><slot /></span>
  </button>
</template>

<script setup lang="ts">
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

.bee-button {
  /* stylelint-disable order/custom-properties-alphabetical-order */
  --bee-button-width: auto;
  --bee-button-height: 40px;
  --bee-button-padding: 0 20px;
  --bee-button-font-size: 14px;
  --bee-button-color: #{map.get($color, 'default', 'text', 'base')};
  --bee-button-color-bg: #{map.get($color, 'default', 'bg', 'base')};
  --bee-button-color-border: #{map.get($color, 'default', 'border', 'base')};
  --bee-button-color-hover: #{map.get($color, 'default', 'text', 'hover')};
  --bee-button-color-bg-hover: #{map.get($color, 'default', 'bg', 'hover')};
  --bee-button-color-border-hover: #{map.get($color, 'default', 'border', 'hover')};
  --bee-button-color-active: #{map.get($color, 'default', 'text', 'active')};
  --bee-button-color-bg-active: #{map.get($color, 'default', 'bg', 'active')};
  --bee-button-color-border-active: #{map.get($color, 'default', 'border', 'active')};
  --bee-button-color-disabled: #{map.get($color, 'default', 'text', 'disabled')};
  --bee-button-color-bg-disabled: #{map.get($color, 'default', 'bg', 'disabled')};
  --bee-button-color-border-disabled: #{map.get($color, 'default', 'border', 'disabled')};

  @each $type in (primary, success, warning, danger) {
    &.bee-button--#{$type} {
      --bee-button-color: #{map.get($color, $type, 'text', 'base')};
      --bee-button-color-bg: #{map.get($color, $type, 'bg', 'base')};
      --bee-button-color-border: #{map.get($color, $type, 'border', 'base')};
      --bee-button-color-hover: #{map.get($color, $type, 'text', 'hover')};
      --bee-button-color-bg-hover: #{map.get($color, $type, 'bg', 'hover')};
      --bee-button-color-border-hover: #{map.get($color, $type, 'border', 'hover')};
      --bee-button-color-active: #{map.get($color, $type, 'text', 'active')};
      --bee-button-color-bg-active: #{map.get($color, $type, 'bg', 'active')};
      --bee-button-color-border-active: #{map.get($color, $type, 'border', 'active')};
      --bee-button-color-disabled: #{map.get($color, $type, 'text', 'disabled')};
      --bee-button-color-bg-disabled: #{map.get($color, $type, 'bg', 'disabled')};
      --bee-button-color-border-disabled: #{map.get($color, $type, 'border', 'disabled')};
    }
  }

  &.bee-button--small {
    --bee-button-height: 32px;
    --bee-button-padding: 0 16px;
    --bee-button-font-size: 12px;
  }

  &.bee-button--large {
    --bee-button-height: 48px;
    --bee-button-padding: 0 28px;
    --bee-button-font-size: 16px;
  }

  /* stylelint-enable order/custom-properties-alphabetical-order */
  display: flex;
  gap: 4px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: var(--bee-button-width);
  height: var(--bee-button-height);
  padding: var(--bee-button-padding);
  border: 1px solid;
  border-color: var(--bee-button-color-border);
  border-radius: 9999px;
  font-size: var(--bee-button-font-size);
  font-weight: normal;
  color: var(--bee-button-color);
  white-space: nowrap;
  background: var(--bee-button-color-bg);
  cursor: pointer;
  user-select: none;

  &:hover:not(.is-disabled) {
    border-color: var(--bee-button-color-border-hover);
    color: var(--bee-button-color-hover);
    background: var(--bee-button-color-bg-hover);
  }

  &:active:not(.is-disabled) {
    border-color: var(--bee-button-color-border-active);
    color: var(--bee-button-color-active);
    background: var(--bee-button-color-bg-active);
  }

  &.is-disabled {
    border-color: var(--bee-button-color-border-disabled);
    color: var(--bee-button-color-disabled);
    background: var(--bee-button-color-bg-disabled);
    cursor: not-allowed;
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
