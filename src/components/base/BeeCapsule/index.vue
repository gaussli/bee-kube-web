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
 * @param e
 * @description copyable 为 false 时直接返回；优先复制 copyLabel，缺省复制 label
 */
async function handleCopy(e: MouseEvent) {
  if (!props.copyable) return
  e.stopPropagation()
  await useClipboard().copy(props.copyLabel || props.label)
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-capsule {
  /* stylelint-disable order/custom-properties-alphabetical-order */
  --bee-capsule-height: 28px;
  --bee-capsule-padding: 0 10px;
  --bee-capsule-font-size: 13px;
  --bee-capsule-color: #{map.get($color, 'default', 'text', base)};
  --bee-capsule-color-border: #{map.get($color, 'default', 'border', 'base')};

  @each $type in (primary, success, warning, danger) {
    &.bee-capsule--#{$type} {
      --bee-capsule-color: #{map.get($color, $type, 'text', 'base')};
      --bee-capsule-color-border: #{map.get($color, $type, 'border', 'base')};
    }
  }

  &.bee-capsule--tiny {
    --bee-capsule-height: 18px;
    --bee-capsule-padding: 0 6px;
    --bee-capsule-font-size: 10px;
  }

  &.bee-capsule--small {
    --bee-capsule-height: 24px;
    --bee-capsule-padding: 0 8px;
    --bee-capsule-font-size: 12px;
  }

  &.bee-capsule--large {
    --bee-capsule-height: 32px;
    --bee-capsule-padding: 0 12px;
    --bee-capsule-font-size: 14px;
  }

  /* stylelint-enable order/custom-properties-alphabetical-order */
  display: flex;
  flex-direction: row;
  align-items: center;
  height: var(--bee-capsule-height);
  max-width: 100%;
  padding: var(--bee-capsule-padding);
  border: 1px solid;
  border-color: var(--bee-capsule-color-border);
  border-radius: 9999px;
  font-size: var(--bee-capsule-font-size);
  color: var(--bee-capsule-color);

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover.is-copyable {
    cursor: pointer;
  }
}
</style>
