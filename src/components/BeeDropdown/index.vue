<template>
  <div class="bee-dropdown" v-click-outside="handleClickOutside">
    <div class="bee-dropdown__trigger" @click="toggle">
      <slot name="trigger">
        <button class="bee-dropdown__default-trigger">
          <span>{{ placeholder }}</span>
          <el-icon :class="{ 'is-open': isOpen }">
            <ArrowDown />
          </el-icon>
        </button>
      </slot>
    </div>
    <Transition name="bee-dropdown-fade">
      <div v-if="isOpen" class="bee-dropdown__menu" :style="menuStyle">
        <slot>
          <template v-for="(group, gIndex) in normalizedOptions" :key="gIndex">
            <div v-if="group.label" class="bee-dropdown__group-label">
              {{ group.label }}
            </div>
            <div class="bee-dropdown__group">
              <template v-for="(option, oIndex) in group.options" :key="option[valueKey]">
                <div
                  v-if="!option[disabledKey]"
                  class="bee-dropdown__item"
                  :class="{
                    'is-selected': isSelected(option),
                    'is-divided': option.divided
                  }"
                  :style="option.style"
                  @click="handleSelect(option)"
                >
                  <slot name="option" :option="option" :index="oIndex">
                    <div class="bee-dropdown__item-content">
                      <el-icon v-if="option.icon" class="bee-dropdown__item-icon">
                        <component :is="option.icon" />
                      </el-icon>
                      <span>{{ option[labelKey] }}</span>
                    </div>
                  </slot>
                </div>
                <div v-else class="bee-dropdown__item is-disabled" :style="option.style">
                  <slot name="option" :option="option" :index="oIndex">
                    <div class="bee-dropdown__item-content">
                      <el-icon v-if="option.icon" class="bee-dropdown__item-icon">
                        <component :is="option.icon" />
                      </el-icon>
                      <span>{{ option[labelKey] }}</span>
                    </div>
                  </slot>
                </div>
              </template>
            </div>
            <BeeDivider v-if="gIndex < normalizedOptions.length - 1 && group.options?.length" />
          </template>
        </slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import BeeDivider from '@/components/BeeDivider/index.vue'

defineOptions({ name: 'BeeDropdown' })

interface DropdownOption {
  [key: string]: any
}

interface DropdownGroup {
  label?: string
  options: DropdownOption[]
}

const props = withDefaults(
  defineProps<{
    modelValue?: any
    options?: DropdownOption[]
    groups?: DropdownGroup[]
    placeholder?: string
    labelKey?: string
    valueKey?: string
    disabledKey?: string
    trigger?: 'click' | 'hover'
    placement?: 'top' | 'bottom' | 'left' | 'right'
    width?: number | string
  }>(),
  {
    modelValue: undefined,
    options: () => [],
    groups: () => [],
    placeholder: '请选择',
    labelKey: 'label',
    valueKey: 'value',
    disabledKey: 'disabled',
    trigger: 'click',
    placement: 'bottom',
    width: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'change': [value: any, option?: DropdownOption]
  'visible-change': [visible: boolean]
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

const normalizedOptions = computed(() => {
  if (props.groups.length > 0) {
    return props.groups
  }
  if (props.options.length > 0) {
    return [{ options: props.options }]
  }
  return []
})

const menuStyle = computed(() => {
  const style: Record<string, any> = {}
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  return style
})

function isSelected(option: DropdownOption): boolean {
  return option[props.valueKey] === props.modelValue
}

function toggle() {
  if (props.trigger === 'click') {
    isOpen.value = !isOpen.value
    emit('visible-change', isOpen.value)
  }
}

function handleSelect(option: DropdownOption) {
  emit('update:modelValue', option[props.valueKey])
  emit('change', option[props.valueKey], option)
  isOpen.value = false
  emit('visible-change', false)
}

function handleClickOutside() {
  isOpen.value = false
  emit('visible-change', false)
}

function handleMouseEnter() {
  if (props.trigger === 'hover') {
    isOpen.value = true
    emit('visible-change', true)
  }
}

function handleMouseLeave() {
  if (props.trigger === 'hover') {
    isOpen.value = false
    emit('visible-change', false)
  }
}

onMounted(() => {
  const triggerEl = document.querySelector('.bee-dropdown__trigger')
  triggerEl?.addEventListener('mouseenter', handleMouseEnter)
  triggerEl?.addEventListener('mouseleave', handleMouseLeave)
})

onBeforeUnmount(() => {
  const triggerEl = document.querySelector('.bee-dropdown__trigger')
  triggerEl?.removeEventListener('mouseenter', handleMouseEnter)
  triggerEl?.removeEventListener('mouseleave', handleMouseLeave)
})

defineExpose({
  isOpen,
  show: () => {
    isOpen.value = true
    emit('visible-change', true)
  },
  hide: () => {
    isOpen.value = false
    emit('visible-change', false)
  }
})
</script>

<script lang="ts">
// 自定义指令：点击外部关闭
export const clickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el._clickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutside)
  }
}
const vClickOutside = clickOutside
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.bee-dropdown {
  position: relative;
  display: inline-block;

  &__trigger {
    cursor: pointer;
  }

  &__default-trigger {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    padding: 8px 12px;
    border: 1px solid $border-primary;
    border-radius: 4px;
    font-size: 14px;
    color: $text-regular;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: $color-primary;
      color: $color-primary;
    }

    .el-icon {
      transition: transform 0.2s;

      &.is-open {
        transform: rotate(180deg);
      }
    }
  }

  &__menu {
    position: absolute;
    left: 0;
    z-index: 1000;
    min-width: 100%;
    max-height: 300px;
    padding: 4px 0;
    margin-top: 4px;
    border: 1px solid $border-primary;
    border-radius: 4px;
    overflow-y: auto;
    background: $bg-overlay;
    box-shadow: 0 2px 12px rgb(0 0 0 / 15%);
  }

  &__group-label {
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 500;
    color: $text-placeholder;
  }

  &__group {
    // 分组内选项容器
  }

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    font-size: 14px;
    color: $text-regular;
    cursor: pointer;
    transition: background 0.2s;

    &:hover:not(.is-disabled) {
      background: $bg-hover;
    }

    &.is-selected {
      color: $color-primary;
      background: rgba($color-primary, 0.1);

      &::before {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 3px;
        background: $color-primary;
        content: '';
      }
    }

    &.is-disabled {
      color: $text-disabled;
      cursor: not-allowed;

      &:hover {
        background: transparent;
      }
    }

    &.is-divided {
      padding-top: 12px;
      margin-top: 4px;
      border-top: 1px solid $border-secondary;
    }
  }

  &__item-content {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
  }

  &__item-icon {
    flex-shrink: 0;
    font-size: 14px;
  }
}

// 过渡动画
.bee-dropdown-fade-enter-active,
.bee-dropdown-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.bee-dropdown-fade-enter-from,
.bee-dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
