<template>
  <div class="bee-status-cell">
    <div class="bee-status-cell__top">
      <span class="bee-status-cell__dot"></span>
      <span class="bee-status-cell__label">{{ currentStatus.label }}</span>
    </div>
    <div class="bee-status-cell__bottom">
      <span class="bee-status-cell__label-en">{{ currentStatus.labelEn || '-' }}</span>
      <BeeTooltip v-if="statusMsg" :label="statusMsg" placement="top">
        <BeeIcon class="bee-status-cell__help-icon" name="basic-help" :size="12" />
      </BeeTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 状态单元格组件
 * 上下结构：上方展示状态 dot + 中文标签，下方展示英文标签及可选帮助提示
 * @module components/BeeStatusCell
 */
import { computed } from 'vue'

import type { Option } from '@/config/kubernetes'

import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeTooltip from '@/components/BeeTooltip/index.vue'

import { COLOR_GRAY_90 } from '@/config/color'

defineOptions({ name: 'BeeStatusCell' })

const props = defineProps<{
  /** 当前状态值 */
  status?: string | number
  /** 帮助提示信息，存在时在 labelEn 旁显示帮助图标 */
  statusMsg?: string
  /** 状态配置数组 */
  options: Option[]
}>()

/** 匹配当前 status 的状态选项，无匹配返回 '-' 占位 */
const currentStatus = computed(
  () => props.options.find(item => item.value === props.status) || { label: '-', color: COLOR_GRAY_90, labelEn: '-' },
)

/** 状态指示色，用于 dot 背景和 label 文字 */
const currentStatusColor = computed(() => currentStatus.value.color)
</script>

<style lang="scss" scoped>
.bee-status-cell {
  display: flex;
  gap: 8px;
  flex-direction: column;
  width: 100%;
  height: auto;
  line-height: 1;

  &__top {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__dot {
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: v-bind(currentStatusColor);
  }

  &__label {
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    color: v-bind(currentStatusColor);
  }

  &__bottom {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  &__label-en {
    font-size: 12px;
    line-height: 1;
    color: $color-text-tertiary;
  }

  &__help-icon {
    flex-shrink: 0;
    color: $color-text-tertiary;
  }
}
</style>
