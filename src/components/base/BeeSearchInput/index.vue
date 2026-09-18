<template>
  <div class="bee-search-input" :class="[sizeClass]">
    <BeeIcon class="bee-search-input__icon" name="basic-search" />
    <input
      id="search-input"
      v-model="modelValue"
      autocomplete="off"
      class="bee-search-input__input"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BeeIcon from '@/components/base/BeeIcon/index.vue'

defineOptions({ name: 'BeeSearchInput' })

// ==================== Prop & Emit ====================
const modelValue = defineModel<string>()
const props = withDefaults(
  defineProps<{
    /** 占位文本 */
    placeholder?: string
    /** 输入框尺寸 */
    size?: 'default' | 'small' | 'large'
  }>(),
  {
    placeholder: '搜索',
    size: 'default',
  },
)

// ==================== Computed ====================
const sizeClass = computed(() => (props.size !== 'default' ? `bee-search-input--${props.size}` : ''))
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-search-input {
  /* stylelint-disable order/custom-properties-alphabetical-order */
  --bee-search-input-height: 40px;
  --bee-search-input-padding: 0 20px;
  --bee-search-input-font-size: 14px;
  --bee-search-input-color: #{$color-text-secondary};
  --bee-search-input-color-border: #{map.get($colors-default, 'border', 'base')};
  --bee-search-input-color-active: #{$color-text-primary};
  --bee-search-input-color-border-active: #{$color-text-secondary};

  &.bee-search-input--small {
    --bee-search-input-height: 32px;
    --bee-search-input-padding: 0 14px;
    --bee-search-input-font-size: 12px;
  }

  &.bee-search-input--large {
    --bee-search-input-height: 48px;
    --bee-search-input-padding: 0 28px;
    --bee-search-input-font-size: 16px;
  }

  /* stylelint-enable order/custom-properties-alphabetical-order */
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  align-items: stretch;
  height: var(--bee-search-input-height);
  padding: var(--bee-search-input-padding);
  border: 1px solid;
  border-color: var(--bee-search-input-color-border);
  border-radius: 9999px;
  font-size: var(--bee-search-input-font-size);
  font-weight: normal;
  color: var(--bee-search-input-color);
  background: transparent;
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: var(--bee-search-input-color-border-active);
    color: var(--bee-search-input-color-active);
  }

  &__icon {
    flex-shrink: 0;
    height: 100%;
    color: $color-text-placeholder;
  }

  &__input {
    flex: 1;
    min-width: 0;
  }
}
</style>
