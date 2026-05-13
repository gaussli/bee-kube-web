<template>
  <BeeTooltip v-if="isCircle && tooltip" :label="tooltip" placement="top">
    <button
      class="bee-button"
      :class="[`bee-button--${type}`, { 'is-disabled': disabled, 'is-loading': loading, 'is-borderless': !border, 'is-circle': isCircle }]"
      :disabled="disabled || loading"
      @click="handleClick"
    >
      <BeeIcon v-if="loading" name="basic-loading" :size="12" class="bee-button__icon is-loading" />
      <BeeIcon v-else-if="icon" :name="icon" :size="12" class="bee-button__icon" />
      <span v-if="$slots.default" class="bee-button__label">
        <slot />
      </span>
    </button>
  </BeeTooltip>
  <button
    v-else
    class="bee-button"
    :class="[`bee-button--${type}`, { 'is-disabled': disabled, 'is-loading': loading, 'is-borderless': !border, 'is-circle': isCircle }]"
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
import { computed, ref, useSlots } from 'vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeTooltip from '@/components/BeeTooltip/index.vue'

defineOptions({ name: 'BeeButton' })

const props = withDefaults(
  defineProps<{
    type?: 'primary' | 'info' | 'success' | 'warning' | 'danger'
    disabled?: boolean
    border?: boolean
    icon?: string
    tooltip?: string
  }>(),
  {
    type: 'primary',
    disabled: false,
    border: true,
    tooltip: ''
  }
)

const emit = defineEmits<{
  click: [event: Event]
}>()

const slots = useSlots()

// 判断是否有默认插槽内容（按钮有文字时不需要 tooltip）
const hasDefaultSlot = computed(() => !!slots.default?.())

// 圆形按钮 = 没有默认插槽内容
const isCircle = computed(() => !hasDefaultSlot.value)

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
  padding: 0 $spacing-md;
  border: 1px solid currentcolor;
  border-radius: $radius-full;
  font-size: $font-size-sm;
  color: $text-secondary;
  white-space: nowrap;
  background: transparent;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;

  &__icon.is-loading {
    animation: rotating 2s linear infinite;
  }

  // hover 状态
  &:hover:not(.is-disabled, .is-loading) {
    &.bee-button--primary {
      border-color: rgba($color-primary, 0.4);
      color: $color-primary;
      background: rgba($color-primary, 0.2);
    }

    &.bee-button--info {
      border-color: rgba($color-info, 0.4);
      color: $color-info;
      background: rgba($color-info, 0.2);
    }

    &.bee-button--success {
      border-color: rgba($color-success, 0.4);
      color: $color-success;
      background: rgba($color-success, 0.2);
    }

    &.bee-button--warning {
      border-color: rgba($color-warning, 0.4);
      color: $color-warning;
      background: rgba($color-warning, 0.2);
    }

    &.bee-button--danger {
      border-color: rgba($color-danger, 0.4);
      color: $color-danger;
      background: rgba($color-danger, 0.2);
    }
  }

  // active 状态
  &:active:not(.is-disabled, .is-loading),
  &.is-loading {
    &.bee-button--primary {
      border-color: rgba($color-primary, 0.3);
      color: $color-primary;
      background: rgba($color-primary, 0.1);
    }

    &.bee-button--info {
      border-color: rgba($color-info, 0.3);
      color: $color-info;
      background: rgba($color-info, 0.1);
    }

    &.bee-button--success {
      border-color: rgba($color-success, 0.3);
      color: $color-success;
      background: rgba($color-success, 0.1);
    }

    &.bee-button--warning {
      border-color: rgba($color-warning, 0.3);
      color: $color-warning;
      background: rgba($color-warning, 0.1);
    }

    &.bee-button--danger {
      border-color: rgba($color-danger, 0.3);
      color: $color-danger;
      background: rgba($color-danger, 0.1);
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
