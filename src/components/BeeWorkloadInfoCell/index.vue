<template>
  <div class="bee-workload-info-cell">
    <div class="bee-workload-info-cell__icon">
      <BeeIcon :name="icon" :size="32" />
    </div>
    <div class="bee-workload-info-cell__content">
      <div class="bee-workload-info-cell__top">
        <BeeTooltip :label="uid">
          <BeeTag size="tiny" type="primary">UID</BeeTag>
        </BeeTooltip>
        <span class="bee-workload-info-cell__name">{{ name }}</span>
        <BeeIcon
          class="bee-workload-info-cell__copy-icon"
          name="basic-copy"
          :size="14"
          @click.stop="useClipboard().copy(props.name)"
        />
      </div>
      <div class="bee-workload-info-cell__bottom">
        <BeeIcon class="bee-workload-info-cell__desc-icon" name="basic-description" :size="14" />
        <BeeTooltip :disabled="!isDescTruncated">
          <template #label>
            <span class="bee-workload-info-cell__desc-tooltip">{{ description }}</span>
          </template>
          <span ref="descRef" class="bee-workload-info-cell__desc">{{ description }}</span>
        </BeeTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 工作负载信息单元格组件
 * 上下结构展示工作负载名称（支持复制）和描述信息
 * @module components/BeeWorkloadInfoCell
 */
import { ref, onMounted, onUnmounted } from 'vue'

import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import BeeTooltip from '@/components/BeeTooltip/index.vue'

import { useClipboard } from '@/composables/useClipboard'

defineOptions({ name: 'BeeWorkloadInfoCell' })

const props = withDefaults(
  defineProps<{
    /** 工作负载图标 */
    icon: string
    /** 工作负载 UID */
    uid: string
    /** 工作负载名称 */
    name: string
    /** 工作负载描述 */
    description?: string
  }>(),
  {
    description: '-',
  },
)

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
.bee-workload-info-cell {
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
.bee-workload-info-cell__desc-tooltip {
  display: inline-block;
  max-width: 400px;
  word-break: break-all;
  white-space: normal;
}
</style>
