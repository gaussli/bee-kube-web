<template>
  <div class="bee-tag" :class="[`bee-tag--${type}`, `bee-tag--${size}`]">
    <span><slot /></span>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'BeeTag' })

withDefaults(
  defineProps<{
    /** Tag 类型 */
    type?: 'default' | 'primary' | 'warning' | 'danger'
    /** Tag 尺寸 */
    size?: 'large' | 'default' | 'small' | 'tiny'
  }>(),
  {
    type: 'default',
    size: 'default',
  },
)
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-tag {
  $tag-hover-colors: (
    'primary': map.get($colors, 'primary', 50),
    'warning': map.get($colors, 'warning', 50),
    'danger': map.get($colors, 'danger', 50),
  );
  $tag-sizes: (
    'large': (
      height: 40px,
      font-size: 16px,
      padding: 0 16px,
    ),
    'default': (
      height: 32px,
      font-size: 14px,
      padding: 0 12px,
    ),
    'small': (
      height: 24px,
      font-size: 12px,
      padding: 0 8px,
    ),
    'tiny': (
      height: 18px,
      font-size: 10px,
      padding: 0 6px,
    ),
  );

  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $color-border-secondary;
  border-radius: $radius-full;
  color: $color-text-secondary;
  white-space: nowrap;
  background: transparent;

  @each $size, $props in $tag-sizes {
    &--#{$size} {
      height: map.get($props, height);
      padding: map.get($props, padding);
      font-size: map.get($props, font-size);
    }
  }

  &:hover {
    border-color: $color-border-primary;
    color: $color-text-primary;
  }

  @each $type, $color in $tag-hover-colors {
    &--#{$type}:hover {
      border-color: #{$color};
      color: #{$color};
    }
  }
}
</style>
