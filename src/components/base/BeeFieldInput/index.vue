<template>
  <div class="bee-field-input">
    <!-- 标签 -->
    <div class="bee-field-input__label">
      <BeeIcon v-if="icon" :name="icon" />
      <span>{{ label }}</span>
    </div>
    <!-- 输入框 -->
    <div class="bee-field-input__input" :class="[disabledClass]">
      <input :id="id" v-model="modelValue" :disabled="disabled" />
    </div>
    <!-- 提示区域 -->
    <div class="bee-field-input__tip"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BeeIcon from '@/components/base/BeeIcon/index.vue'

// ==================== Prop ====================
const modelValue = defineModel<string>()
const props = withDefaults(
  defineProps<{
    label: string
    id: string
    icon?: string
    size?: 'default' | 'small' | 'large'
    disabled?: boolean
  }>(),
  {
    icon: undefined,
    size: 'default',
    disabled: false,
  },
)

const disabledClass = computed(() => (props.disabled ? 'is-disabled' : ''))
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-field-input {
  display: flex;
  gap: 8px;
  flex-direction: column;
  width: 100%;

  &__label {
    display: flex;
    gap: 8px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    font-size: 12px;
    font-weight: normal;
    color: $color-text-third;
  }

  &__input {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 32px;
    padding: 0 14px;
    border: 1px solid;
    border-color: map.get($colors-default, 'border', 'base');
    border-radius: 9999px;
    font-size: 14px;
    font-weight: normal;
    color: $color-text-primary;

    input {
      width: 100%;
    }

    &.is-disabled {
      background: map.get($colors-default, 'bg', 'hover');
    }
  }
}
</style>
