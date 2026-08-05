<template>
  <div class="bee-pod-info-cell">
    <div class="bee-pod-info-cell__icon">
      <BeeIcon :name="icon" :size="iconSize" />
    </div>
    <div class="bee-pod-info-cell__content">
      <div class="bee-pod-info-cell__top">
        <BeeTooltip :label="uid">
          <BeeTag type="primary" size="tiny">UID</BeeTag>
        </BeeTooltip>
        <span class="bee-pod-info-cell__name">{{ name }}</span>
        <BeeIcon
          name="basic-copy"
          :size="14"
          class="bee-pod-info-cell__copy-icon"
          @click.stop="useClipboard().copy(props.name)"
        />
      </div>
      <div class="bee-pod-info-cell__bottom">
        <span class="bee-pod-info-cell__ip">{{ ip || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Pod 信息单元格组件
 * 上下结构展示 Pod 名称（支持复制）和 IP 信息
 * @module components/BeePodInfoCell
 */
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import BeeTooltip from '@/components/BeeTooltip/index.vue'

import { useClipboard } from '@/composables/useClipboard'

defineOptions({ name: 'BeePodInfoCell' })

const props = withDefaults(
  defineProps<{
    /** 左侧图标名称 */
    icon?: string
    /** 左侧图标大小 */
    iconSize?: number
    /** Kubernetes 资源 UID，hover UID 标签时显示完整 UID */
    uid: string
    /** Pod 名称 */
    name: string
    /** Pod IP */
    ip?: string
  }>(),
  {
    icon: 'kubernetes-pod',
    iconSize: 32,
    ip: '',
  },
)
</script>

<style lang="scss" scoped>
.bee-pod-info-cell {
  display: flex;
  gap: $spacing-8;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;

  &__icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
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

  &__ip {
    display: block;
    overflow: hidden;
    font-size: $font-size-12;
    color: $color-text-tertiary;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
