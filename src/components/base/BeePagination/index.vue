<template>
  <div class="bee-pagination">
    <!-- 总数统计 -->
    <span>共 {{ total }} 条</span>

    <!-- 每页数量选择 -->
    <BeeSelect v-model="currentPageSize" :options="pageSizeOptions" placeholder="条/页" />

    <!-- 分页控制 -->
    <div class="bee-pagination__controls">
      <!-- 上一页按钮 -->
      <BeeIconButton
        class="bee-pagination__button-prev"
        :disabled="isFirstPage"
        icon="basic-arrow-down"
        size="small"
        @click="handlePrevPage"
      />

      <!-- 当前页码 / 总页码 -->
      <span class="bee-pagination__controls-pages">{{ page }} / {{ totalPages }}</span>

      <!-- 下一页按钮 -->
      <BeeIconButton
        class="bee-pagination__button-next"
        :disabled="isLastPage"
        icon="basic-arrow-down"
        size="small"
        @click="handleNextPage"
      />
    </div>

    <div class="bee-pagination__jump">
      <span>跳到</span>
      <input
        id="pageInput"
        v-model="pageInput"
        class="bee-pagination__input"
        :max="totalPages"
        :min="1"
        type="number"
        @blur="handlePageInput"
        @keyup.enter="handlePageInput"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import BeeIconButton from '@/components/base/BeeIconButton/index.vue'
import BeeSelect from '@/components/base/BeeSelect/index.vue'

defineOptions({ name: 'BeePagination' })

// ==================== Prop & Emit ====================
const props = withDefaults(
  defineProps<{
    /** 当前页码 */
    page?: number
    /** 数据总数 */
    total?: number
    /** 每页数量 */
    pageSize?: number
    /** 每页数量选项 */
    pageSizes?: number[]
  }>(),
  {
    page: 1,
    total: 0,
    pageSize: 10,
    pageSizes: () => [10, 20, 30],
  },
)

const emit = defineEmits<{
  'update:page': [value: number]
  'update:pageSize': [value: number]
  /** 当前页码或每页数量变化 */
  'change': []
}>()

// ==================== Computed ====================
/** 计算总页数 */
const totalPages = computed(() => {
  if (props.total <= 0) return 1
  return Math.ceil(props.total / currentPageSize.value)
})

/** 当前每页数量 */
const currentPageSize = computed({
  get: () => props.pageSize,
  set: (val: number) => {
    emit('update:page', 1)
    emit('update:pageSize', val)
    emit('change')
  },
})

/** 每页数量选项 */
const pageSizeOptions = computed(() =>
  props.pageSizes.map(size => ({
    label: `${size}条 / 页`,
    value: size,
  })),
)

/** 是否为第一页 */
const isFirstPage = computed(() => currentPage.value <= 1)

/** 是否为最后一页 */
const isLastPage = computed(() => currentPage.value >= totalPages.value)

/** 当前页码 */
const currentPage = computed({
  get: () => props.page,
  set: (val: number) => {
    const targetPage = Math.max(1, Math.min(val, totalPages.value))
    emit('update:page', targetPage)
    emit('change')
  },
})

/** 页码输入框的值 */
const pageInput = ref(props.page)

/** 上一页 */
function handlePrevPage() {
  if (!isFirstPage.value) {
    pageInput.value = currentPage.value - 1
    currentPage.value = currentPage.value - 1
  }
}

/** 下一页 */
function handleNextPage() {
  if (!isLastPage.value) {
    pageInput.value = currentPage.value + 1
    currentPage.value = currentPage.value + 1
  }
}

/** 页码输入 */
function handlePageInput() {
  // 非数字输入或为空，恢复当前页码
  if (pageInput.value == null) {
    pageInput.value = currentPage.value
    return
  }

  // 输入非正数，重置为1
  if (pageInput.value < 1) {
    currentPage.value = 1
    pageInput.value = 1
    return
  }

  // 输入超过总页数，设置为最后一页
  if (pageInput.value > totalPages.value) {
    currentPage.value = totalPages.value
    pageInput.value = totalPages.value
    return
  }

  // 正常情况，更新页码
  if (pageInput.value !== currentPage.value) {
    currentPage.value = pageInput.value
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-pagination {
  display: flex;
  gap: 16px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  font-weight: normal;
  color: $color-text-primary;

  &__controls {
    display: flex;
    gap: 16px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .bee-pagination__button-prev {
      :deep(.bee-icon) {
        transform: rotate(90deg);
      }
    }

    .bee-pagination__button-next {
      :deep(.bee-icon) {
        transform: rotate(-90deg);
      }
    }
  }

  &__jump {
    display: flex;
    gap: 8px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    input {
      height: 40px;
      padding: 0 20px;
      border: 1px solid;
      border-color: map.get($colors-default, 'border', 'base');
      border-radius: 9999px;
      text-align: center;

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
}
</style>
