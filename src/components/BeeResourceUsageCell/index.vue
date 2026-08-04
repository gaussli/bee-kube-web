<template>
  <div class="bee-resource-usage-cell">
    <div class="bee-resource-usage-cell__top">
      <span class="bee-resource-usage-cell__value">{{ percentage }}%</span>
      <div class="bee-resource-usage-cell__track">
        <div class="bee-resource-usage-cell__fill" :style="{ width: percentage + '%', background: usageColor }" />
      </div>
    </div>
    <span class="bee-resource-usage-cell__field-name">{{ fieldName }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * 资源用量单元格组件
 * 上下结构展示资源用量百分比+进度条 和 资源名称
 * @module components/BeeResourceUsageCell
 */
import { computed } from 'vue'

import { COLOR_SUCCESS, COLOR_WARNING, COLOR_DANGER } from '@/config/color'

defineOptions({ name: 'BeeResourceUsageCell' })

const props = defineProps<{
  /** 资源用量百分比 (0-100) */
  percentage: number
  /** 资源字段名称，如 CPU、内存、磁盘、容器数 */
  fieldName: string
}>()

/**
 * 根据用量百分比计算进度条颜色
 * < 60%：success；>= 60% 且 < 80%：warning；>= 80%：danger
 */
const usageColor = computed(() => {
  if (props.percentage >= 80) return COLOR_DANGER
  if (props.percentage >= 60) return COLOR_WARNING
  return COLOR_SUCCESS
})
</script>

<style lang="scss" scoped>
.bee-resource-usage-cell {
  display: flex;
  gap: $spacing-8;
  flex-direction: column;
  width: 120px;
  height: auto;

  &__top {
    display: flex;
    gap: $spacing-4;
    align-items: center;
  }

  &__track {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
    background: $color-border-tertiary;
  }

  &__fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  &__value {
    flex-shrink: 0;
    width: 36px;
    font-size: $font-size-14;
    color: $color-text-primary;
  }

  &__field-name {
    font-size: $font-size-12;
    color: $color-text-tertiary;
  }
}
</style>
