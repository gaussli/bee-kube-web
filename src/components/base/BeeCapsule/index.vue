<template>
  <div class="bee-capsule" :class="[typeClass, sizeClass, copyableClass]" @click="handleCopy">
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { BeeType } from '@/config'

import { useClipboard } from '@/composables/useClipboard'

// ==================== Prop ====================
const props = withDefaults(
  defineProps<{
    /** 胶囊展示文本 */
    label: string
    /** 胶囊配色，default 为灰白描边，其余按主题色渲染 */
    type?: BeeType
    /** 胶囊尺寸 */
    size?: 'default' | 'tiny' | 'small' | 'large'
    /** 复制标记，false 时不复制且不显示鼠标手型 */
    copyable?: boolean
    /** 点击复制的文本，缺省复制 label（用于展示值与复制值不一致的场景） */
    copyLabel?: string
  }>(),
  {
    type: 'default',
    size: 'default',
    copyable: true,
    copyLabel: undefined,
  },
)

// ==================== Reactive State ====================
/** 配色 class 名称 */
const typeClass = computed(() => (props.type !== 'default' ? `bee-capsule--${props.type}` : ''))
/** 尺寸 class 名称 */
const sizeClass = computed(() => (props.size !== 'default' ? `bee-capsule--${props.size}` : ''))
/** 可复制 class 名称，非可复制时 hover 不显示手型 */
const copyableClass = computed(() => (props.copyable ? 'is-copyable' : ''))

// ==================== Handler ====================
/**
 * 复制文本到剪贴板
 * @description copyable 为 false 时直接返回；优先复制 copyLabel，缺省复制 label
 */
async function handleCopy() {
  if (props.copyable) {
    await useClipboard().copy(props.copyLabel || props.label)
  }
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
  border-color: var(--bee-capsule-color-border-default, map.get($colors-default, 'border', 'base'));
  border-radius: 9999px;
  font-size: 13px;
  color: var(--bee-capsule-color-text-default, map.get($colors-default, 'text', 'base'));

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover.is-copyable {
    cursor: pointer;
  }

  &--tiny {
    height: 18px;
    padding: 0 6px;
    font-size: 10px;
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
