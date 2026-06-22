<template>
  <div class="bee-input-search">
    <BeeIcon name="basic-search" :size="14" class="bee-input-search__icon" />
    <input v-model="inputValue" :placeholder="placeholder" class="bee-input-search__input" />
  </div>
</template>

<script setup lang="ts">
/**
 * 搜索输入框组件
 * 左侧图标 + 输入框，支持 v-model 双向绑定
 * @module components/BeeInputSearch
 */
import { computed } from 'vue'
import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeInputSearch' })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
  }>(),
  {
    modelValue: '',
    placeholder: '搜索'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-input-search {
  --bee-input-search-bg: transparent;
  --bee-input-search-border-color: #{map.get($colors, 'gray', 90)};
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
