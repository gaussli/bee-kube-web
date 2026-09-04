<template>
  <BeeTooltip :label="tooltip" placement="top" size="small">
    <button
      class="bee-circle-button"
      :class="[
        `bee-circle-button--${type}`,
        `bee-circle-button--${size}`,
        { 'bee-circle-button--bordered': border, 'is-disabled': disabled, 'is-loading': loading },
      ]"
      :disabled="disabled || loading"
      @click.stop="handleClick"
    >
      <BeeIcon
        v-if="loading"
        class="bee-circle-button__icon is-loading"
        name="basic-loading"
        :size="effectiveIconSize"
      />
      <BeeIcon v-else class="bee-circle-button__icon" :name="icon" :size="effectiveIconSize" />
    </button>
  </BeeTooltip>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeTooltip from '@/components/BeeTooltip/index.vue'

defineOptions({ name: 'BeeCircleButton' })

const props = withDefaults(
  defineProps<{
    /** 按钮类型 */
    type?: 'primary' | 'success' | 'warning' | 'danger'
    /** 按钮尺寸 */
    size?: 'large' | 'default' | 'small'
    /** 是否禁用 */
    disabled?: boolean
    /** 是否显示边框 */
    border?: boolean
    /** 图标名称 */
    icon: string
    /** 图标尺寸，手动指定后忽略 size 和 border 的自动计算 */
    iconSize?: number
    /** tooltip 提示文字 */
    tooltip: string
  }>(),
  {
    type: 'primary',
    size: 'default',
    disabled: false,
    border: true,
    iconSize: 16,
  },
)

/** 各尺寸下 bordered / plain 的图标默认值 */
const iconSizeMap: Record<string, { bordered: number; plain: number }> = {
  large: { bordered: 18, plain: 32 },
  default: { bordered: 14, plain: 24 },
  small: { bordered: 12, plain: 18 },
}

/** 根据 size 和 border 计算图标实际尺寸 */
const effectiveIconSize = computed(() => {
  if (props.iconSize !== undefined) return props.iconSize
  const mapping = iconSizeMap[props.size]
  return props.border ? mapping.bordered : mapping.plain
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const loading = ref(false)

/**
 * 点击事件处理，带 loading 防重
 * @param event
 */
function handleClick(event: Event) {
  if (loading.value) return
  loading.value = true
  try {
    emit('click', event)
  } finally {
    loading.value = false
  }
}

defineExpose({ loading })
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-circle-button {
  // 类型颜色 CSS 变量（使用者可覆盖）
  /* stylelint-disable order/custom-properties-alphabetical-order */
  // ---- 通用 ----
  --bee-circle-button-color: #{$color-text-secondary};
  --bee-circle-button-color-disabled: #{rgba($color-text-secondary, 0.3)};

  // ---- primary 类型 ----
  --bee-circle-button-color-primary-hover: #{map.get($colors, 'primary', 50)};
  --bee-circle-button-color-primary-active: #{map.get($colors, 'primary', 40)};

  // ---- success 类型 ----
  --bee-circle-button-color-success-hover: #{map.get($colors, 'success', 50)};
  --bee-circle-button-color-success-active: #{map.get($colors, 'success', 40)};

  // ---- warning 类型 ----
  --bee-circle-button-color-warning-hover: #{map.get($colors, 'warning', 50)};
  --bee-circle-button-color-warning-active: #{map.get($colors, 'warning', 40)};

  // ---- danger 类型 ----
  --bee-circle-button-color-danger-hover: #{map.get($colors, 'danger', 50)};
  --bee-circle-button-color-danger-active: #{map.get($colors, 'danger', 40)};
  /* stylelint-enable order/custom-properties-alphabetical-order */

  $types: primary, success, warning, danger;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: $radius-full;
  color: var(--bee-circle-button-color);
  background: transparent;
  cursor: pointer;
  user-select: none;
  transition:
    color 0.3s,
    border-color 0.3s;

  &__icon.is-loading {
    animation: rotating 2s linear infinite;
  }

  // ---- 有边框（Bordered）模式 ----
  &--bordered {
    box-sizing: border-box;
    border: 1px solid currentcolor;
  }

  // ---- 尺寸变体 ----
  &--large {
    width: 40px;
    height: 40px;
  }

  &--small {
    width: 24px;
    height: 24px;
  }

  // ---- 悬停（Hover）状态 ----
  &:hover:not(.is-disabled, .is-loading) {
    @each $type in $types {
      &.bee-circle-button--#{$type} {
        color: var(--bee-circle-button-color-#{$type}-hover);
      }
    }
  }

  // ---- 激活（Active）状态 ----
  &:active:not(.is-disabled, .is-loading) {
    @each $type in $types {
      &.bee-circle-button--#{$type} {
        color: var(--bee-circle-button-color-#{$type}-active);
      }
    }
  }

  // ---- 禁用（Disabled）状态 ----
  &.is-disabled {
    color: var(--bee-circle-button-color-disabled);
    cursor: not-allowed;
  }

  // ---- 加载（Loading）状态 ----
  &.is-loading {
    cursor: wait;
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
