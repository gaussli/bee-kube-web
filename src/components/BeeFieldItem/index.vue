<template>
  <div class="bee-fielditem">
    <div v-if="icon || fieldName" class="bee-fielditem__header">
      <BeeIcon v-if="icon" :name="icon" :size="12" />
      <span class="bee-fielditem__label">{{ fieldName }}</span>
    </div>
    <span class="bee-fielditem__value">{{ fieldValue || '-' }}</span>
  </div>
</template>

<script setup lang="ts">
import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeFieldItem' })

defineProps<{
  /** 字段名称 */
  fieldName: string
  /** 字段值 */
  fieldValue?: string
  /** 图标名称 */
  icon?: string
}>()
</script>

<style lang="scss" scoped>
.bee-fielditem {
  --bee-fielditem-width: 100%;

  display: flex;
  gap: 4px;
  flex-direction: column;
  width: var(--bee-fielditem-width);
  height: auto;
  background: transparent;

  &__header {
    display: flex;
    gap: 4px;
    align-items: center;
    color: $color-text-tertiary;
  }

  &__label {
    font-size: $font-size-12;
    color: $color-text-tertiary;
  }

  &__value {
    width: 100%;
    font-size: $font-size-14;
    color: $color-text-primary;
    word-break: break-all;
    white-space: normal;
  }
}
</style>
