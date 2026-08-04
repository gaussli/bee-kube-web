<template>
  <div ref="containerRef" class="bee-segmented-control">
    <div class="bee-segmented-control__slider" :style="sliderStyle" />
    <div
      v-for="(option, index) in options"
      :key="option.value"
      class="bee-segmented-control__item"
      :class="{ active: activeIndex === index }"
      @click="handleClick(index, option.value)"
    >
      <BeeIcon v-if="option.icon" :name="option.icon" :size="14" class="bee-segmented-control__icon" />
      {{ option.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 分段控制器组件
 * @module components/BeeSegmentedControl
 */
import { computed, ref, watch, nextTick, onMounted } from 'vue'

import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeSegmentedControl' })

/** 分段控制器选项 */
interface Option {
  /** 选项文本 */
  label: string
  /** 选项值 */
  value: string | number | undefined
  /** 图标名称 */
  icon?: string
}

const props = defineProps<{
  /** 当前选中值（v-model 双向绑定） */
  modelValue?: string | number
  /** 选项列表 */
  options: Option[]
}>()

const emit = defineEmits<{
  /** v-model 更新事件 */
  'update:modelValue': [value?: string | number]
  /** 选项选中事件 */
  'select': [value?: string | number]
}>()

const containerRef = ref<HTMLElement>()
const activeIndex = ref<number>(0)

/**
 * 计算滑块样式，根据当前选中项动态设置位置和宽度
 */
const sliderStyle = computed(() => {
  if (!containerRef.value) return {}
  const items = containerRef.value.querySelectorAll('.bee-segmented-control__item')
  const activeItem = items[activeIndex.value] as HTMLElement
  if (!activeItem) return {}
  return {
    transform: `translateX(${activeItem.offsetLeft}px)`,
    width: `${activeItem.offsetWidth}px`,
  }
})

/**
 * 根据 v-model 值同步 activeIndex
 */
function syncActiveIndex(value?: string | number) {
  const index = props.options.findIndex(o => o.value === value)
  activeIndex.value = Math.max(0, index)
}

// DOM 就绪后同步初始选中状态（避免首屏滑块宽度闪动）
onMounted(() => {
  void nextTick(() => {
    syncActiveIndex(props.modelValue)
  })
})

// v-model 外部更新时同步选中状态
watch(
  () => props.modelValue,
  value => {
    syncActiveIndex(value)
  },
)

// options 变化时防止 activeIndex 越界
watch(
  () => props.options,
  () => {
    if (activeIndex.value >= props.options.length) {
      activeIndex.value = 0
    }
  },
)

/**
 * 选项点击处理
 * @param index - 选中项索引
 * @param value - 选中项的值
 */
function handleClick(index: number, value?: string | number) {
  activeIndex.value = index
  emit('update:modelValue', value)
  emit('select', value)
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-segmented-control {
  /* stylelint-disable order/custom-properties-alphabetical-order */
  // ---- 通用 ----
  --bee-segmented-bg: transparent;
  --bee-segmented-color: #{$color-text-primary};
  --bee-segmented-hover-bg: #{rgba(map.get($colors, 'primary', 50), 0.1)};

  // ---- 选中 ----
  --bee-segmented-slider-bg: #{rgba(map.get($colors, 'primary', 50), 0.1)};
  --bee-segmented-slider-border-color: #{map.get($colors, 'primary', 50)};
  --bee-segmented-active-color: #{map.get($colors, 'primary', 50)};
  /* stylelint-enable order/custom-properties-alphabetical-order */

  position: relative;
  display: inline-flex;
  align-items: center;
  height: 32px;
  border-radius: $radius-full;
  background-color: var(--bee-segmented-bg);

  &__slider {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    height: 100%;
    border: 1px solid var(--bee-segmented-slider-border-color);
    border-radius: $radius-full;
    background-color: var(--bee-segmented-slider-bg);
    pointer-events: none;
    transition:
      transform 0.25s ease,
      width 0.25s ease;
  }

  &__item {
    position: relative;
    z-index: 1;
    display: flex;
    gap: $spacing-4;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 $spacing-16;
    font-size: $font-size-14;
    color: var(--bee-segmented-color);
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    transition: color 0.25s ease;

    &:hover {
      border-radius: $radius-full;
      background-color: var(--bee-segmented-hover-bg);
    }

    &.active {
      color: var(--bee-segmented-active-color);
    }
  }
}
</style>
