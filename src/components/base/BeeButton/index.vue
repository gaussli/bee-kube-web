<!--
  BeeButton 按钮组件

  基础按钮，支持类型、尺寸、图标与内置加载态；点击时自动进入 loading 防止重复点击，
  样式通过 CSS 变量对外暴露以便主题覆盖。

  @example
  <BeeButton type="primary" icon="basic-add" @click="handleAdd">新增</BeeButton>
  <BeeButton type="danger" size="small" :disabled="!selected" @click="handleDelete">删除</BeeButton>
-->
<template>
  <!-- 按钮根元素：类型/尺寸/禁用/加载状态全部由修饰 class 驱动，配色通过 CSS 变量对外暴露 -->
  <button class="bee-button" :class="[typeClass, sizeClass, isDisabledClass, isLoadingClass]" @click="handleClick">
    <!-- 图标：加载中会被替换为旋转的 basic-loading -->
    <BeeIcon v-if="iconName" class="bee-button__icon" :name="iconName" />
    <!-- 按钮文案 -->
    <span><slot /></span>
  </button>
</template>

<script setup lang="ts">
/**
 * BeeButton 按钮组件
 * @module components/base/BeeButton
 * @description 基础按钮；加载态为组件内部行为，click 同步派发，不等待异步监听器完成
 */
import { computed, ref } from 'vue'

import BeeIcon from '@/components/base/BeeIcon/index.vue'

defineOptions({ name: 'BeeButton' })

/** 按钮类型：default 为默认描边样式，其余为对应语义色 */
export type BeeButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger'

// ==================== Prop & Emit ====================
const props = withDefaults(
  defineProps<{
    /** 按钮类型 */
    type?: BeeButtonType
    /** 按钮尺寸 */
    size?: 'default' | 'small' | 'large'
    /** 是否禁用 */
    disabled?: boolean
    /** 按钮图标（BeeIcon 名称，不含 `#icon-` 前缀） */
    icon?: string
  }>(),
  {
    type: 'default',
    size: 'default',
    disabled: false,
    icon: undefined,
  },
)

const emit = defineEmits<{
  /** 点击事件：透传原生 MouseEvent，loading 期间不会派发 */
  click: [event: MouseEvent]
}>()

// ==================== Reactive State ====================
/** 内部加载态：仅在单次点击的同步派发期间为 true，用于防止重复点击 */
const loading = ref(false)

// ==================== Computed ====================
/** 类型修饰 class，default 不附加 */
const typeClass = computed(() => (props.type !== 'default' ? `bee-button--${props.type}` : ''))
/** 尺寸修饰 class，default 不附加 */
const sizeClass = computed(() => (props.size !== 'default' ? `bee-button--${props.size}` : ''))
/** 禁用态 class：disabled 与 loading 均按禁用样式渲染 */
const isDisabledClass = computed(() => (props.disabled || loading.value ? 'is-disabled' : ''))
/** 加载态 class：图标旋转 + `cursor: wait` */
const isLoadingClass = computed(() => (loading.value ? 'is-loading' : ''))
/** 实际渲染的图标名：加载中固定使用 basic-loading，否则透传 props.icon */
const iconName = computed(() => (loading.value ? 'basic-loading' : props.icon))

// ==================== Handler ====================
/**
 * 点击事件处理
 * @param event - 原生鼠标事件对象
 */
function handleClick(event: MouseEvent) {
  if (loading.value) return
  loading.value = true
  try {
    emit('click', event)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
/**
 * 样式采用 BEM + CSS 变量：配色与宽度均可由外部覆盖
 * - 宽度：`--bee-button-width`
 * - 配色：`--bee-button-color-{border|text|bg}-{default|primary|success|warning|danger}[-{hover|active|disabled}]`
 */
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
