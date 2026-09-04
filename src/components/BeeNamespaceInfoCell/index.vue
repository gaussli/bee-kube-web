<template>
  <div class="bee-namespace-info-cell">
    <div class="bee-namespace-info-cell__icon">
      <BeeIcon name="kubernetes-namespace" :size="iconSize" />
    </div>
    <div class="bee-namespace-info-cell__content">
      <div class="bee-namespace-info-cell__top">
        <BeeTooltip :label="id">
          <BeeTag size="tiny" type="primary">UID</BeeTag>
        </BeeTooltip>
        <span class="bee-namespace-info-cell__name">{{ name }}</span>
        <BeeIcon
          class="bee-namespace-info-cell__copy-icon"
          name="basic-copy"
          :size="14"
          @click.stop="useClipboard().copy(props.name)"
        />
      </div>
      <div class="bee-namespace-info-cell__bottom">
        <span class="bee-namespace-info-cell__desc">{{ description || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 命名空间信息单元格组件
 * 上下结构展示命名空间名称（支持复制）和描述信息
 * @module components/BeeNamespaceInfoCell
 */
import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import BeeTooltip from '@/components/BeeTooltip/index.vue'

import { useClipboard } from '@/composables/useClipboard'

defineOptions({ name: 'BeeNamespaceInfoCell' })

const props = withDefaults(
  defineProps<{
    /** 左侧图标大小 */
    iconSize?: number
    /** 命名空间 ID，hover UID 标签时显示 */
    id: string
    /** 命名空间名称 */
    name: string
    /** 命名空间描述 */
    description?: string
  }>(),
  {
    iconSize: 48,
    description: '',
  },
)
</script>

<style lang="scss" scoped>
.bee-namespace-info-cell {
  display: flex;
  gap: $spacing-8;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;

  &__icon {
    flex-shrink: 0;
    color: var(--bee-row-selected-icon-color, $color-text-secondary);
  }

  &__content {
    display: flex;
    gap: $spacing-8;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  &__top {
    display: flex;
    gap: $spacing-8;
    align-items: center;
  }

  &__name {
    font-size: $font-size-14;
    color: $color-text-primary;
    white-space: nowrap;
  }

  &__copy-icon {
    flex-shrink: 0;
    color: $color-text-tertiary;
    opacity: 0;
    cursor: pointer;
    transition: opacity 0.15s;

    &:hover {
      color: $color-primary;
    }
  }

  &:hover &__copy-icon {
    opacity: 1;
  }

  &__bottom {
    min-width: 0;
  }

  &__desc {
    display: block;
    overflow: hidden;
    font-size: $font-size-12;
    color: $color-text-tertiary;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
