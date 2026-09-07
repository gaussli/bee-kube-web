<template>
  <button
    class="bee-icon-button"
    :class="[typeClass, sizeClass, isDisabledClass, isLoadingClass, borderedClass]"
    @click="handleClick"
  >
    <BeeIcon class="bee-icon-button__icon" :name="iconName" />
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import BeeIcon from '@/components/base/BeeIcon/index.vue'

defineOptions({ name: 'BeeIconButton' })

// ==================== Prop & Emit ====================
const props = withDefaults(
  defineProps<{
    /** 按钮类型 */
    type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
    /** 按钮尺寸 */
    size?: 'default' | 'small' | 'large'
    /** 禁用标记 */
    disabled?: boolean
    /** 按钮图标 */
    icon: string
    /** 边框展示标记 */
    bordered?: boolean
  }>(),
  {
    type: 'default',
    size: 'default',
    disabled: false,
    bordered: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// ==================== Reactive State ====================
const loading = ref(false)
const typeClass = computed(() => (props.type !== 'default' ? `bee-icon-button--${props.type}` : ''))
const sizeClass = computed(() => (props.size !== 'default' ? `bee-icon-button--${props.size}` : ''))
const isDisabledClass = computed(() => (props.disabled || loading.value ? 'is-disabled' : ''))
const isLoadingClass = computed(() => (loading.value ? 'is-loading' : ''))
const iconName = computed(() => (loading.value ? 'basic-loading' : props.icon))
const borderedClass = computed(() => (props.bordered ? `bee-icon-button--bordered` : ''))

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
@use 'sass:map';

$types: primary, success, warning, danger;

.bee-icon-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 9999px;
  font-size: 20px;
  font-weight: normal;
  color: var(--bee-icon-button-color-text-default, map.get($colors-default, 'text', 'base'));
  white-space: nowrap;
  background: var(--bee-icon-button-color-bg-default, map.get($colors-default, 'bg', 'base'));
  cursor: pointer;
  user-select: none;

  &--bordered {
    border: 1px solid;
    border-color: var(--bee-icon-button-color-border-default, map.get($colors-default, 'border', 'base'));
  }

  &--small {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  &--large {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  &:hover:not(.is-disabled) {
    border-color: var(--bee-icon-button-color-border-default-hover, map.get($colors-default, 'border', 'hover'));
    color: var(--bee-icon-button-color-text-default-hover, map.get($colors-default, 'text', 'hover'));
    background: var(--bee-icon-button-color-bg-default-hover, map.get($colors-default, 'bg', 'hover'));
  }

  &:active:not(.is-disabled) {
    border-color: var(--bee-icon-button-color-border-default-active, map.get($colors-default, 'border', 'active'));
    color: var(--bee-icon-button-color-text-default-active, map.get($colors-default, 'text', 'active'));
    background: var(--bee-icon-button-color-bg-default-active, map.get($colors-default, 'bg', 'active'));
  }

  @each $type in $types {
    $colors-type: map.get($color, $type);

    &.bee-icon-button--#{$type} {
      border-color: var(--bee-icon-button-color-border-#{$type}, map.get($colors-type, 'border', 'base'));
      color: var(--bee-icon-button-color-text-#{$type}, map.get($colors-type, 'text', 'base'));
      background: var(--bee-icon-button-color-bg-#{$type}, map.get($colors-type, 'bg', 'base'));

      &:hover {
        border-color: var(--bee-icon-button-color-border-#{$type}-hover, map.get($colors-type, 'border', 'hover'));
        color: var(--bee-icon-button-color-text-#{$type}-hover, map.get($colors-type, 'text', 'hover'));
        background: var(--bee-icon-button-color-bg-#{$type}-hover, map.get($colors-type, 'bg', 'hover'));
      }

      &:active {
        border-color: var(--bee-icon-button-color-border-#{$type}-active, map.get($colors-type, 'border', 'active'));
        color: var(--bee-icon-button-color-text-#{$type}-active, map.get($colors-type, 'text', 'active'));
        background: var(--bee-icon-button-color-bg-#{$type}-active, map.get($colors-type, 'bg', 'active'));
      }
    }
  }

  &.is-disabled {
    border-color: var(--bee-icon-button-color-border-default-disabled, map.get($colors-default, 'border', 'disabled'));
    color: var(--bee-icon-button-color-text-default-disabled, map.get($colors-default, 'text', 'disabled'));
    background: var(--bee-icon-button-color-bg-default-disabled, map.get($colors-default, 'bg', 'disabled'));
    cursor: not-allowed;

    @each $type in $types {
      $colors-type: map.get($color, $type);
      &.bee-icon-button--#{$type} {
        border-color: var(
          --bee-icon-button-color-border-#{$type}-disabled,
          map.get($colors-type, 'border', 'disabled')
        );
        color: var(--bee-icon-button-color-text-#{$type}-disabled, map.get($colors-type, 'text', 'disabled'));
        background: var(--bee-icon-button-color-bg-#{$type}-disabled, map.get($colors-type, 'bg', 'disabled'));
      }
    }
  }

  &.is-loading {
    cursor: wait;

    .bee-icon-button__icon {
      animation: rotating 2s linear infinite;
    }
  }
}
</style>
