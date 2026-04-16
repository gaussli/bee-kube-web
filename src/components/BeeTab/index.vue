<template>
  <div class="bee-tab">
    <div class="tab-header">
      <div class="slider" :style="sliderStyle" />
      <div v-for="(tab, index) in tabs" :key="tab.key" class="tab-item" :class="{ active: activeIndex === index }" @click="handleClick(index)">
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
  transform: `translateX(${activeIndex.value * 100}%)`
}))

watch(
  () => props.modelValue,
  val => {
    const index = props.tabs.findIndex(t => t.key === val)
    if (index !== -1) {
      activeIndex.value = index
    }
  },
  { immediate: true }
)

watch(
  () => props.tabs,
  tabs => {
    const index = tabs.findIndex(t => t.key === props.modelValue)
    activeIndex.value = index !== -1 ? index : 0
  },
  { immediate: true }
)

function handleClick(index: number) {
  activeIndex.value = index
  emit('update:modelValue', props.tabs[index].key)
}
</script>

<style lang="scss" scoped>
.bee-tab {
  --tab-height: 36px;
  --slider-offset: 2px;
  --slider-bg-color: #fff;

  .tab-header {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #f5f7fa;
    border-radius: 9px 9px 0 0;
    padding: var(--slider-offset);
    height: var(--tab-height);
  }

  .slider {
    position: absolute;
    top: var(--slider-offset);
    left: var(--slider-offset);
    height: calc(100% - var(--slider-offset) * 2);
    background-color: var(--slider-bg-color);
    border-radius: 8px;
    transition: transform 0.25s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    z-index: 1;
    font-size: 12px;
    color: #909399;
    cursor: pointer;
    transition: color 0.25s ease;
    user-select: none;

    &.active {
      color: #409eff;
    }
  }

  .tab-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: $bg-color;
    padding: 16px;
    padding-top: 8px;
    border-radius: 0 0 9px 9px;
  }
}
</style>
