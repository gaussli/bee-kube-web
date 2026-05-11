<template>
  <div class="bee-input-search" :class="`bee-input-search--${size}`">
    <div class="search-input-wrap">
      <input ref="inputRef" v-model="inputValue" :placeholder="placeholder" :name="name" class="search-input" @keyup.enter="handleSearch" />
    </div>
    <button class="search-btn" @click="handleSearch">
      <Search />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

defineOptions({ name: 'BeeInputSearch' })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    size?: 'large' | 'default' | 'small'
    name?: string
  }>(),
  {
    modelValue: '',
    placeholder: '搜索',
    size: 'default',
    name: 'bee-input-search'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
}>()

const inputRef = ref<HTMLInputElement>()
const inputValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

function handleSearch() {
  emit('search', inputValue.value)
  emit('update:modelValue', inputValue.value)
}

function search() {
  handleSearch()
}

function focus() {
  inputRef.value?.focus()
}

defineExpose({
  search,
  focus
})
</script>

<style lang="scss" scoped>
.bee-input-search {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba($text-secondary, 0.1);
  border-radius: 16px;
  overflow: hidden;
  background-color: $bg-color;
  transition: all 0.3s;

  &:focus-within {
    border-color: $color-primary;
  }

  &--large {
    width: 240px;
    height: 40px;
    padding: 0 12px;

    .search-input {
      height: 32px;
      font-size: 12px;
    }

    .search-btn {
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }

  &--default {
    width: 200px;
    height: 32px;
    padding: 0 10px;

    .search-input {
      height: 28px;
      font-size: 12px;
    }
  }

  &--small {
    width: 160px;
    height: 24px;
    padding: 0 8px;

    .search-input {
      height: 24px;
      font-size: 12px;
    }

    .search-btn {
      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
}

.search-input-wrap {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0;
  border: none;
  color: inherit;
  background: transparent;
  outline: none;

  &::placeholder {
    color: $text-placeholder;
  }
}

.search-btn {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: none;
  border-radius: 4px;
  color: $text-secondary;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: $color-primary;
  }

  svg {
    width: 14px;
    height: 14px;
  }
}
</style>
