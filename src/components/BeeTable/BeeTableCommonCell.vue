<template>
  <div class="bee-table-common-cell">
    <span class="bee-table-common-cell__text">{{ text }}</span>
    <span v-if="subtext" class="bee-table-common-cell__subtext">{{ subtext }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * BeeTable 通用单元格组件
 * 上下结构展示主文本和副文本
 * @module components/BeeTable/BeeTableCommonCell
 */
defineOptions({ name: 'BeeTableCommonCell' })

defineProps<{
  /** 主文本（上方） */
  text: string
  /** 副文本（下方），不传则不渲染 */
  subtext?: string
}>()
</script>

<style lang="scss" scoped>
.bee-table-common-cell {
  display: flex;
  gap: 4px;
  flex-direction: column;
  width: 100%;
  height: auto;

  &__text {
    font-size: 14px;
    color: $color-text-primary;
    white-space: nowrap;
  }

  &__subtext {
    font-size: 12px;
    color: $color-text-tertiary;
    white-space: nowrap;
  }
}
</style>
