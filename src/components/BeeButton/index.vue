<template>
  <button class="bee-button" :class="[`bee-button--${type}`, { 'is-disabled': disabled, 'is-loading': loading, 'is-borderless': !border }]" :disabled="disabled || loading" @click="handleClick">
    <el-icon v-if="loading" class="bee-button__icon is-loading">
      <Loading />
    </el-icon>
    <el-icon v-else-if="$slots.icon" class="bee-button__icon">
      <slot name="icon" />
    </el-icon>
    <span v-if="$slots.default" class="bee-button__text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'

defineOptions({ name: 'BeeButton' })

withDefaults(
  defineProps<{
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
    disabled?: boolean
    border?: boolean
  }>(),
  {
    type: 'default',
    disabled: false,
    border: true
  }
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
@use 'sass:color';

.bee-button {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 4px 12px;
  border: 1px solid $border-secondary;
  border-radius: 16px;
  font-size: 12px;
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
    border-color: $color-primary;
    color: $text-regular;
    background: $color-primary;

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

    &.bee-button--info {
      border-color: $color-info;
      background: $color-info;
    }

    &.bee-button--default {
      border-color: rgba(#fff, 0.1);
      background: rgba(#fff, 0.1);
    }
  }

  // active 状态
  &:active:not(.is-disabled, .is-loading) {
    border-color: color.adjust($color-primary, $lightness: -10%);
    color: $text-regular;
    background: color.adjust($color-primary, $lightness: -10%);

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

    &.bee-button--info {
      border-color: color.adjust($color-info, $lightness: -10%);
      background: color.adjust($color-info, $lightness: -10%);
    }

    &.bee-button--default {
      border-color: rgba(#fff, 0.2);
      background: rgba(#fff, 0.2);
    }
  }

  // disabled 状态
  &.is-disabled {
    border-color: $border-disabled;
    color: $text-disabled;
    background: transparent;
    cursor: not-allowed;
  }

  // loading 状态
  &.is-loading {
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
