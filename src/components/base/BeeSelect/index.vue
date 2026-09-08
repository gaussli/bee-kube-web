<template>
  <!-- 触发器：click 时显示下拉菜单选项 -->
  <div ref="triggerRef" class="bee-select__trigger" :class="[openedClass]" :style="[widthStyle]" @click="toggle">
    <span class="bee-select__trigger-value" :class="[placeholderClass]">{{ selectedLabel || placeholder }}</span>
    <BeeIcon class="bee-select__trigger-icon-arrow" :class="[openedClass]" name="basic-arrow-down" />
  </div>

  <!-- 下拉菜单选项容器浮层：Teleport 到 body，使用 @floating-ui 智能定位 -->
  <Teleport :disabled="!isOpen" to="body">
    <Transition name="bee-select">
      <div v-if="isOpen" ref="floatingRef" class="bee-select__menu" :style="[floatingStyles, widthStyle]" @click.stop>
        <div
          v-for="option in options"
          :key="option.value"
          class="bee-select__menu-item"
          :class="{ 'bee-select__menu-actived': option.value === modelValue }"
          @click="handleSelect(option)"
        >
          <BeeIcon v-if="option.icon" class="bee-select__menu-icon" :name="option.icon" />
          <span>{{ option.label }}</span>
        </div>
        <div ref="arrowRef" class="bee-select__arrow" :style="arrowStyle" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { arrow, flip, offset, shift, useFloating } from '@floating-ui/vue'

import type { SelectOption } from './types'

import BeeIcon from '@/components/base/BeeIcon/index.vue'

defineOptions({ name: 'BeeSelect' })

// ==================== Prop & Emit ====================
const modelValue = defineModel<string | number | undefined>()
const props = withDefaults(
  defineProps<{
    /** 选项列表 */
    options?: SelectOption[]
    /** 占位文本 */
    placeholder?: string
    /** 组件宽度（px） */
    width?: number | string
  }>(),
  {
    options: () => [],
    placeholder: '请选择',
    width: 120,
  },
)

const emit = defineEmits<{
  /** 选中值变化 */
  'change': [value: string | number | undefined]
  /** 展开状态变化 */
  'visible-change': [visible: boolean]
}>()

// ==================== Reactive State ====================
/** 是否展开 */
const isOpen = ref(false)
/** 触发器元素引用 */
const triggerRef = ref<HTMLElement>()
/** 菜单浮层元素引用 */
const floatingRef = ref<HTMLElement>()
/** 箭头元素引用 */
const arrowRef = ref<HTMLElement>()

// ==================== Computed ====================
const openedClass = computed(() => (isOpen.value ? 'is-opened' : ''))
const placeholderClass = computed(() => (!selectedLabel.value ? 'bee-select__trigger-value-placeholder' : ''))
const widthStyle = computed(() => {
  const width: string = typeof props.width === 'number' ? `${props.width}px` : props.width
  return {
    width: width,
  }
})

/** 当前选中项标签文本 */
const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === modelValue.value)
  return selected?.label ?? ''
})

// ==================== Floating-UI 定位 ====================

const { floatingStyles, middlewareData, placement } = useFloating(triggerRef, floatingRef, {
  placement: 'bottom-start',
  middleware: [offset(12), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
})

/** 箭头定位样式 */
const arrowStyle = computed(() => {
  const arrowData = middlewareData.value.arrow
  if (!arrowData) return {}

  const staticSideMap: Record<string, string> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }
  const { x, y } = arrowData
  const side = placement.value.split('-')[0]
  const staticSide = staticSideMap[side] || 'bottom'

  return {
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : '',
    [staticSide]: '-4px',
  }
})

// ==================== Methods ====================

/** 切换展开/收起 */
function toggle() {
  isOpen.value = !isOpen.value
  emit('visible-change', isOpen.value)
}

/**
 * 选中选项
 * @param option
 */
function handleSelect(option: SelectOption) {
  modelValue.value = option.value
  emit('change', option.value)
  isOpen.value = false
  emit('visible-change', false)
}

/**
 * 点击外部区域关闭菜单
 * @param event
 */
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
</script>

<style lang="scss" scoped>
@use 'sass:map';

// ==================== 触发器 ====================
.bee-select__trigger {
  display: flex;
  gap: 8px;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
  padding: 0 20px;
  border: 1px solid;
  border-color: var(--bee-select-color-border, map.get($colors-default, 'border', 'base'));
  border-radius: 9999px;
  font-size: 14px;
  font-weight: normal;
  color: var(--bee-select-color-text, $color-text-primary);
  background: var(--bee-select-color-bg, map.get($colors-default, 'bg', 'base'));
  cursor: pointer;
  transition: border-color 0.3s ease;

  &.is-opened {
    border-color: var(--bee-input-search-color-border-active, map.get($colors-primary, 'border', 'active'));
  }

  &-value {
    flex: 1;

    &-placeholder {
      color: $color-text-placeholder;
    }
  }

  &-icon-arrow {
    transition: transform 0.3s;

    &.is-opened {
      transform: rotate(180deg);
    }
  }
}

// ==================== 下拉菜单 ====================
.bee-select__menu {
  --bee-select-menu-bg: rgb(40 40 40);

  filter: drop-shadow(0 0 4px rgb(var(--bee-select-menu-bg), 50%));
  position: relative;
  z-index: 1000;
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 8px;
  border-radius: 8px;
  background: var(--bee-select-menu-bg);

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
    display: flex;
    gap: 8px;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 8px 16px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: normal;
    color: $color-text-primary;
    cursor: pointer;
    transition: background 0.3s;

    .bee-select__menu-icon {
      flex-shrink: 0;
    }

    &.bee-select__menu-actived {
      background: map.get($colors-primary, 'text', 'base');
    }

    &:hover {
      background: map.get($colors-primary, 'bg', 'hover');
    }
  }
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
