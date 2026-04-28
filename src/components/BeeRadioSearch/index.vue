<template>
  <div ref="containerRef" class="bee-radio-search">
    <div class="slider" :style="sliderStyle" />
    <div v-for="(option, index) in options" :key="option.value" class="radio-item" :class="{ active: activeIndex == index }" @click="handleClick(index, option.value)">
      {{ option.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'BeeRadioSearch' })

interface Option {
  label: string
  value: string | number | undefined
}

const props = defineProps<{
  default?: string | number
  options: Option[]
}>()

const emit = defineEmits<{
  select: [value?: string | number]
}>()

const containerRef = ref<HTMLElement>()
const activeIndex = ref<number>(0)

// 计算滑块样式，动态获取宽度
const sliderStyle = computed(() => {
  if (!containerRef.value) return {}
  const items = containerRef.value.querySelectorAll('.radio-item')
  const activeItem = items[activeIndex.value] as HTMLElement
  if (!activeItem) return {}
  return {
    transform: `translateX(${activeItem.offsetLeft}px)`,
    width: `${activeItem.offsetWidth}px`
  }
})

watch(
  () => props.default,
  value => {
    const index = props.options.findIndex(o => o.value == value)
    activeIndex.value = Math.max(0, index)
  },
  { immediate: true }
)

function handleClick(index: number, value?: string | number) {
  activeIndex.value = index
  emit('select', value)
}
</script>

<style lang="scss" scoped>
.bee-radio-search {
  --status-search-slider-offset: 2px;
  height: 32px;
  position: relative;
  display: inline-flex;
  align-items: center;
  background-color: var(--status-search-bg-color);
  border-radius: 16px;
  padding: var(--status-search-slider-offset);
}

.slider {
  position: absolute;
  top: var(--status-search-slider-offset);
  left: 0; // var (--status-search-slider-offset);
  height: calc(100% - var(--status-search-slider-offset) * 2);
  background-color: var(--status-search-slider-bg-color);
  border-radius: 16px;
  transition:
    transform 0.25s ease,
    width 0.25s ease;
}

.radio-item {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  padding: 0 16px;
  font-size: 12px;
  color: var(--status-search-color);
  cursor: pointer;
  transition: color 0.25s ease;
  user-select: none;
  white-space: nowrap;

  &.active {
    color: var(--status-search-active-color);
  }
}
</style>
