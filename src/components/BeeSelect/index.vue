<template>
  <div ref="triggerRef" v-bind="$attrs" class="bee-select" :class="{ 'is-open': isOpen }" :style="widthStyle" @click="toggle">
    <div class="bee-select__trigger">
      <span class="bee-select__value" :class="{ 'is-placeholder': !selectedLabel }">{{ selectedLabel || placeholder }}</span>
      <BeeIcon class="bee-select__arrow-icon" :class="{ 'is-open': isOpen }" name="basic-arrow-down" :size="14" />
    </div>
  </div>

  <Teleport to="body" :disabled="!isOpen">
    <Transition name="bee-select">
      <div v-if="isOpen" ref="floatingRef" class="bee-select__menu" :style="[floatingStyles, widthStyle]" @click.stop>
        <div v-for="option in options" :key="option.value" class="bee-select__menu-item" :class="{ 'is-selected': option.value === modelValue }" @click="handleSelect(option)">
          <BeeIcon v-if="option.icon" class="bee-select__menu-icon" :name="option.icon" :size="14" />
          <span>{{ option.label }}</span>
        </div>
        <div ref="arrowRef" class="bee-select__arrow" :style="arrowStyle" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * BeeSelect 选择器组件
 * 使用 floating-ui 实现智能定位
 * @module components/BeeSelect
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { arrow, flip, offset, shift, useFloating } from '@floating-ui/vue'
import type { SelectOption } from './types'
import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeSelect' })

// ==================== Props ====================

const props = withDefaults(
  defineProps<{
    /** 选中值（v-model） */
    modelValue?: string | number
    /** 选项列表 */
    options?: SelectOption[]
    /** 占位文本 */
    placeholder?: string
    /** 组件宽度（px） */
    width?: number
  }>(),
  {
    modelValue: undefined,
    options: () => [],
    placeholder: '请选择',
    width: 120
  }
)

// ==================== Emits ====================

const emit = defineEmits<{
  /** v-model 更新 */
  'update:modelValue': [value: string | number | undefined]
  /** 选中值变化 */
  'change': [value: string | number | undefined]
  /** 展开状态变化 */
  'visible-change': [visible: boolean]
}>()

// ==================== Refs ====================

/** 是否展开 */
const isOpen = ref(false)
/** 触发器元素引用 */
const triggerRef = ref<HTMLElement>()
/** 菜单浮层元素引用 */
const floatingRef = ref<HTMLElement>()
/** 箭头元素引用 */
const arrowRef = ref<HTMLElement>()

// ==================== Computed ====================

/** 当前选中项标签文本 */
const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected?.label ?? ''
})

/** 组件宽度样式 */
const widthStyle = computed(() => ({ width: `${props.width}px` }))

// ==================== Floating-UI 定位 ====================

const { floatingStyles, middlewareData, placement } = useFloating(triggerRef, floatingRef, {
  placement: 'bottom-start',
  middleware: [offset(12), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })]
})

/** 箭头定位样式 */
const arrowStyle = computed(() => {
  const arrowData = middlewareData.value.arrow
  if (!arrowData) return {}

  const staticSideMap: Record<string, string> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right'
  }
  const { x, y } = arrowData
  const side = placement.value.split('-')[0]
  const staticSide = staticSideMap[side] || 'bottom'

  return {
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : '',
    [staticSide]: '-4px'
  }
})

// ==================== Methods ====================

/** 切换展开/收起 */
function toggle() {
  isOpen.value = !isOpen.value
  emit('visible-change', isOpen.value)
}

/** 选中选项 */
function handleSelect(option: SelectOption) {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
  emit('visible-change', false)
}

/** 点击外部区域关闭菜单 */
function handleClickOutside(event: MouseEvent) {
  if (!isOpen.value) return
  const target = event.target as Node
  if (!triggerRef.value?.contains(target) && !floatingRef.value?.contains(target)) {
    isOpen.value = false
    emit('visible-change', false)
  }
}

// ==================== Lifecycle ====================

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// ==================== Expose ====================

defineExpose({
  /** 是否展开 */
  isOpen,
  /** 展开菜单 */
  show: () => {
    isOpen.value = true
    emit('visible-change', true)
  },
  /** 收起菜单 */
  hide: () => {
    isOpen.value = false
    emit('visible-change', false)
  },
  /** 获取当前选中值 */
  getValue: () => props.modelValue,
  /** 获取当前选中项 */
  getSelected: () => props.options.find(opt => opt.value === props.modelValue)
})
</script>

<style lang="scss" scoped>
@use 'sass:map';

// ==================== 触发器 ====================

.bee-select {
  display: inline-block;
  height: 32px;

  &__trigger {
    display: flex;
    gap: $spacing-8;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 $spacing-16;
    border: 1px solid $color-border-secondary;
    border-radius: $radius-full;
    font-size: $font-size-14;
    color: $color-text-secondary;
    background: var(--bee-select-bg, transparent);
    cursor: pointer;
    transition: border-color 0.2s;
  }

  // 展开时边框高亮
  &.is-open &__trigger {
    border-color: map.get($colors, 'primary', 50);
  }

  &__value {
    flex: 1;

    &.is-placeholder {
      color: $color-text-placeholder;
    }
  }

  &__arrow-icon {
    transition: transform 0.2s;

    &.is-open {
      transform: rotate(180deg);
    }
  }
}

// ==================== 下拉菜单 ====================

.bee-select__menu {
  // CSS 变量：使用者可覆盖菜单背景和阴影
  --bee-select-menu-bg: #{$bg-overlay};
  --bee-select-menu-shadow: #{0 4px 12px rgb(0 0 0 / 30%)};

  position: relative;
  z-index: 1000;
  border-radius: $radius-8;
  background: var(--bee-select-menu-bg);
  box-shadow: var(--bee-select-menu-shadow);
}

.bee-select__arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  border-top-left-radius: 4px;
  background: var(--bee-select-menu-bg);
  transform: rotate(45deg);
}

.bee-select__menu-item {
  position: relative;
  z-index: 1;
  display: flex;
  gap: $spacing-8;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-8 $spacing-16;
  margin: $spacing-8;
  border-radius: $radius-full;
  font-size: $font-size-12;
  color: $color-text-regular;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    z-index: 2;
    background: $color-primary;
  }

  &.is-selected {
    background: rgba($color-primary, 0.1);
  }
}

.bee-select__menu-icon {
  flex-shrink: 0;
  color: $color-text-secondary;
}

// ==================== 过渡动画 ====================

.bee-select-enter-active,
.bee-select-leave-active {
  transition: opacity 0.15s ease;
}

.bee-select-enter-from,
.bee-select-leave-to {
  opacity: 0;
}
</style>
