<template>
  <div class="bee-pagination">
    <!-- 总数统计 -->
    <span class="bee-pagination__total">共 {{ total }} 条</span>

    <!-- 每页数量选择 -->
    <BeeSelect
      v-model="currentPageSize"
      class="bee-pagination__size-selector"
      :options="pageSizeOptions"
      placeholder="条/页"
    />

    <!-- 分页控制 -->
    <div class="bee-pagination__controls">
      <!-- 上一页按钮 -->
      <button
        class="bee-pagination__btn bee-pagination__btn--prev"
        :class="{ 'is-disabled': isFirstPage }"
        :disabled="isFirstPage"
        @click="handlePrevPage"
      >
        <BeeIcon name="basic-arrow-down" class="bee-pagination__icon" />
      </button>

      <!-- 当前页码输入 -->
      <div class="bee-pagination__page-input-wrapper">
        <input
          v-model="pageInput"
          type="number"
          class="bee-pagination__input"
          :min="1"
          :max="totalPages"
          @input="handlePageInputFilter"
          @keyup.enter="handlePageInput"
          @blur="handlePageInput"
        />
        <span class="bee-pagination__page-separator">/</span>
        <span class="bee-pagination__total-pages">{{ totalPages }}</span>
      </div>

      <!-- 下一页按钮 -->
      <button
        class="bee-pagination__btn bee-pagination__btn--next"
        :class="{ 'is-disabled': isLastPage }"
        :disabled="isLastPage"
        @click="handleNextPage"
      >
        <BeeIcon name="basic-arrow-down" class="bee-pagination__icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * BeePagination 分页组件
 */
import { ref, computed, watch } from 'vue'

import BeeIcon from '@/components/BeeIcon/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'

defineOptions({ name: 'BeePagination' })

/** 组件属性 */
const props = withDefaults(
  defineProps<{
    /** 数据总数 */
    total?: number
    /** 当前页码（v-model） */
    modelValue?: number
    /** 每页数量（v-model） */
    pageSize?: number
    /** 每页数量选项 */
    pageSizes?: number[]
  }>(),
  {
    total: 0,
    modelValue: 1,
    pageSize: 10,
    pageSizes: () => [10, 20, 30],
  },
)

/** 组件事件 */
const emit = defineEmits<{
  /** 当前页码更新 */
  'update:modelValue': [page: number]
  /** 每页数量更新 */
  'update:pageSize': [size: number]
  /** 页码变化 */
  'change': [page: number, pageSize: number]
}>()

/** 当前页码 */
const currentPage = computed({
  get: () => props.modelValue,
  set: (val: number) => {
    const targetPage = Math.max(1, Math.min(val, totalPages.value))
    emit('update:modelValue', targetPage)
    emit('change', targetPage, currentPageSize.value)
  },
})

/** 当前每页数量 */
const currentPageSize = computed({
  get: () => props.pageSize,
  set: (val: number) => {
    emit('update:pageSize', val)
    emit('change', currentPage.value, val)
  },
})

/** 页码输入框的值 */
const pageInput = ref(String(props.modelValue))

/** 每页数量选项（用于 BeeSelect） */
const pageSizeOptions = computed(() =>
  props.pageSizes.map(size => ({
    label: `${size}条/页`,
    value: size,
  })),
)

/** 计算总页数 */
const totalPages = computed(() => {
  if (props.total <= 0) return 1
  return Math.ceil(props.total / currentPageSize.value)
})

/** 是否为第一页 */
const isFirstPage = computed(() => currentPage.value <= 1)

/** 是否为最后一页 */
const isLastPage = computed(() => currentPage.value >= totalPages.value)

/** 监听外部 modelValue 变化，同步输入框 */
watch(
  () => props.modelValue,
  val => {
    pageInput.value = String(val)
  },
)

/** 监听每页数量变化，重置到第一页 */
watch(
  () => props.pageSize,
  () => {
    // 当每页数量变化时，如果当前页码超过新的总页数，重置到最后一页
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
    pageInput.value = String(currentPage.value)
  },
)

/** 上一页 */
function handlePrevPage() {
  if (!isFirstPage.value) {
    currentPage.value = currentPage.value - 1
    pageInput.value = String(currentPage.value)
  }
}

/** 下一页 */
function handleNextPage() {
  if (!isLastPage.value) {
    currentPage.value = currentPage.value + 1
    pageInput.value = String(currentPage.value)
  }
}

/** 页码输入 */
function handlePageInput() {
  const inputPage = parseInt(pageInput.value, 10)

  // 非数字输入或为空，恢复当前页码
  if (isNaN(inputPage) || pageInput.value === '') {
    pageInput.value = String(currentPage.value)
    return
  }

  // 输入非正数，重置为1
  if (inputPage < 1) {
    currentPage.value = 1
    pageInput.value = '1'
    return
  }

  // 输入超过总页数，设置为最后一页
  if (inputPage > totalPages.value) {
    currentPage.value = totalPages.value
    pageInput.value = String(totalPages.value)
    return
  }

  // 正常情况，更新页码
  if (inputPage !== currentPage.value) {
    currentPage.value = inputPage
  }
}

/**
 * 过滤非数字输入
 * @param event
 */
function handlePageInputFilter(event: Event) {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/\D/g, '')
  pageInput.value = input.value
}
</script>

<style lang="scss" scoped>
.bee-pagination {
  display: flex;
  gap: $spacing-16;
  align-items: center;

  &__total {
    font-size: $font-size-12;
    color: $color-text-secondary;
    white-space: nowrap;
  }

  &__total-pages {
    font-size: $font-size-12;
    color: $color-text-secondary;
  }

  &__size-selector {
    width: 100px;
  }

  &__controls {
    display: flex;
    gap: $spacing-4;
    align-items: center;
  }

  &__page-input-wrapper {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 $spacing-16;
    border: 1px solid transparent;
    border-radius: $radius-full;
    background: $color-bg-page;
    transition: border-color 0.2s;

    &:hover,
    &:focus-within {
      border-color: $color-primary;
    }
  }

  &__page-separator {
    margin: 0 $spacing-4;
    font-size: $font-size-12;
    color: $color-text-secondary;
  }

  &__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: $radius-4;
    color: $color-text-secondary;
    background: transparent;
    cursor: pointer;
    transition:
      color 0.2s,
      background-color 0.2s;

    &:hover:not(.is-disabled) {
      color: $color-primary;
      background: rgba($color-primary, 0.1);
    }

    &.is-disabled {
      color: $color-text-tertiary;
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--prev .bee-pagination__icon {
      transform: rotate(90deg);
    }

    &--next .bee-pagination__icon {
      transform: rotate(-90deg);
    }
  }

  &__icon {
    width: 14px;
    height: 14px;
    color: inherit;
  }

  &__input {
    padding: 0;
    border: none;
    font-size: $font-size-12;
    color: $color-text-secondary;
    text-align: center;
    background: transparent;
    outline: none;

    // 隐藏 number 输入框的箭头
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
      margin: 0;
    }

    // Firefox
    &[type='number'] {
      appearance: textfield;
    }
  }
}
</style>
