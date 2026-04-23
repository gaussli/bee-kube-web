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
.bee-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  gap: 4px;
  padding: 4px 12px;
  border: 1px solid $border-secondary;
  border-radius: 16px;
  background: transparent;
  color: $text-secondary;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;

  &__icon.is-loading {
    animation: rotating 2s linear infinite;
  }

  // hover 状态
  &:hover:not(.is-disabled):not(.is-loading) {
    background: $color-primary;
    border-color: $color-primary;
    color: $text-regular;

    &.bee-button--success {
      background: $color-success;
      border-color: $color-success;
    }

    &.bee-button--warning {
      background: $color-warning;
      border-color: $color-warning;
    }

    &.bee-button--danger {
      background: $color-danger;
      border-color: $color-danger;
    }

    &.bee-button--info {
      background: $color-info;
      border-color: $color-info;
    }

    &.bee-button--default {
      background: rgba(#fff, 0.1);
      border-color: rgba(#fff, 0.1);
    }
  }

  // active 状态
  &:active:not(.is-disabled):not(.is-loading) {
    background: darken($color-primary, 10%);
    border-color: darken($color-primary, 10%);
    color: $text-regular;

    &.bee-button--success {
      background: darken($color-success, 10%);
      border-color: darken($color-success, 10%);
    }

    &.bee-button--warning {
      background: darken($color-warning, 10%);
      border-color: darken($color-warning, 10%);
    }

    &.bee-button--danger {
      background: darken($color-danger, 10%);
      border-color: darken($color-danger, 10%);
    }

    &.bee-button--info {
      background: darken($color-info, 10%);
      border-color: darken($color-info, 10%);
    }

    &.bee-button--default {
      background: rgba(#fff, 0.2);
      border-color: rgba(#fff, 0.2);
    }
  }

  // disabled 状态
  &.is-disabled {
    background: transparent;
    border-color: $border-disabled;
    color: $text-disabled;
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
