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
  border-radius: 12px;
  border: 1px solid;
  font-size: $font-size-sm;

  &--default {
    background: transparent;
    color: $text-secondary;
    border-color: $border-secondary;
  }

  &--primary {
    background: transparent;
    color: $color-primary;
    border-color: $color-primary;
  }

  &--success {
    background: transparent;
    color: $color-success;
    border-color: $color-success;
  }

  &--warning {
    background: transparent;
    color: $color-warning;
    border-color: $color-warning;
  }

  &--danger {
    background: transparent;
    color: $color-danger;
    border-color: $color-danger;
  }

  &--info {
    background: transparent;
    color: $color-info;
    border-color: $color-info;
  }
}
</style>
