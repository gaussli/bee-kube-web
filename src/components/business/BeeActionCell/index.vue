<template>
  <div v-if="actions.length > 0" class="bee-action-cell">
    <!-- 前两个操作（或全部操作，若 ≤3 个） -->
    <BeeTooltip v-for="action in primaryActions" :key="action.value" size="small" :tooltip="action.label">
      <BeeIconButton :icon="action.icon" size="small" @click.stop="action.handler" />
    </BeeTooltip>
    <!-- 更多下拉菜单 -->
    <BeeDropdown v-if="showMore" trigger="click" @change="handleDropdownChange">
      <BeeTooltip size="small" tooltip="更多">
        <BeeIconButton icon="basic-more" size="small" />
      </BeeTooltip>
      <template #dropdown>
        <BeeDropdownItem
          v-for="action in moreActions"
          :key="action.value"
          :icon="action.icon"
          :label="action.label"
          :value="action.value"
        />
      </template>
    </BeeDropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BeeIconButton from '@/components/base/BeeIconButton/index.vue'
import BeeTooltip from '@/components/base/BeeTooltip/index.vue'
import BeeDropdown from '@/components/BeeDropdown/index.vue'
import BeeDropdownItem from '@/components/BeeDropdownItem/index.vue'

defineOptions({ name: 'BeeActionCell' })

/** 操作项 */
export interface ActionItem {
  /** 操作标识 */
  value: string
  /** 操作标签（tooltip 与下拉菜单项文本） */
  label: string
  /** 图标名称 */
  icon: string
  /** 点击处理函数 */
  handler: () => void
}

// ==================== Props ====================
const props = defineProps<{
  /** 操作信息数组 */
  actions: ActionItem[]
}>()

// ==================== Computed ====================
/** 是否展示"更多"下拉按钮 */
const showMore = computed(() => props.actions.length > 3)

/** 并排展示的主操作（前 2 个） */
const primaryActions = computed(() => {
  if (showMore.value) {
    return props.actions.slice(0, 2)
  }
  return props.actions
})

/** "更多"下拉菜单中的操作（从第 3 个起） */
const moreActions = computed(() => {
  if (showMore.value) {
    return props.actions.slice(2)
  }
  return []
})

// ==================== Handler ====================
/**
 * 更多下拉菜单选中回调
 * @param value - 选中的操作标识
 * @remarks 根据 value 匹配对应 action 并调用其 handler
 */
function handleDropdownChange(value: string | number) {
  const matched = moreActions.value.find(a => a.value === value)
  matched?.handler()
}
</script>

<style lang="scss" scoped>
.bee-action-cell {
  display: flex;
  gap: 4px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
</style>
