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
    type?: 'info' | 'success' | 'warning' | 'danger'
    label?: string
    showIcon?: boolean
  }>(),
  {
    type: 'info',
    label: '',
    showIcon: true
  }
)

const iconName = computed(() => {
  const iconMap = {
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
  gap: 8px;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid rgba($color-primary, 0.3);
  border-radius: 8px;
  font-size: $font-size-sm;
  color: $color-primary;
  background: rgba($color-primary, 0.1);

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
