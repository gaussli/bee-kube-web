<template>
  <div class="bee-node-info-cell">
    <div class="bee-node-info-cell__node-icon" :style="{ height: iconSize + 'px' }">
      <BeeIcon name="kubernetes-node" :size="iconSize ?? 48" />
    </div>
    <div class="bee-node-info-cell__content">
      <div class="bee-node-info-cell__top">
        <BeeTooltip :label="id">
          <BeeTag type="primary" size="tiny">UID</BeeTag>
        </BeeTooltip>
        <BeeTooltip :label="ip">
          <BeeTag type="primary" size="tiny">IP</BeeTag>
        </BeeTooltip>
        <span class="bee-node-info-cell__name">{{ name }}</span>
        <BeeIcon name="basic-copy" :size="14" class="bee-node-info-cell__copy-icon" @click="useClipboard().copy(props.name)" />
      </div>
      <div class="bee-node-info-cell__bottom">
        <BeeIcon name="basic-description" :size="14" class="bee-node-info-cell__desc-icon" />
        <BeeTooltip :disabled="!isDescTruncated">
          <template #label>
            <span class="bee-node-info-cell__desc-tooltip">{{ description }}</span>
          </template>
          <span ref="descRef" class="bee-node-info-cell__desc">{{ description }}</span>
        </BeeTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 节点信息单元格组件
 * 上下结构展示节点名称+UID标签 和 描述信息
 * @module components/BeeNodeInfoCell
 */
import { ref, onMounted, onUnmounted } from 'vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import BeeTooltip from '@/components/BeeTooltip/index.vue'
import { useClipboard } from '@/composables/useClipboard'

defineOptions({ name: 'BeeNodeInfoCell' })

const props = defineProps<{
  /** 左侧图标大小 */
  iconSize?: number
  /** 节点名称 */
  name: string
  /** 节点 ID，hover UID 标签时显示 */
  id: string
  /** 节点 IP 地址，hover IP 标签时显示 */
  ip: string
  /** 节点描述 */
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
.bee-node-info-cell {
  display: flex;
  gap: $spacing-8;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;

  &__node-icon {
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
    display: flex;
    gap: $spacing-4;
    align-items: center;
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
.bee-node-info-cell__desc-tooltip {
  display: inline-block;
  max-width: 400px;
  word-break: break-all;
  white-space: normal;
}
</style>
