<template>
  <div class="bee-status-cell">
    <div class="bee-status-cell__top">
      <span class="bee-status-cell__dot"></span>
      <span class="bee-status-cell__label">{{ currentConfig.label }}</span>
    </div>
    <div class="bee-status-cell__bottom">
      <span class="bee-status-cell__label-en">{{ currentConfig.labelEn || '-' }}</span>
      <BeeTooltip v-if="msg" :label="msg" placement="top">
        <BeeIcon name="basic-help" :size="12" class="bee-status-cell__help-icon" />
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
import type { StatusConfig } from './types'
import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeTooltip from '@/components/BeeTooltip/index.vue'

defineOptions({ name: 'BeeStatusCell' })

const props = defineProps<{
  /** 当前状态值 */
  status?: string | number
  /** 状态配置数组 */
  config: StatusConfig[]
  /** 帮助提示信息，存在时在 labelEn 旁显示帮助图标 */
  msg?: string
}>()

/** 当前匹配的状态配置，未匹配时返回默认"未知"配置 */
const currentConfig = computed(() => {
  const found = props.config.find(item => item.value === props.status)
  if (found) return found
  return { label: '未知', color: '#da8030', labelEn: 'unknown' }
})

/** 当前状态指示色，用于 dot 背景和 label 文字颜色 */
const currentColor = computed(() => currentConfig.value.color)
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
    background: v-bind(currentColor);
  }

  &__label {
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    color: v-bind(currentColor);
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
