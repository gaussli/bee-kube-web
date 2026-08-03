<template>
  <div class="bee-label-group">
    <BeeIconLabel :icon="mainIcon" :label="mainLabel" :color="mainColor" :font-weight="600" />
    <BeeIconLabel
      v-if="subLabel"
      class="bee-label-group__sub"
      :icon="subIcon"
      :label="subLabel"
      :color="subColor"
      size="12px"
      :font-weight="300"
    />
  </div>
</template>

<script setup lang="ts">
import BeeIconLabel from '@/components/BeeIconLabel/index.vue'

defineOptions({ name: 'BeeLabelGroup' })

defineProps<{
  /** 主标签 */
  mainLabel: string
  /** 主标签 Icon */
  mainIcon?: string
  /** 主标签字体大小 */
  mainSize?: string
  /** 主标签字体颜色 */
  mainColor?: string
  /** 副标签 */
  subLabel?: string
  /** 副标签 Icon */
  subIcon?: string
  /** 副标签字体大小 */
  subSize?: string
  /** 副标签字体颜色 */
  subColor?: string
}>()
</script>

<style lang="scss" scoped>
.bee-label-group {
  display: inline-flex;
  gap: $spacing-4;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}
</style>
