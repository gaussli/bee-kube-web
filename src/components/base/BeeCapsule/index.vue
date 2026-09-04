<template>
  <div class="bee-capsule" :class="[typeClass, sizeClass]" @click="handleCopy(text)">
    <span>{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useClipboard } from '@/composables/useClipboard'

// ==================== Props ====================
const props = withDefaults(
  defineProps<{
    text: string
    type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
    size?: 'default' | 'small' | 'large'
  }>(),
  {
    type: 'default',
    size: 'default',
  },
)

// ==================== Reactive State ====================
const typeClass = computed(() => (props.type !== 'default' ? `bee-capsule--${props.type}` : ''))
const sizeClass = computed(() => (props.size !== 'default' ? `bee-capsule--${props.size}` : ''))

// ==================== Handler ====================
async function handleCopy(s: string) {
  await useClipboard().copy(s)
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

$types: primary, success, warning, danger;

.bee-capsule {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 28px;
  max-width: 100%;
  padding: 0 10px;
  border: 1px solid;
  border-color: map.get($colors-default, 'border', 'base');
  border-radius: 9999px;
  font-size: 13px;
  color: map.get($colors-default, 'text', 'base');

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    cursor: pointer;
  }

  &--small {
    height: 24px;
    padding: 0 8px;
    font-size: 12px;
  }

  &--large {
    height: 32px;
    padding: 0 12px;
    font-size: 14px;
  }

  @each $type in $types {
    $colors-type: map.get($color, $type);

    &.bee-capsule--#{$type} {
      border-color: var(--bee-capsule-color-border-#{$type}, map.get($colors-type, 'border', 'base'));
      color: var(--bee-capsule-color-text-#{$type}, map.get($colors-type, 'text', 'base'));
    }
  }
}
</style>
