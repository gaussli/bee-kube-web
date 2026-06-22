<template>
  <div class="bee-cluster-column">
    <div class="bee-cluster-column__cluster-icon">
      <BeeIcon name="kubernetes-cluster" />
    </div>
    <div class="bee-cluster-column__content">
      <div class="bee-cluster-column__top">
        <span class="bee-cluster-column__name">{{ name }}</span>
        <BeeTooltip :label="clusterId">
          <BeeTag type="info">UID</BeeTag>
        </BeeTooltip>
      </div>
      <div class="bee-cluster-column__bottom">
        <BeeIcon name="basic-description" :size="14" class="bee-cluster-column__icon" />
        <BeeTooltip :label="description">
          <span class="bee-cluster-column__desc">{{ description }}</span>
        </BeeTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 集群基础列组件
 * 上下结构展示集群名称+UID标签 和 描述信息
 * @module components/BeeClusterColumn
 */
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import BeeTooltip from '@/components/BeeTooltip/index.vue'

defineOptions({ name: 'BeeClusterColumn' })

defineProps<{
  /** 集群名称 */
  name: string
  /** 集群 ID，hover UID 标签时显示 */
  clusterId: string
  /** 集群描述 */
  description?: string
}>()
</script>

<style lang="scss" scoped>
.bee-cluster-column {
  display: flex;
  gap: $spacing-8;
  flex-direction: row;
  width: 100%;
  height: auto;

  &__cluster-icon {
    flex-shrink: 0;
    height: 46px;
    aspect-ratio: 1;
    color: var(--bee-row-selected-icon-color, $color-text-secondary);

    :deep(.bee-icon) {
      width: 100%;
      height: 100%;
      max-width: none;
    }
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

  &__bottom {
    display: flex;
    gap: $spacing-4;
    align-items: center;
    min-width: 0;

    :deep(.bee-tooltip-trigger) {
      min-width: 0;
      overflow: hidden;
    }
  }

  &__icon {
    flex-shrink: 0;
    color: $color-text-secondary;
  }

  &__desc {
    overflow: hidden;
    font-size: $font-size-12;
    color: $color-text-secondary;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
