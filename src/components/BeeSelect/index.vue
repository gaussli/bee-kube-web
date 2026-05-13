<template>
  <div ref="triggerRef" class="bee-select" @click="toggle">
    <div class="bee-select__trigger">
      <span class="bee-select__value">
        {{ selectedLabel || placeholder }}
      </span>
      <BeeIcon class="bee-select__arrow-icon" :class="{ 'is-open': isOpen }" name="basic-arrow-down" :size="14" />
    </div>
  </div>
  <Teleport to="body" :disabled="!isOpen">
    <Transition name="bee-select">
      <div v-if="isOpen" ref="floatingRef" class="bee-select__menu" :style="floatingStyles" @click.stop>
        <div v-for="option in options" :key="option[valueKey]" class="bee-select__menu-item" :class="{ 'is-selected': option[valueKey] === modelValue }" @click="handleSelect(option)">
          {{ option[labelKey] }}
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
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { arrow, flip, offset, shift, useFloating } from '@floating-ui/vue'
import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeSelect' })

/** 下拉选项 */
interface SelectOption {
  [key: string]: any
}

/** 组件属性 */
const props = withDefaults(
  defineProps<{
    /** 选中值（v-model） */
    modelValue?: string | number
    /** 选项列表 */
    options?: SelectOption[]
    /** 选项标签字段名 */
    labelKey?: string
    /** 选项值字段名 */
    valueKey?: string
    /** 占位文本 */
    placeholder?: string
  }>(),
  {
    modelValue: undefined,
    options: () => [],
    labelKey: 'label',
    valueKey: 'value',
    placeholder: '请选择'
  }
)

/** 组件事件 */
const emit = defineEmits<{
  /** v-model 更新 */
  'update:modelValue': [value: string | number | undefined]
  /** 选中变化 */
  'change': [value: string | number | undefined, option?: SelectOption]
  /** 展开状态变化 */
  'visible-change': [visible: boolean]
}>()

/** 是否展开 */
const isOpen = ref(false)
/** 触发器元素引用 */
const triggerRef = ref<HTMLElement>()
/** 菜单元素引用 */
const floatingRef = ref<HTMLElement>()
/** 箭头元素引用 */
const arrowRef = ref<HTMLElement>()

/** 选中的标签文本 */
const selectedLabel = computed(() => {
  if (props.modelValue === undefined || props.modelValue === null) return ''
  const selected = props.options.find(opt => opt[props.valueKey] === props.modelValue)
  return selected ? selected[props.labelKey] : ''
})

/** floating-ui 定位 */
const { floatingStyles, middlewareData, placement } = useFloating(triggerRef, floatingRef, {
  placement: 'bottom-start',
  middleware: [offset(12), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })]
})

/** 箭头样式 */
const arrowStyle = computed(() => {
  const arrowData = middlewareData.value.arrow
  if (!arrowData) return {}

  const { x, y } = arrowData
  const staticSideMap: Record<string, string> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right'
  }
  const side = placement.value.split('-')[0]
  const staticSide = staticSideMap[side] || 'bottom'

  const style: Record<string, string> = {
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : ''
  }
  style[staticSide] = '-4px'
  return style
})

/** 切换展开状态 */
function toggle() {
  isOpen.value = !isOpen.value
  emit('visible-change', isOpen.value)
}

/** 处理选项选中 */
function handleSelect(option: SelectOption) {
  const value = option[props.valueKey]
  emit('update:modelValue', value)
  emit('change', value, option)
  isOpen.value = false
  emit('visible-change', false)
}

/** 点击外部关闭 */
function handleClickOutside(event: MouseEvent) {
  if (isOpen.value) {
    const target = event.target as Node
    if (!triggerRef.value?.contains(target) && !floatingRef.value?.contains(target)) {
      isOpen.value = false
      emit('visible-change', false)
    }
  }
}

/** 监听外部点击 */
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

/** 取消监听 */
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

/** 暴露方法供外部调用 */
defineExpose({
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
  /** 获取选中值 */
  getValue: () => props.modelValue,
  /** 获取选中项 */
  getSelected: () => props.options.find(opt => opt[props.valueKey] === props.modelValue)
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<style lang="scss" scoped>
.bee-select {
  display: inline-block;

  &__trigger {
    display: flex;
    gap: $spacing-sm;
    align-items: center;
    height: 32px;
    min-width: 200px;
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-full;
    font-size: $font-size-sm;
    color: $text-secondary;
    background: $bg-color;
    cursor: pointer;
  }

  &__value {
    flex: 1;

    &:empty::before {
      color: $text-placeholder;
      content: attr(data-placeholder);
    }
  }

  &__arrow-icon {
    transition: transform 0.2s;

    &.is-open {
      transform: rotate(180deg);
    }
  }

  &__menu {
    position: relative;
    z-index: 1000;
    min-width: 200px;
    border-radius: $radius-sm;
    background: $bg-overlay;
    box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
  }

  &__arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    border-top-left-radius: 4px;
    background: $bg-overlay;
    transform: rotate(45deg);
  }

  &__menu-item {
    position: relative;
    z-index: 1;
    display: flex;
    gap: $spacing-sm;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-sm $spacing-md;
    margin: $spacing-sm;
    border-radius: $radius-full;
    font-size: $font-size-sm;
    color: $text-regular;
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
}

// 过渡动画
.bee-select-enter-active,
.bee-select-leave-active {
  transition: opacity 0.15s ease;
}

.bee-select-enter-from,
.bee-select-leave-to {
  opacity: 0;
}
</style>
