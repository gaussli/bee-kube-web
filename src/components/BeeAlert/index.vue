<template>
  <div class="bee-alert" :class="`bee-alert--${type}`">
    <BeeIcon v-if="showIcon" :name="iconName" :size="12" class="bee-alert__icon" />
    <span v-if="label" class="bee-alert__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * 提示条组件
 * 支持 default / primary / success / warning / danger 五种类型，可配图标与文本
 * @module components/BeeAlert
 */
import { computed } from 'vue'

import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeAlert' })

/** Alert 类型 */
type AlertType = 'primary' | 'default' | 'success' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{
    type?: AlertType
    label?: string
    showIcon?: boolean
  }>(),
  {
    type: 'default',
    label: '',
    showIcon: true,
  },
)

/** Alert 类型 → 图标名称映射 */
const iconMap: Record<AlertType, string> = {
  default: 'basic-info-filled',
  primary: 'basic-primary-filled',
  success: 'basic-success-filled',
  warning: 'basic-warning-filled',
  danger: 'basic-danger-filled',
}

const iconName = computed(() => iconMap[props.type])
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-alert {
  display: flex;
  gap: $spacing-8;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: var(--bee-alert-height, 32px);
  padding: 0 $spacing-16;
  border: 1px solid var(--bee-alert-border-color);
  border-radius: $radius-full;
  font-size: $font-size-12;
  color: var(--bee-alert-color);
  background: var(--bee-alert-bg);

  &--default {
    --bee-alert-bg: #{rgba(map.get($colors, 'gray', 90), 0.1)};
    --bee-alert-border-color: #{map.get($colors, 'gray', 90)};
    --bee-alert-color: #{map.get($colors, 'gray', 90)};
  }

  &--primary {
    --bee-alert-bg: #{rgba(map.get($colors, 'primary', 50), 0.1)};
    --bee-alert-border-color: #{map.get($colors, 'primary', 50)};
    --bee-alert-color: #{map.get($colors, 'primary', 50)};
  }

  &--success {
    --bee-alert-bg: #{rgba(map.get($colors, 'success', 50), 0.1)};
    --bee-alert-border-color: #{map.get($colors, 'success', 50)};
    --bee-alert-color: #{map.get($colors, 'success', 50)};
  }

  &--warning {
    --bee-alert-bg: #{rgba(map.get($colors, 'warning', 50), 0.1)};
    --bee-alert-border-color: #{map.get($colors, 'warning', 50)};
    --bee-alert-color: #{map.get($colors, 'warning', 50)};
  }

  &--danger {
    --bee-alert-bg: #{rgba(map.get($colors, 'danger', 50), 0.1)};
    --bee-alert-border-color: #{map.get($colors, 'danger', 50)};
    --bee-alert-color: #{map.get($colors, 'danger', 50)};
  }
}
</style>
