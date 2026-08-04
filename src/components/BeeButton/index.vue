<template>
  <button
    class="bee-button"
    :class="[`bee-button--${type}`, { 'is-disabled': disabled, 'is-loading': loading }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <BeeIcon v-if="loading" name="basic-loading" :size="14" class="bee-button__icon is-loading" />
    <BeeIcon v-else-if="icon" :name="icon" :size="14" class="bee-button__icon" />
    <slot v-else-if="$slots.icon" name="icon" />
    <span class="bee-button__label">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeButton' })

withDefaults(
  defineProps<{
    type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
    disabled?: boolean
    icon?: string
  }>(),
  {
    type: 'default',
    disabled: false,
    icon: '',
  },
)

const emit = defineEmits<{
  click: [event: Event]
}>()

const loading = ref(false)

async function handleClick(event: Event) {
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

.bee-button {
  // 类型颜色 CSS 变量（使用者可覆盖）
  /* stylelint-disable order/custom-properties-alphabetical-order */
  // ---- default 类型 ----
  --bee-button-color-default: #{$color-text-secondary};
  --bee-button-color-default-hover: #{$color-text-secondary};
  --bee-button-color-default-active: #{$color-text-primary};
  --bee-button-color-default-disabled: #{rgba($color-text-secondary, 0.3)};
  --bee-button-bg-default-hover: #{rgba($color-text-secondary, 0.1)};
  --bee-button-bg-default-active: #{rgba($color-text-secondary, 0.2)};

  // ---- primary 类型 ----
  --bee-button-color-primary: #{map.get($colors, 'primary', 50)};
  --bee-button-color-primary-hover: #{map.get($colors, 'primary', 60)};
  --bee-button-color-primary-active: #{map.get($colors, 'primary', 40)};
  --bee-button-color-primary-disabled: #{rgba(map.get($colors, 'primary', 50), 0.3)};
  --bee-button-bg-primary-hover: #{rgba(map.get($colors, 'primary', 50), 0.1)};
  --bee-button-bg-primary-active: #{rgba(map.get($colors, 'primary', 50), 0.2)};

  // ---- success 类型 ----
  --bee-button-color-success: #{map.get($colors, 'success', 50)};
  --bee-button-color-success-hover: #{map.get($colors, 'success', 60)};
  --bee-button-color-success-active: #{map.get($colors, 'success', 40)};
  --bee-button-color-success-disabled: #{rgba(map.get($colors, 'success', 50), 0.3)};
  --bee-button-bg-success-hover: #{rgba(map.get($colors, 'success', 50), 0.1)};
  --bee-button-bg-success-active: #{rgba(map.get($colors, 'success', 50), 0.2)};

  // ---- warning 类型 ----
  --bee-button-color-warning: #{map.get($colors, 'warning', 50)};
  --bee-button-color-warning-hover: #{map.get($colors, 'warning', 60)};
  --bee-button-color-warning-active: #{map.get($colors, 'warning', 40)};
  --bee-button-color-warning-disabled: #{rgba(map.get($colors, 'warning', 50), 0.3)};
  --bee-button-bg-warning-hover: #{rgba(map.get($colors, 'warning', 50), 0.1)};
  --bee-button-bg-warning-active: #{rgba(map.get($colors, 'warning', 50), 0.2)};

  // ---- danger 类型 ----
  --bee-button-color-danger: #{map.get($colors, 'danger', 50)};
  --bee-button-color-danger-hover: #{map.get($colors, 'danger', 60)};
  --bee-button-color-danger-active: #{map.get($colors, 'danger', 40)};
  --bee-button-color-danger-disabled: #{rgba(map.get($colors, 'danger', 50), 0.3)};
  --bee-button-bg-danger-hover: #{rgba(map.get($colors, 'danger', 50), 0.1)};
  --bee-button-bg-danger-active: #{rgba(map.get($colors, 'danger', 50), 0.2)};
  /* stylelint-enable order/custom-properties-alphabetical-order */

  $types: default, primary, success, warning, danger;

  display: inline-flex;
  gap: $spacing-4;
  justify-content: center;
  align-items: center;
  height: 32px;
  padding: 0 $spacing-16;
  border: 1px solid;
  border-radius: $radius-full;
  font-size: $font-size-14;
  white-space: nowrap;
  background: transparent;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;

  &__icon.is-loading {
    animation: rotating 2s linear infinite;
  }

  // ---- 默认（Rest）状态 ----
  @each $type in $types {
    &.bee-button--#{$type} {
      border-color: var(--bee-button-color-#{$type});
      color: var(--bee-button-color-#{$type});
    }
  }

  // ---- 悬停（Hover）状态 ----
  &:hover:not(.is-disabled, .is-loading) {
    @each $type in $types {
      &.bee-button--#{$type} {
        border-color: var(--bee-button-color-#{$type}-hover);
        color: var(--bee-button-color-#{$type}-hover);
        background: var(--bee-button-bg-#{$type}-hover);
      }
    }
  }

  // ---- 激活（Active）状态 ----
  &:active:not(.is-disabled, .is-loading) {
    @each $type in $types {
      &.bee-button--#{$type} {
        border-color: var(--bee-button-color-#{$type}-active);
        color: var(--bee-button-color-#{$type}-active);
        background: var(--bee-button-bg-#{$type}-active);
      }
    }
  }

  // ---- 禁用（Disabled）状态 ----
  &.is-disabled {
    background: transparent;
    cursor: not-allowed;

    @each $type in $types {
      &.bee-button--#{$type} {
        border-color: var(--bee-button-color-#{$type}-disabled);
        color: var(--bee-button-color-#{$type}-disabled);
      }
    }
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
