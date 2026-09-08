<template>
  <div class="bee-input-search">
    <BeeIcon class="bee-input-search__icon" name="basic-search" />
    <input v-model="modelValue" class="bee-input-search__input" :placeholder="placeholder" />
  </div>
</template>

<script setup lang="ts">
import BeeIcon from '@/components/base/BeeIcon/index.vue'

defineOptions({ name: 'BeeInputSearch' })

// ==================== Prop & Emit ====================
const modelValue = defineModel<string>()
withDefaults(
  defineProps<{
    placeholder?: string
    size?: 'default' | 'small' | 'large'
  }>(),
  {
    placeholder: '搜索',
    size: 'default',
  },
)
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-input-search {
  --bee-input-search-bg: transparent;
  --bee-input-search-border-color: #{$color-text-secondary};
  --bee-input-search-border-color-focus: #{map.get($colors, 'primary', 50)};

  display: flex;
  gap: $spacing-8;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  padding: 0 $spacing-16;
  border: 1px solid var(--bee-input-search-border-color);
  border-radius: $radius-full;
  background: var(--bee-input-search-bg);
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: var(--bee-input-search-border-color-focus);
  }

  &__icon {
    flex-shrink: 0;
    color: $color-text-placeholder;
  }

  &__input {
    flex: 1;
    min-width: 0;
    padding: 0;
    border: none;
    font-size: $font-size-14;
    color: $color-text-primary;
    background: transparent;
    outline: none;

    &::placeholder {
      color: $color-text-placeholder;
    }
  }
}
</style>
