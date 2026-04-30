<template>
  <div class="bee-alert" :class="[`bee-alert--${type}`, { 'is-show-icon': showIcon }]">
    <BeeIcon v-if="showIcon" :icon="iconComponent" :size="14" class="bee-alert__icon" />
    <span v-if="label" class="bee-alert__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { InfoFilled, CircleCheckFilled, WarningFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeAlert' })

const props = withDefaults(
  defineProps<{
    type?: 'info' | 'success' | 'warning' | 'error'
    label?: string
    showIcon?: boolean
  }>(),
  {
    type: 'info',
    label: '',
    showIcon: true
  }
)

const iconComponent = computed(() => {
  const iconMap = {
    info: InfoFilled,
    success: CircleCheckFilled,
    warning: WarningFilled,
    error: CircleCloseFilled
  }
  return iconMap[props.type]
})
</script>

<style lang="scss" scoped>
.bee-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: rgba($color-primary, 0.1);
  border: 1px solid rgba($color-primary, 0.3);

  &--success {
    background-color: rgba($color-success, 0.1);
    border-color: rgba($color-success, 0.3);
  }

  &--warning {
    background-color: rgba($color-warning, 0.1);
    border-color: rgba($color-warning, 0.3);
  }

  &--error {
    background-color: rgba($color-danger, 0.1);
    border-color: rgba($color-danger, 0.3);
  }

  &__icon {
    flex-shrink: 0;
    color: $color-primary;
  }

  &__label {
    font-size: 12px;
    color: $color-primary;
  }
}
</style>
