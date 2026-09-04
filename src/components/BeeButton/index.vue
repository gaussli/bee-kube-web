<template>
  <button class="bee-button" :class="[typeClass, sizeClass, isDisabledClass, isLoadingClass]" @click="handleClick">
    <BeeIcon v-if="iconName" class="bee-button__icon" :name="iconName" :size="iconSize" />
    <span><slot /></span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeButton' })

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
  click: [event: MouseEvent]
}>()

// ==================== Reactive State ====================
const loading = ref(false)
const typeClass = computed(() => (props.type !== 'default' ? 'bee-button--' + props.type : ''))
const sizeClass = computed(() => (props.size !== 'default' ? 'bee-button--' + props.size : ''))
const isDisabledClass = computed(() => (props.disabled || loading.value ? 'is-disabled' : ''))
const isLoadingClass = computed(() => (loading.value ? 'is-loading' : ''))
const iconName = computed(() => (loading.value ? 'basic-loading' : props.icon))
const iconSize = computed(() => {
  switch (props.size) {
    case 'small':
      return 12
    case 'large':
      return 16
    default:
      return 14
  }
})

// ==================== Handler ====================
/**
 * 点击事件处理
 * @param event - 原生鼠标事件对象
 */
function handleClick(event: MouseEvent) {
  if (loading.value) return // loading 期间直接忽略，避免重复触发
  loading.value = true
  try {
    emit('click', event) // emit 为同步派发，若监听器是异步函数不会等待其完成
  } finally {
    loading.value = false // 无论是否抛出异常都复位，防止按钮卡在 loading 态
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use './variables' as *;

.bee-button {
  $types: primary, success, warning, danger;

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

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
