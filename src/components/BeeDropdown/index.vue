<template>
  <div ref="triggerRef" class="bee-dropdown" @click="toggle">
    <slot />
  </div>
  <Teleport to="body">
    <Transition name="bee-dropdown">
      <div v-if="isOpen" ref="floatingRef" class="bee-dropdown__menu" :style="floatingStyles" @click.stop>
        <slot name="dropdown">
          <div v-for="option in options" :key="option[valueKey]" class="bee-dropdown__item" @click="handleSelect(option)">
            <BeeIcon v-if="option.icon" class="bee-dropdown__item-icon" :name="option.icon" :size="14" />
            <span>{{ option[labelKey] }}</span>
          </div>
        </slot>
        <div ref="arrowRef" class="bee-dropdown__arrow" :style="arrowStyle" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * BeeDropdown 下拉菜单组件
 * 使用 floating-ui 实现智能定位
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { arrow, flip, offset, shift, useFloating } from '@floating-ui/vue'
import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeDropdown' })

/** 下拉选项 */
interface DropdownOption {
  [key: string]: any
}

/** 组件属性 */
const props = withDefaults(
  defineProps<{
    /** 选中值（v-model） */
    modelValue?: any
    /** 选项列表 */
    options?: DropdownOption[]
    /** 选项标签字段名 */
    labelKey?: string
    /** 选项值字段名 */
    valueKey?: string
    /** 触发方式 */
    trigger?: 'click' | 'hover'
    /** 弹出位置 */
    placement?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    modelValue: undefined,
    options: () => [],
    labelKey: 'label',
    valueKey: 'value',
    trigger: 'click',
    placement: 'bottom'
  }
)

/** 组件事件 */
const emit = defineEmits<{
  /** v-model 更新 */
  'update:modelValue': [value: any]
  /** 选中变化 */
  'change': [value: any, option?: DropdownOption]
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

/** floating-ui 定位 */
const { floatingStyles, middlewareData, placement } = useFloating(triggerRef, floatingRef, {
  placement: props.placement,
  middleware: [
    offset(8), // dropdown-menu 与触发元素之间的距离
    flip(), // 边界翻转
    shift({ padding: 8 }), // 防止超出视窗
    arrow({ element: arrowRef }) // 箭头
  ]
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
  style[staticSide] = '-5px'
  return style
})

/** 切换展开状态 */
function toggle() {
  if (props.trigger === 'click') {
    isOpen.value = !isOpen.value
    emit('visible-change', isOpen.value)
  }
}

/** 处理选项选中 */
function handleSelect(option: DropdownOption) {
  emit('update:modelValue', option[props.valueKey])
  emit('change', option[props.valueKey], option)
  isOpen.value = false
  emit('visible-change', false)
}

/** 点击外部关闭 */
function handleClickOutside(event: MouseEvent) {
  if (isOpen.value) {
    const target = event.target as Node
    // 判断点击是否在触发器或菜单外部
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
  }
})
</script>

<style lang="scss" scoped>
.bee-dropdown {
  display: inline-block;

  &__menu {
    z-index: 1000;
    max-height: 300px;
    padding: 4px 0;
    border-radius: 4px;
    background: $bg-overlay;
  }

  &__item {
    position: relative;
    z-index: 1;
    display: flex;
    gap: $spacing-sm;
    align-items: center;
    justify-content: center;
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
  }

  &__arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    border-top-left-radius: 4px;
    background: $bg-overlay;
    transform: rotate(45deg);
  }
}

// 过渡动画
.bee-dropdown-enter-active,
.bee-dropdown-leave-active {
  transition: opacity 0.15s ease;
}

.bee-dropdown-enter-from,
.bee-dropdown-leave-to {
  opacity: 0;
}
</style>
