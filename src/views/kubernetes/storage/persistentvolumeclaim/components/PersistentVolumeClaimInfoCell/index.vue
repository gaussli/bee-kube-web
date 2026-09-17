<template>
  <div class="persistent-volume-claim-info-cell">
    <!-- 左部分：持久卷声明图标 -->
    <div class="persistent-volume-claim-info-cell__icon">
      <BeeIcon :name="PERSISTENTVOLUMECLAIM_PAGE_META.icon" />
    </div>
    <!-- 右部分：持久卷声明基础信息（UID、名称、描述） -->
    <div class="persistent-volume-claim-info-cell__content">
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
/**
 * PersistentVolumeClaimInfoCell 持久卷声明信息单元格
 * @module views/kubernetes/storage/persistentvolumeclaim/components/PersistentVolumeClaimInfoCell
 * @description 纯展示单元，接收持久卷声明字段并对外提供名称复制能力，不发起任何请求
 */
import BeeCapsule from '@/components/base/BeeCapsule/index.vue'
import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeTooltip from '@/components/base/BeeTooltip/index.vue'
import BeeEllipsisTooltipLabel from '@/components/business/BeeEllipsisTooltipLabel/index.vue'

import { useClipboard } from '@/composables/useClipboard'
import { PERSISTENTVOLUMECLAIM_PAGE_META } from '@/config/kubernetes/storage/persistentvolumeclaim'

defineOptions({ name: 'PersistentVolumeClaimInfoCell' })

// ==================== Prop ====================
const props = withDefaults(
  defineProps<{
    /** 持久卷声明 UID，hover UID 胶囊时以 tooltip 展示完整值 */
    uid: string
    /** 持久卷声明名称，展示于基础信息行并提供复制入口 */
    name: string
    /** 持久卷声明描述，缺省显示 '-' */
    description?: string
  }>(),
  {
    description: '-',
  },
)

// ==================== Handler ====================
/**
 * 复制持久卷声明名称到剪贴板
 */
async function handleCopy() {
  await useClipboard().copy(props.name)
}
</script>

<style lang="scss" scoped>
/**
 * 样式采用 BEM：`__icon` 持久卷声明图标、`__content` 信息区（内含 content-top 基础信息行 / content-bottom 描述行）
 * - 图标配色：`--bee-row-selected-icon-color`，由 BeeTable 选中行注入，缺省为次级文本色
 * - 复制图标默认隐藏，hover 本组件时淡入
 */
.persistent-volume-claim-info-cell {
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
