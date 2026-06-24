<template>
  <div class="bee-cluster-info-cell">
    <div class="bee-cluster-info-cell__cluster-icon">
      <BeeIcon name="kubernetes-cluster" />
    </div>
    <div class="bee-cluster-info-cell__content">
      <div class="bee-cluster-info-cell__top">
        <span class="bee-cluster-info-cell__name">{{ name }}</span>
        <BeeTooltip :label="id">
          <BeeTag type="primary" size="tiny">UID</BeeTag>
        </BeeTooltip>
      </div>
      <div class="bee-cluster-info-cell__bottom">
        <BeeIcon name="basic-description" :size="14" class="bee-cluster-info-cell__desc-icon" />
        <BeeTooltip :disabled="!isDescTruncated">
          <template #label>
            <span class="bee-cluster-info-cell__desc-tooltip">{{ description }}</span>
          </template>
          <span ref="descRef" class="bee-cluster-info-cell__desc">{{ description }}</span>
        </BeeTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 集群信息单元格组件
 * 上下结构展示集群名称+UID标签 和 描述信息
 * @module components/BeeClusterInfoCell
 */
import { ref, onMounted, onUnmounted } from 'vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import BeeTooltip from '@/components/BeeTooltip/index.vue'

defineOptions({ name: 'BeeClusterInfoCell' })

defineProps<{
  /** 集群名称 */
  name: string
  /** 集群 ID，hover UID 标签时显示 */
  id: string
  /** 集群描述 */
  description?: string
}>()

// ==================== 描述文本溢出检测 ====================

/** 描述文本元素引用 */
const descRef = ref<HTMLElement>()
/** 描述文本是否被截断（出现省略号） */
const isDescTruncated = ref(false)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  const el = descRef.value
  if (!el) return

  /** 检测并更新截断状态 */
  const check = () => {
    isDescTruncated.value = el.scrollWidth > el.clientWidth
  }

  check()
  resizeObserver = new ResizeObserver(check)
  resizeObserver.observe(el)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})
</script>

<style lang="scss" scoped>
.bee-cluster-info-cell {
  display: flex;
  gap: $spacing-8;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;

  &__cluster-icon {
    flex-shrink: 0;
    height: 48px;
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

    // height: 24px;
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

    // height: 24px;
    min-width: 0;

    :deep(.bee-tooltip-trigger) {
      min-width: 0;
      overflow: hidden;
    }
  }

  &__desc-icon {
    flex-shrink: 0;
    color: $color-text-tertiary;
  }

  &__desc {
    overflow: hidden;
    font-size: $font-size-12;
    color: $color-text-tertiary;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

<style lang="scss">
// BeeTooltip label slot 内容样式（Teleport 到 body，需全局样式）
.bee-cluster-info-cell__desc-tooltip {
  display: inline-block;
  max-width: 400px;
  word-break: break-all;
  white-space: normal;
}
</style>
