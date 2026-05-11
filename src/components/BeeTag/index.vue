<template>
  <div class="bee-tag" :class="[`bee-tag--${type}`]">
    <span> <slot /></span>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'BeeTag' })

withDefaults(
  defineProps<{
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  }>(),
  {
    type: 'default'
  }
)
</script>

<style lang="scss" scoped>
.bee-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 8px;
  border: 1px solid;
  border-radius: 12px;
  font-size: $font-size-sm;

  &--default {
    border-color: $border-secondary;
    color: $text-secondary;
    background: transparent;
  }

  &--primary {
    border-color: $color-primary;
    color: $color-primary;
    background: transparent;
  }

  &--success {
    border-color: $color-success;
    color: $color-success;
    background: transparent;
  }

  &--warning {
    border-color: $color-warning;
    color: $color-warning;
    background: transparent;
  }

  &--danger {
    border-color: $color-danger;
    color: $color-danger;
    background: transparent;
  }

  &--info {
    border-color: $color-info;
    color: $color-info;
    background: transparent;
  }
}
</style>
