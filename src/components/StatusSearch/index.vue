<template>
  <div class="status-search">
    <div class="slider" :style="sliderStyle" />
    <div v-for="(option, index) in options" :key="option.value" class="status-item" :class="{ active: activeIndex == index }" @click="handleClick(index, option.value)">
      {{ option.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'StatusSearch' })

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

const activeIndex = ref<number>(0)

const sliderStyle = computed(() => {
  return {
    transform: `translateX(${activeIndex.value * 100}%)`
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
.status-search {
  --item-width: 80px;
  --slider-offset: 2px;
  --bg-color: #{$bg-color};
  --slider-bg-color: #fff;
  height: 32px;
  position: relative;
  display: inline-flex;
  align-items: center;
  background-color: var(--bg-color);
  border-radius: 16px;
  padding: var(--slider-offset);
}

.slider {
  position: absolute;
  top: var(--slider-offset);
  left: var(--slider-offset);
  width: var(--item-width);
  height: calc(100% - var(--slider-offset) * 2);
  background-color: var(--slider-bg-color);
  border-radius: 16px;
  transition: transform 0.25s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.status-item {
  width: var(--item-width);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  padding: 0 16px;
  font-size: 12px;
  color: #909399;
  cursor: pointer;
  transition: color 0.25s ease;
  user-select: none;

  &.active {
    color: $primary-color;
  }
}
</style>
