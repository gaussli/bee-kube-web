<template>
  <div class="bee-tag" :class="[`bee-tag--${type}`]">
    <span> <slot /></span>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'BeeTag' })

withDefaults(
  defineProps<{
    type?: 'primary' | 'info' | 'success' | 'warning' | 'danger'
  }>(),
  {
    type: 'primary'
  }
)
</script>

<style lang="scss" scoped>
.bee-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 $spacing-sm;
  border: 1px solid;
  border-radius: $radius-full;
  font-size: $font-size-sm;
  white-space: nowrap;

  &--primary {
    border-color: rgba($color-primary, 0.3);
    color: $color-primary;
    background: rgba($color-primary, 0.1);
  }

  &--info {
    border-color: rgba($color-info, 0.3);
    color: $color-info;
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
    background: rgba($color-warning, 0.1);
  }

  &--danger {
    border-color: rgba($color-danger, 0.3);
    color: $color-danger;
    background: rgba($color-danger, 0.1);
  }
}
</style>
