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

import type { BeeType } from '@/config'

import BeeIcon from '@/components/base/BeeIcon/index.vue'

defineOptions({ name: 'BeeIconButton' })

// ==================== Prop & Emit ====================
const props = withDefaults(
  defineProps<{
    /** 按钮类型 */
    type?: BeeType
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

.bee-icon-button {
  /* stylelint-disable order/custom-properties-alphabetical-order */
  --bee-icon-button-size: 40px;
  --bee-icon-button-font-size: 20px;
  --bee-icon-button-color: #{map.get($color, 'default', 'text', 'base')};
  --bee-icon-button-color-bg: #{map.get($color, 'default', 'bg', 'base')};
  --bee-icon-button-color-border: #{map.get($color, 'default', 'border', 'base')};
  --bee-icon-button-color-hover: #{map.get($color, 'default', 'text', 'hover')};
  --bee-icon-button-color-bg-hover: #{map.get($color, 'default', 'bg', 'hover')};
  --bee-icon-button-color-border-hover: #{map.get($color, 'default', 'border', 'hover')};
  --bee-icon-button-color-active: #{map.get($color, 'default', 'text', 'active')};
  --bee-icon-button-color-bg-active: #{map.get($color, 'default', 'bg', 'active')};
  --bee-icon-button-color-border-active: #{map.get($color, 'default', 'border', 'active')};
  --bee-icon-button-color-disabled: #{map.get($color, 'default', 'text', 'disabled')};
  --bee-icon-button-color-bg-disabled: #{map.get($color, 'default', 'bg', 'disabled')};
  --bee-icon-button-color-border-disabled: #{map.get($color, 'default', 'border', 'disabled')};

  @each $type in (primary, success, warning, danger) {
    &.bee-icon-button--#{$type} {
      --bee-icon-button-color: #{map.get($color, $type, 'text', 'base')};
      --bee-icon-button-color-bg: #{map.get($color, $type, 'bg', 'base')};
      --bee-icon-button-color-border: #{map.get($color, $type, 'border', 'base')};
      --bee-icon-button-color-hover: #{map.get($color, $type, 'text', 'hover')};
      --bee-icon-button-color-bg-hover: #{map.get($color, $type, 'bg', 'hover')};
      --bee-icon-button-color-border-hover: #{map.get($color, $type, 'border', 'hover')};
      --bee-icon-button-color-active: #{map.get($color, $type, 'text', 'active')};
      --bee-icon-button-color-bg-active: #{map.get($color, $type, 'bg', 'active')};
      --bee-icon-button-color-border-active: #{map.get($color, $type, 'border', 'active')};
      --bee-icon-button-color-disabled: #{map.get($color, $type, 'text', 'disabled')};
      --bee-icon-button-color-bg-disabled: #{map.get($color, $type, 'bg', 'disabled')};
      --bee-icon-button-color-border-disabled: #{map.get($color, $type, 'border', 'disabled')};
    }
  }

  &.bee-icon-button--small {
    --bee-icon-button-size: 32px;
    --bee-icon-button-font-size: 16px;
  }

  &.bee-icon-button--large {
    --bee-icon-button-size: 48px;
    --bee-icon-button-font-size: 24px;
  }

  /* stylelint-enable order/custom-properties-alphabetical-order */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: var(--bee-icon-button-size);
  height: var(--bee-icon-button-size);
  padding: 0;
  border: 0;
  border-radius: 9999px;
  font-size: var(--bee-icon-button-font-size);
  font-weight: normal;
  color: var(--bee-icon-button-color);
  white-space: nowrap;
  background: var(--bee-icon-button-color-bg);
  cursor: pointer;
  user-select: none;

  &--bordered {
    border: 1px solid;
    border-color: var(--bee-icon-button-color-border);
  }

  &:hover:not(.is-disabled) {
    border-color: var(--bee-icon-button-color-border-hover);
    color: var(--bee-icon-button-color-hover);
    background: var(--bee-icon-button-color-bg-hover);
  }

  &:active:not(.is-disabled) {
    border-color: var(--bee-icon-button-color-border-active);
    color: var(--bee-icon-button-color-active);
    background: var(--bee-icon-button-color-bg-active);
  }

  &.is-disabled {
    border-color: var(--bee-icon-button-color-border-disabled);
    color: var(--bee-icon-button-color-disabled);
    background: var(--bee-icon-button-color-bg-disabled);
    cursor: not-allowed;
  }

  &.is-loading {
    cursor: wait;

    .bee-icon-button__icon {
      animation: rotating 2s linear infinite;
    }
  }
}
</style>
