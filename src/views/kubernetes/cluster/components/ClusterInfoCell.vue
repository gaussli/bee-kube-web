<template>
  <div class="cluster-info-cell">
    <!-- 左部分：集群图标 -->
    <div class="cluster-info-cell__icon">
      <BeeIcon :name="CLUSTER_PAGE_META.icon" />
    </div>
    <!-- 右部分：集群基础信息（UID、名称、描述） -->
    <div class="cluster-info-cell__content">
      <div class="content-top">
        <BeeTooltip :tooltip="uid">
          <BeeCapsule label="UID" size="tiny" />
        </BeeTooltip>
        <BeeEllipsisTooltipLabel :label="name" />
        <BeeIcon class="content-top__icon-copy" name="basic-copy" @click.stop="handleCopy" />
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

import { useClipboard } from '@/composables/useClipboard'
import { CLUSTER_PAGE_META } from '@/config/kubernetes/cluster'

defineOptions({ name: 'ClusterInfoCell' })

// ==================== Prop ====================
const props = withDefaults(
  defineProps<{
    /** 集群 UID */
    uid: string
    /** 集群名称 */
    name: string
    /** 集群描述 */
    description?: string
  }>(),
  { description: '-' },
)

// ==================== Handler ====================
/**
 * 复制集群名称到剪贴板
 */
async function handleCopy() {
  await useClipboard().copy(props.name)
}
</script>

<style lang="scss" scoped>
.cluster-info-cell {
  display: flex;
  gap: 8px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;

  &__icon {
    font-size: 48px;
    color: var(--bee-row-selected-icon-color, $color-text-third);
  }

  &__content {
    display: flex;
    gap: 8px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
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

  .content-top__icon-copy {
    opacity: 0;
    cursor: pointer;
    transition: opacity 0.15s;

    &:hover {
      color: $color-primary;
    }
  }

  &:hover .content-top__icon-copy {
    opacity: 1;
  }
}
</style>
