<template>
  <div class="bee-segment-capsule" :class="[typeClass, sizeClass, copyableClass]">
    <span class="bee-segment-capsule__label" @click="handleCopy(label)">{{ label }}</span>
    <template v-if="sublabel">
      <span class="bee-segment-capsule__divider"></span>
      <span class="bee-segment-capsule__sublabel" @click="handleCopy(sublabel)">{{ sublabel }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * BeeSegmentCapsule 分段胶囊
 * @module components/base/BeeSegmentCapsule
 * @description 在 BeeCapsule 基础上增加副文本 `sublabel`，两段横向并排并由贯穿全高的分隔线分隔；
 *              `copyable` 为 true 时点击左侧复制 `label`、点击右侧复制 `sublabel`。
 */
import { computed } from 'vue'

import type { BeeType } from '@/config'

import { useClipboard } from '@/composables/useClipboard'

defineOptions({ name: 'BeeSegmentCapsule' })

// ==================== Prop ====================
const props = withDefaults(
  defineProps<{
    /** 主文本（左侧段落），点击可复制 */
    label: string
    /** 副文本（右侧段落），点击可复制；不传则不渲染分隔线与右侧段落 */
    sublabel?: string
    /** 胶囊配色，与 BeeCapsule 一致 */
    type?: BeeType
    /** 胶囊尺寸，与 BeeCapsule 一致 */
    size?: 'default' | 'tiny' | 'small' | 'large'
    /** 是否开启点击复制，false 时仅作展示并去掉鼠标手型 */
    copyable?: boolean
  }>(),
  {
    sublabel: '',
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
 * @param text - 待复制的文本
 */
async function handleCopy(text: string) {
  if (!props.copyable || !text) return
  await useClipboard().copy(text)
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

$types: primary, success, warning, danger;

/**
 * 布局要点：外层 `padding: 0` + `align-items: stretch`，内边距下放到两段，
 * 分隔线用 `align-self: stretch` 撑满内容盒高度，从而与组件高度一致。
 * 主题变量：`--bee-segment-capsule-color-border-{type}`、`--bee-segment-capsule-color-text-{type}` 可覆盖配色，
 *          `--bee-segment-capsule-color-sublabel` 可覆盖副文本颜色。
 */
.bee-segment-capsule {
  display: inline-flex;
  flex-direction: row;
  align-items: stretch;
  height: 28px;
  max-width: 100%;
  padding: 0;
  border: 1px solid;
  border-color: var(--bee-segment-capsule-color-border-default, map.get($colors-default, 'border', 'base'));
  border-radius: 9999px;
  overflow: hidden;
  font-size: 13px;
  color: var(--bee-segment-capsule-color-text-default, map.get($colors-default, 'text', 'base'));

  &__label,
  &__sublabel {
    display: flex;
    align-items: center;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__label {
    flex-shrink: 1;
    padding: 0 10px;
  }

  &__sublabel {
    flex-shrink: 2;
    padding: 0 10px;
    color: var(--bee-segment-capsule-color-sublabel, $color-text-third);
  }

  &__divider {
    flex-shrink: 0;
    align-self: stretch;
    width: 1px;
    background: var(--bee-segment-capsule-color-border-default, map.get($colors-default, 'border', 'base'));
  }

  &:hover.is-copyable {
    cursor: pointer;
  }

  &--tiny {
    height: 18px;
    font-size: 10px;

    .bee-segment-capsule__label,
    .bee-segment-capsule__sublabel {
      padding: 0 6px;
    }
  }

  &--small {
    height: 24px;
    font-size: 12px;

    .bee-segment-capsule__label,
    .bee-segment-capsule__sublabel {
      padding: 0 8px;
    }
  }

  &--large {
    height: 32px;
    font-size: 14px;

    .bee-segment-capsule__label,
    .bee-segment-capsule__sublabel {
      padding: 0 12px;
    }
  }

  @each $type in $types {
    $colors-type: map.get($color, $type);

    &.bee-segment-capsule--#{$type} {
      border-color: var(--bee-segment-capsule-color-border-#{$type}, map.get($colors-type, 'border', 'base'));
      color: var(--bee-segment-capsule-color-text-#{$type}, map.get($colors-type, 'text', 'base'));

      .bee-segment-capsule__divider {
        background: var(--bee-segment-capsule-color-border-#{$type}, map.get($colors-type, 'border', 'base'));
      }
    }
  }
}
</style>
