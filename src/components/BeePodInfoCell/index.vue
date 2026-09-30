<template>
  <div class="bee-pod-info-cell">
    <!-- 左部分：容器组图标 -->
    <div class="bee-pod-info-cell__icon">
      <BeeIcon :name="icon" />
    </div>
    <!-- 右部分：容器组基础信息（UID、名称、IP） -->
    <div class="bee-pod-info-cell__content">
      <div class="content-top">
        <BeeTooltip :tooltip="uid">
          <BeeCapsule :copy-label="uid" label="UID" size="tiny" />
        </BeeTooltip>
        <BeeEllipsisTooltipLabel :label="name" />
        <BeeIcon class="content-top__icon-copy" name="basic-copy" @click.stop="handleCopy" />
      </div>
      <div class="content-bottom">
        <BeeIcon name="basic-url" />
        <BeeEllipsisTooltipLabel :label="ip || '-'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 容器组信息单元格组件
 * @description 左侧容器组图标；右侧上下两行 —— 上行 UID 胶囊（hover 展示完整 UID、点击复制）+ 名称 + 名称复制按钮，
 * 下行 IP 地址。与 `NamespaceInfoCell` / `WorkloadInfoCell` 结构保持一致
 * @module components/BeePodInfoCell
 */
import BeeCapsule from '@/components/base/BeeCapsule/index.vue'
import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeTooltip from '@/components/base/BeeTooltip/index.vue'
import BeeEllipsisTooltipLabel from '@/components/business/BeeEllipsisTooltipLabel/index.vue'

import { useClipboard } from '@/composables/useClipboard'

defineOptions({ name: 'BeePodInfoCell' })

// ==================== Prop ====================
const props = withDefaults(
  defineProps<{
    /** 容器组图标 */
    icon?: string
    /** 容器组 UID，hover UID 胶囊时以 tooltip 展示完整值 */
    uid: string
    /** 容器组名称 */
    name: string
    /** 容器组 IP */
    ip?: string
  }>(),
  {
    icon: 'kubernetes-pod',
    ip: '-',
  },
)

// ==================== Handler ====================
/**
 * 复制容器组名称到剪贴板
 */
async function handleCopy() {
  await useClipboard().copy(props.name)
}
</script>

<style lang="scss" scoped>
.bee-pod-info-cell {
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
  }

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
