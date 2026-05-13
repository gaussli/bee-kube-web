<template>
  <div ref="triggerRef" class="bee-select" :class="{ 'is-disabled': disabled }" @click="toggle">
    <div class="bee-select__trigger">
      <span class="bee-select__value">
        {{ selectedLabel || placeholder }}
      </span>
      <BeeIcon name="basic/arrow-down" class="bee-select__arrow" :class="{ 'is-open': isOpen }" />
    </div>
  </div>
  <Teleport to="body">
    <Transition name="bee-select">
      <div v-if="isOpen" ref="floatingRef" class="bee-select__menu" :style="floatingStyles" @click.stop>
        <div v-for="option in options" :key="option[valueKey]" class="bee-select__option" :class="{ 'is-selected': option[valueKey] === modelValue }" @click="handleSelect(option)">
          <span>{{ option[labelKey] }}</span>
          <BeeIcon v-if="option[valueKey] === modelValue" name="basic/check" class="bee-select__check" />
        </div>
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
import { flip, offset, shift, useFloating } from '@floating-ui/vue'
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
    /** 是否禁用 */
    disabled?: boolean
  }>(),
  {
    modelValue: undefined,
    options: () => [],
    labelKey: 'label',
    valueKey: 'value',
    placeholder: '请选择',
    disabled: false
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

/** 选中的标签文本 */
const selectedLabel = computed(() => {
  if (props.modelValue === undefined || props.modelValue === null) return ''
  const selected = props.options.find(opt => opt[props.valueKey] === props.modelValue)
  return selected ? selected[props.labelKey] : ''
})

/** floating-ui 定位 */
const { floatingStyles } = useFloating(triggerRef, floatingRef, {
  placement: 'bottom-start',
  middleware: [offset(4), flip(), shift({ padding: 8 })]
})

/** 切换展开状态 */
function toggle() {
  if (props.disabled) return
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
    if (props.disabled) return
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

<style lang="scss" scoped>
.bee-select {
  position: relative;
  display: inline-block;

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &__trigger {
    display: flex;
    gap: $spacing-sm;
    align-items: center;
    min-width: 160px;
    padding: $spacing-sm $spacing-md;
    border: 1px solid $border-regular;
    border-radius: $radius-sm;
    background: $bg-overlay;
    cursor: pointer;
    transition: border-color 0.2s;

    &:hover {
      border-color: $border-hover;
    }
  }

  &__value {
    flex: 1;
    font-size: $font-size-base;
    color: $text-regular;

    &:empty::before {
      color: $text-placeholder;
      content: attr(data-placeholder);
    }
  }

  &__arrow {
    width: 14px;
    height: 14px;
    color: $text-secondary;
    transition: transform 0.2s;

    &.is-open {
      transform: rotate(180deg);
    }
  }

  &__menu {
    z-index: 1000;
    min-width: 160px;
    padding: $spacing-xs 0;
    border-radius: $radius-sm;
    background: $bg-overlay;
    box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
  }

  &__option {
    display: flex;
    gap: $spacing-sm;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-base;
    color: $text-regular;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: $bg-hover;
    }

    &.is-selected {
      color: $color-primary;
      background: rgba($color-primary, 0.1);
    }
  }

  &__check {
    width: 14px;
    height: 14px;
    color: $color-primary;
  }
}

// 过渡动画
.bee-select-enter-active,
.bee-select-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.bee-select-enter-from,
.bee-select-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
