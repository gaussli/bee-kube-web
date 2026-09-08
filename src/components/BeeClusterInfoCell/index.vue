<template>
  <div class="bee-cluster-info-cell">
    <div class="bee-cluster-info-cell__icon">
      <BeeIcon name="kubernetes-cluster" />
    </div>
    <div class="bee-cluster-info-cell__content">
      <div class="content-top">
        <BeeTooltip :tooltip="uid">
          <BeeCapsule label="UID" size="tiny" />
        </BeeTooltip>
        <BeeEllipsisTooltipLabel :label="name" />
        <BeeIcon name="basic-copy" />
      </div>
      <div class="content-bottom">
        <BeeIcon name="basic-description" />
        <BeeEllipsisTooltipLabel :label="description" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BeeCapsule from '@/components/base/BeeCapsule/index.vue'
import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeTooltip from '@/components/base/BeeTooltip/index.vue'
import BeeEllipsisTooltipLabel from '@/components/business/BeeEllipsisTooltipLabel/index.vue'

defineOptions({ name: 'BeeClusterInfoCell' })

withDefaults(
  defineProps<{
    /** 集群 UID，hover UID 标签时显示 */
    uid: string
    /** 集群名称 */
    name: string
    /** 集群描述 */
    description?: string
  }>(),
  { description: '-' },
)
</script>

<style lang="scss" scoped>
.bee-cluster-info-cell {
  display: flex;
  gap: $spacing-8;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;

  &__icon {
    font-size: 48px;
    color: var(--bee-row-selected-icon-color, $color-text-secondary);
  }

  &__content {
    display: flex;
    gap: 8px;
    flex-direction: column;
    flex: 1;
    min-width: 0;

    .content-top {
      display: flex;
      gap: 8px;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      font-size: 14px;
      color: $color-text-primary;
    }

    .content-bottom {
      display: flex;
      gap: 4px;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      font-size: 12px;
      color: $color-text-third;
    }
  }
}
</style>
