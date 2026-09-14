<template>
  <div class="bee-resource-usage-cell">
    <div class="bee-resource-usage-cell__top">
      <span class="bee-resource-usage-cell__value">{{ percentage }}%</span>
      <div class="bee-resource-usage-cell__track">
        <div class="bee-resource-usage-cell__fill" :class="[typeClass]" :style="widthStyle" />
      </div>
    </div>
    <span class="bee-resource-usage-cell__bottom">{{ fieldName }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'BeeResourceUsageCell' })

// ==================== Prop ====================
const props = defineProps<{
  /** 资源用量百分比 (0-100) */
  percentage: number
  /** 资源字段名称，如 CPU、内存、磁盘、容器数 */
  fieldName: string
}>()

// ==================== Computed ====================
const typeClass = computed(() => {
  if (props.percentage >= 80) return 'bee-resource-usage-cell__fill--danger'
  if (props.percentage >= 60) return 'bee-resource-usage-cell__fill--warning'
  return 'bee-resource-usage-cell__fill--success'
})

const widthStyle = computed(() => ({
  width: `${props.percentage}%`,
}))
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-resource-usage-cell {
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;

  &__top {
    display: flex;
    gap: 4;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }

  &__value {
    flex-shrink: 0;
    width: 36px;
    font-size: 14px;
    color: $color-text-primary;
  }

  &__track {
    flex: 1;
    width: 100%;
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
    background: $color-text-third;
  }

  &__fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease;

    &--success {
      background: map.get($colors-success, 'text', 'base');
    }

    &--warning {
      background: map.get($colors-warning, 'text', 'base');
    }

    &--danger {
      background: map.get($colors-danger, 'text', 'base');
    }
  }

  &__bottom {
    font-size: 12px;
    color: $color-text-third;
  }
}
</style>
