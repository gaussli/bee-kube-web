<template>
  <div class="bee-alert" :class="[`bee-alert--${type}`, { 'is-show-icon': showIcon }]">
    <BeeIcon v-if="showIcon" :name="iconName" :size="12" class="bee-alert__icon" />
    <span v-if="label" class="bee-alert__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeAlert' })

const props = withDefaults(
  defineProps<{
    type?: 'primary' | 'info' | 'success' | 'warning' | 'danger'
    label?: string
    showIcon?: boolean
  }>(),
  {
    type: 'primary',
    label: '',
    showIcon: true
  }
)

const iconName = computed(() => {
  const iconMap = {
    primary: 'basic-primary-filled',
    info: 'basic-info-filled',
    success: 'basic-success-filled',
    warning: 'basic-warning-filled',
    danger: 'basic-danger-filled'
  }
  return iconMap[props.type]
})
</script>

<style lang="scss" scoped>
.bee-alert {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
  padding: $spacing-sm;
  border: 1px solid;
  border-radius: $radius-sm;
  font-size: $font-size-sm;

  &--primary {
    border-color: rgba($color-primary, 0.3);
    color: $color-primary;
    background: rgba($color-primary, 0.1);
  }

  &--info {
    border-color: rgba($color-info, 0.3);
    color: $text-primary;
    background: rgba($color-info, 0.1);
  }

  &--success {
    border-color: rgba($color-success, 0.3);
    color: $color-success;
    background: rgba($color-success, 0.1);
  }

  &--warning {
    border-color: rgba($color-warning, 0.3);
    color: $color-warning;
    background-color: rgba($color-warning, 0.1);
  }

  &--danger {
    border-color: rgba($color-danger, 0.3);
    color: $color-danger;
    background-color: rgba($color-danger, 0.1);
  }
}
</style>
