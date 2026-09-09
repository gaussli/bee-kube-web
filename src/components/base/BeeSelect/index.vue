<template>
  <!-- 触发器：click 时显示下拉菜单选项 -->
  <div ref="triggerRef" class="bee-select__trigger" :class="[openedClass]" :style="[widthStyle]" @click="handleToggle">
    <span class="bee-select__trigger-value" :class="[placeholderClass]">{{ selectedLabel || placeholder }}</span>
    <BeeIcon class="bee-select__trigger-icon-arrow" :class="[openedClass]" name="basic-arrow-down" />
  </div>

  <!-- 下拉菜单选项容器浮层：Teleport 到 body，使用 @floating-ui 智能定位 -->
  <Teleport to="body">
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
/** 触发器元素引用 */
const triggerRef = ref<HTMLElement>()
/** 菜单浮层元素引用 */
const floatingRef = ref<HTMLElement>()
/** 箭头元素引用 */
const arrowRef = ref<HTMLElement>()
/** 是否展开 */
const isOpen = ref(false)

// ==================== Computed ====================
/** 下拉菜单展开标记 class 名称 */
const openedClass = computed(() => (isOpen.value ? 'is-opened' : ''))
/** 占位标记 class 名称 */
const placeholderClass = computed(() => (!selectedLabel.value ? 'is-placeholder' : ''))
/** 组件宽度样式对象 */
const widthStyle = computed(() => {
  const width: string = typeof props.width === 'number' ? `${props.width}px` : props.width
  return {
    width: width,
  }
})
/** 箭头动态定位样式，根据 placement 计算箭头坐标和方向侧偏移 */
const arrowStyle = computed(() => {
  const arrowData = middlewareData.value.arrow
  if (!arrowData) return {}

  const { x, y } = arrowData
  const staticSideMap: Record<string, string> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }
  const side = placement.value.split('-')[0]
  const staticSide = staticSideMap[side] || 'bottom'

  return {
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : '',
    [staticSide]: '-4px',
  }
})
/** 当前选中项标签文本 */
const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === modelValue.value)
  return selected?.label ?? ''
})

// ==================== Floating UI ====================
/**
 * 使用 @floating-ui 实现智能定位，含偏移、翻转、边界约束和箭头
 */
const { floatingStyles, middlewareData, placement } = useFloating(triggerRef, floatingRef, {
  placement: 'bottom-start',
  middleware: [
    offset(12), // tooltip 与触发器间距 12px
    flip(), // 超出视口时自动翻转方向
    shift({ padding: 8 }), // 防止超出视口，保留 8px 安全边距
    arrow({ element: arrowRef }), // 箭头定位
  ],
})

// ==================== Handler ====================
/**
 * 切换展开/收起
 */
function handleToggle() {
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
    border-color: var(--bee-select-color-border-active, map.get($colors-primary, 'border', 'base'));
    color: var(--bee-select-color-text-active, map.get($colors-primary, 'text', 'base'));
    background: var(--bee-select-color-bg-active, map.get($colors-primary, 'bg', 'base'));
  }

  &-value {
    flex: 1;

    .is-placeholder {
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
$bee-select-menu-color-bg: rgb(40 40 40);

.bee-select__menu {
  --bee-select-menu-color-bg: #{$bee-select-menu-color-bg};

  filter: drop-shadow(0 0 4px rgba($bee-select-menu-color-bg, 50%));
  position: relative;
  z-index: 1000;
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 8px;
  border-radius: 8px;
  background: var(--bee-select-menu-color-bg);

  .bee-select__arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    border-top-left-radius: 4px;
    background: var(--bee-select-menu-color-bg);
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
    border: 1px solid;
    border-color: transparent;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: normal;
    color: var(--bee-select-menu-item-color-text, map.get($colors-default, 'text', 'hover'));
    cursor: pointer;
    transition: background 0.3s;

    .bee-select__menu-icon {
      flex-shrink: 0;
    }

    &.bee-select__menu-actived {
      border-color: var(--bee-select-menu-item-color-border-active, map.get($colors-primary, 'border', 'base'));
      color: var(--bee-select-menu-item-color-text-active, map.get($colors-primary, 'text', 'base'));
      background: var(--bee-select-menu-item-color-bg-active, map.get($colors-primary, 'bg', 'base'));
    }

    &:hover {
      border-color: transparent;
      color: var(--bee-select-menu-item-color-text-hover, map.get($colors-default, 'text', 'hover'));
      background: var(--bee-select-menu-item-color-bg-hover, map.get($colors-primary, 'bg', 'hover'));
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
