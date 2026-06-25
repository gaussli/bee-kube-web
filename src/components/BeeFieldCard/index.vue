<template>
  <div class="bee-fieldcard">
    <div class="bee-fieldcard__header">
      <span class="bee-fieldcard__prop-name">{{ propName }}</span>
    </div>
    <div class="bee-fieldcard__body">
      <span class="bee-fieldcard__text">{{ text }}</span>
      <span v-if="subtext" class="bee-fieldcard__subtext">{{ subtext }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'BeeFieldCard' })

defineProps<{
  /** 属性名称 */
  propName: string
  /** 主文本 */
  text: string
  /** 副文本 */
  subtext: string
}>()
</script>

<style lang="scss" scoped>
.bee-fieldcard {
  --bee-fieldcard-bg: #{$color-bg-surface};
  --bee-fieldcard-subtext-color: #{$color-text-tertiary};
  --bee-fieldcard-text-color: #{$color-text-primary};
  --bee-fieldcard-width: 240px;

  display: flex;
  gap: 32px;
  flex-direction: column;
  justify-content: space-between;
  width: var(--bee-fieldcard-width);
  height: 100%;
  padding: $spacing-16;
  border-radius: $radius-16;
  background: var(--bee-fieldcard-bg);

  &__header {
    display: flex;
    justify-content: flex-end;
  }

  &__prop-name {
    font-size: $font-size-12;
    color: $color-text-tertiary;
  }

  &__body {
    display: flex;
    gap: 4px;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    line-height: 1;
  }

  &__text {
    font-size: $font-size-14;
    color: var(--bee-fieldcard-text-color);
  }

  &__subtext {
    font-size: $font-size-12;
    color: var(--bee-fieldcard-subtext-color);
  }
}
</style>
