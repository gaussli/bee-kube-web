<template>
  <div class="bee-tab">
    <div class="tab-header">
      <div class="slider" :style="sliderStyle" />
      <div
        v-for="(tab, index) in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeIndex === index }"
        @click="handleClick(index)"
      >
        <el-icon v-if="tab.icon">
          <component :is="tab.icon" />
        </el-icon>
        <span>{{ tab.label }}</span>
      </div>
    </div>
    <div class="tab-content">
      <slot :name="tabs[activeIndex]?.key" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'BeeTab' })

export interface Tab {
  key: string
  label: string
  icon?: any
}

const props = defineProps<{
  modelValue: string
  tabs: Tab[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const activeIndex = ref(0)

const sliderStyle = computed(() => ({
  width: `calc((100% - 4px) / ${props.tabs.length})`,
  transform: `translateX(${activeIndex.value * 100}%)`,
}))

watch(
  () => props.modelValue,
  val => {
    const index = props.tabs.findIndex(t => t.key === val)
    if (index !== -1) {
      activeIndex.value = index
    }
  },
  { immediate: true },
)

watch(
  () => props.tabs,
  tabs => {
    const index = tabs.findIndex(t => t.key === props.modelValue)
    activeIndex.value = index !== -1 ? index : 0
  },
  { immediate: true },
)

function handleClick(index: number) {
  activeIndex.value = index
  emit('update:modelValue', props.tabs[index].key)
}
</script>

<style lang="scss" scoped>
.bee-tab {
  --slider-bg-color: #fff;
  --slider-offset: 2px;
  --tab-height: 36px;

  .tab-header {
    position: relative;
    display: flex;
    align-items: center;
    height: var(--tab-height);
    padding: var(--slider-offset);
    border-radius: 9px 9px 0 0;
    background-color: #f5f7fa;
  }

  .slider {
    position: absolute;
    top: var(--slider-offset);
    left: var(--slider-offset);
    height: calc(100% - var(--slider-offset) * 2);
    border-radius: 8px;
    background-color: var(--slider-bg-color);
    box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
    transition: transform 0.25s ease;
  }

  .tab-item {
    z-index: 1;
    display: flex;
    gap: 6px;
    justify-content: center;
    align-items: center;
    flex: 1;
    font-size: 12px;
    color: #909399;
    cursor: pointer;
    user-select: none;
    transition: color 0.25s ease;

    &.active {
      color: #409eff;
    }
  }

  .tab-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 16px;
    padding-top: 8px;
    border-radius: 0 0 9px 9px;
    overflow: hidden;
    background-color: $color-bg-page;
  }
}
</style>
