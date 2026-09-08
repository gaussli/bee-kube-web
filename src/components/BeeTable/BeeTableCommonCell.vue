<template>
  <div class="bee-table-common-cell">
    <BeeEllipsisTooltipLabel class="bee-table-common-cell__label" :label="label" />
    <BeeEllipsisTooltipLabel v-if="sublabel" class="bee-table-common-cell__sublabel" :label="sublabel" />
  </div>
</template>

<script setup lang="ts">
import BeeEllipsisTooltipLabel from '@/components/business/BeeEllipsisTooltipLabel/index.vue'

defineOptions({ name: 'BeeTableCommonCell' })

defineProps<{
  /** 主文本（上方） */
  label: string
  /** 副文本（下方），不传则不渲染 */
  sublabel?: string
}>()
</script>

<style lang="scss" scoped>
.bee-table-common-cell {
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;

  &__label {
    font-size: 14px;
    font-weight: normal;
    color: $color-text-primary;
  }

  &__sublabel {
    font-size: 12px;
    font-weight: normal;
    color: $color-text-third;
  }
}
</style>
