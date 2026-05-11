<template>
  <button
    class="bee-button"
    :class="[`bee-button--${type}`, { 'is-disabled': disabled, 'is-loading': loading, 'is-borderless': !border, 'is-circle': !$slots.default }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <BeeIcon v-if="loading" name="basic-loading" :size="12" class="bee-button__icon is-loading" />
    <BeeIcon v-else-if="icon" :name="icon" :size="12" class="bee-button__icon" />
    <span v-if="$slots.default" class="bee-button__label">
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
    type?: 'primary' | 'info' | 'success' | 'warning' | 'danger'
    disabled?: boolean
    border?: boolean
    icon?: string
  }>(),
  {
    type: 'primary',
    disabled: false,
    border: true
  }
)

const emit = defineEmits<{
  click: [event: Event]
}>()

const loading = ref(false)

async function handleClick(event: Event) {
  console.log('begin click')
  if (loading.value) return
  loading.value = true

  try {
    emit('click', event)
  } finally {
    setTimeout(() => {
      console.log('end click')
      loading.value = false
    }, 10000)
  }
}

defineExpose({ loading })
</script>

<style lang="scss" scoped>
@use 'sass:color';

.bee-button {
  display: inline-flex;
  gap: $spacing-xs;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: $spacing-md;
  border: 1px solid currentcolor;
  border-radius: $radius-full;
  font-size: $font-size-sm;
  color: $text-secondary;
  white-space: nowrap;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s;

  &__icon.is-loading {
    animation: rotating 2s linear infinite;
  }

  // hover 状态
  &:hover:not(.is-disabled, .is-loading) {
    color: $text-regular;

    &.bee-button--primary {
      border-color: $color-primary;
      background: $color-primary;
    }

    &.bee-button--info {
      // hover状态下，info 类型在背景色的基础上添加10%的白色
      border-color: rgba(#fff, 0.1);
      background: rgba(#fff, 0.1);
    }

    &.bee-button--success {
      border-color: $color-success;
      background: $color-success;
    }

    &.bee-button--warning {
      border-color: $color-warning;
      background: $color-warning;
    }

    &.bee-button--danger {
      border-color: $color-danger;
      background: $color-danger;
    }
  }

  // active 状态
  &:active:not(.is-disabled, .is-loading) {
    color: $text-regular;

    &.bee-button--primary {
      border-color: color.adjust($color-primary, $lightness: -10%);
      background: color.adjust($color-primary, $lightness: -10%);
    }

    &.bee-button--info {
      // active状态下，info 类型在背景色的基础上添加20%的白色
      border-color: rgba(#fff, 0.2);
      background: rgba(#fff, 0.2);
    }

    &.bee-button--success {
      border-color: color.adjust($color-success, $lightness: -10%);
      background: color.adjust($color-success, $lightness: -10%);
    }

    &.bee-button--warning {
      border-color: color.adjust($color-warning, $lightness: -10%);
      background: color.adjust($color-warning, $lightness: -10%);
    }

    &.bee-button--danger {
      border-color: color.adjust($color-danger, $lightness: -10%);
      background: color.adjust($color-danger, $lightness: -10%);
    }
  }

  // 圆形状态
  &.is-circle {
    width: 32px;
    padding: 0;
  }

  // disabled 状态
  &.is-disabled {
    border-color: currentcolor;
    color: $text-disabled;
    background: none;
    cursor: not-allowed;
  }

  // loading 状态
  &.is-loading {
    color: $text-regular;
    cursor: wait;
  }

  // 无边框状态
  &.is-borderless {
    border: none;

    &.is-disabled {
      border: none;
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
