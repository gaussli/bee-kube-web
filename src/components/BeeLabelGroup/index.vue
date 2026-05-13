<template>
  <span class="bee-label-group">
    <span class="bee-label-group__main" :style="{ fontSize: mainSize, color: mainColor }">{{ main }}</span>
    <span v-if="sub" class="bee-label-group__sub" :style="{ fontSize: subSize, color: subColor }">{{ sub }}</span>
  </span>
</template>

<script setup lang="ts">
defineOptions({ name: 'BeeLabelGroup' })

defineProps<{
  /** 主标签 */
  main: string
  /** 主标签字体大小 */
  mainSize?: string
  /** 主标签字体颜色 */
  mainColor?: string
  /** 副标签 */
  sub?: string
  /** 副标签字体大小 */
  subSize?: string
  /** 副标签字体颜色 */
  subColor?: string
}>()
</script>

<style lang="scss" scoped>
.bee-label-group {
  display: inline-flex;
  gap: $spacing-xs;
  flex-direction: column;

  &__main {
    font-size: $font-size-base;
    font-weight: 500;
    line-height: 1.2;
    color: $text-primary;
  }

  &__sub {
    font-size: $font-size-sm;
    line-height: 1.2;
    color: $text-secondary;
  }
}
</style>
