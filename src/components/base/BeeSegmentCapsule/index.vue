<template>
  <div class="bee-segment-capsule" :class="[typeClass, sizeClass, copyableClass]">
    <span class="bee-segment-capsule__label" @click="e => handleCopy(e, label)">{{ label }}</span>
    <span class="bee-segment-capsule__divider"></span>
    <span class="bee-segment-capsule__sublabel" @click="e => handleCopy(e, sublabel)">{{ sublabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { BeeType } from '@/config'

import { useClipboard } from '@/composables/useClipboard'

defineOptions({ name: 'BeeSegmentCapsule' })

// ==================== Prop ====================
const props = withDefaults(
  defineProps<{
    /** 主文本（左侧段落），点击可复制 */
    label: string
    /** 副文本（右侧段落），点击可复制 */
    sublabel: string
    /** 胶囊配色，与 BeeCapsule 一致 */
    type?: BeeType
    /** 胶囊尺寸，与 BeeCapsule 一致 */
    size?: 'default' | 'tiny' | 'small' | 'large'
    /** 是否开启点击复制，false 时仅作展示并去掉鼠标手型 */
    copyable?: boolean
  }>(),
  {
    type: 'default',
    size: 'default',
    copyable: true,
  },
)

// ==================== Reactive State ====================
const typeClass = computed(() => (props.type !== 'default' ? `bee-segment-capsule--${props.type}` : ''))
const sizeClass = computed(() => (props.size !== 'default' ? `bee-segment-capsule--${props.size}` : ''))
const copyableClass = computed(() => (props.copyable ? 'is-copyable' : ''))

// ==================== Handler ====================
/**
 * 复制文本到剪贴板
 * @param e
 * @param text - 待复制的文本
 */
async function handleCopy(e: MouseEvent, text: string) {
  if (!props.copyable) return
  e.stopPropagation()
  await useClipboard().copy(text)
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-segment-capsule {
  /* stylelint-disable order/custom-properties-alphabetical-order */
  --bee-segment-capsule-height: 28px;
  --bee-segment-capsule-padding: 0 10px;
  --bee-segment-capsule-font-size: 13px;
  --bee-segment-capsule-color: #{map.get($color, 'default', 'text', 'base')};
  --bee-segment-capsule-color-border: #{map.get($color, 'default', 'border', 'base')};

  @each $type in (primary, success, warning, danger) {
    &.bee-segment-capsule--#{$type} {
      --bee-segment-capsule-color: #{map.get($color, $type, 'text', 'base')};
      --bee-segment-capsule-color-border: #{map.get($color, $type, 'border', 'base')};
    }
  }

  &.bee-segment-capsule--tiny {
    --bee-segment-capsule-height: 18px;
    --bee-segment-capsule-padding: 0 6px;
    --bee-segment-capsule-font-size: 10px;
  }

  &.bee-segment-capsule--small {
    --bee-segment-capsule-height: 24px;
    --bee-segment-capsule-padding: 0 8px;
    --bee-segment-capsule-font-size: 12px;
  }

  &.bee-segment-capsule--large {
    --bee-segment-capsule-height: 32px;
    --bee-segment-capsule-padding: 0 12px;
    --bee-segment-capsule-font-size: 14px;
  }

  /* stylelint-enable order/custom-properties-alphabetical-order */
  display: inline-flex;
  flex-direction: row;
  align-items: stretch;
  height: var(--bee-segment-capsule-height);
  max-width: 100%;
  padding: 0;
  border: 1px solid;
  border-color: var(--bee-segment-capsule-color-border);
  border-radius: 9999px;
  overflow: hidden;
  font-size: var(--bee-segment-capsule-font-size);
  color: var(--bee-segment-capsule-color);

  &__label,
  &__sublabel {
    display: flex;
    align-items: center;
    min-width: 0;
    padding: var(--bee-segment-capsule-padding);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__divider {
    flex-shrink: 0;
    align-self: stretch;
    width: 1px;
    background: var(--bee-segment-capsule-color-border);
  }

  &:hover.is-copyable {
    cursor: pointer;
  }
}
</style>
