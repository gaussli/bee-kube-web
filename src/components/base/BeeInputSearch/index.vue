<template>
  <div class="bee-input-search" :class="[sizeClass]">
    <BeeIcon class="bee-input-search__icon" name="basic-search" />
    <input id="input-search" v-model="modelValue" class="bee-input-search__input" :placeholder="placeholder" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BeeIcon from '@/components/base/BeeIcon/index.vue'

defineOptions({ name: 'BeeInputSearch' })

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
const sizeClass = computed(() => (props.size !== 'default' ? `bee-input-search--${props.size}` : ''))
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-input-search {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0 20px;
  border: 1px solid;
  border-color: var(--bee-input-search-color-border, map.get($colors-default, 'border', 'base'));
  border-radius: $radius-full;
  font-size: 14px;
  color: var(--bee-input-search-color-text, $color-text-primary);
  background: var(--bee-input-search-color-bg, map.get($colors-default, 'bg', 'base'));
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: var(--bee-input-search-color-border-focus, map.get($colors-primary, 'border', 'base'));
  }

  &__icon {
    flex-shrink: 0;
    color: $color-text-placeholder;
  }

  &__input {
    flex: 1;
    min-width: 0;
  }

  &--small {
    height: 32px;
    padding: 0 14px;
    font-size: 12px;
  }

  &--large {
    height: 48px;
    padding: 0 28;
    font-size: 16px;
  }
}
</style>
