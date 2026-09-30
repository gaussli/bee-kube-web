<template>
  <div class="bee-switch">
    <!-- 标签行：左侧标题，右侧开关 -->
    <div class="bee-switch__label">
      <div class="bee-switch__label-left">
        <BeeIcon v-if="icon" :name="icon" />
        <span>{{ label }}</span>
        <span v-if="required" class="bee-switch__label-required">*</span>
      </div>
      <div
        :aria-checked="modelValue"
        class="bee-switch__control"
        :class="[checkedClass, disabledClass]"
        role="switch"
        :tabindex="disabled ? -1 : 0"
        @click="handleToggle"
        @keydown.enter.prevent="handleToggle"
        @keydown.space.prevent="handleToggle"
      >
        <span class="bee-switch__control-knob" />
      </div>
    </div>
    <!-- 提示区域 -->
    <div v-if="showTip" class="bee-switch__tip" :class="[tipStatusClass]">
      <BeeIcon :name="tipIconName" />
      <span>{{ tipRef }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'

import type { RuleResult } from '@/validators/types'

import { BEE_FORM_KEY, type BeeFormField } from '@/components/base/BeeForm/context'
import BeeIcon from '@/components/base/BeeIcon/index.vue'

/**
 * 开关
 * @description 布尔值开关，支持标签、必填标记与提示行（与字段组件同构）；
 * 会通过 inject 自动注册到最近的 BeeForm，随表单一起被 `validate()`
 * @remarks 不在 BeeForm 内时行为退化为「带标签与提示的开关」
 * @example
 * ```vue
 * <BeeSwitch v-model="form.immutable" icon="basic-info" label="不可变" tip="开启后数据不可更新" />
 * ```
 */
defineOptions({ name: 'BeeSwitch' })

// ==================== Prop & Emit ====================
const modelValue = defineModel<boolean>({ default: false })
const props = withDefaults(
  defineProps<{
    /** 标签文案 */
    label: string
    /** 标签左侧图标名称，不传则不渲染 */
    icon?: string
    /** 必填标记，为 true 时在标签后渲染红色星号 */
    required?: boolean
    /** 禁用标记：禁用时隐藏提示区且不可切换 */
    disabled?: boolean
    /** 提示文案：传入 validator 时会被校验结果覆盖；未传 validator 时永久展示（为空则整个提示行不渲染） */
    tip?: string
    /** 校验函数：返回 null/undefined 视为通过，否则为错误文案；切换时触发；不传则不校验 */
    validator?: (value: boolean) => RuleResult
  }>(),
  {
    icon: undefined,
    required: false,
    disabled: false,
    tip: '',
    validator: undefined,
  },
)

// ==================== Inject ====================
/** 最近的 BeeForm 上下文，未包裹在 BeeForm 中时为 undefined */
const beeForm = inject(BEE_FORM_KEY, undefined)

// ==================== Reactive State ====================
/** 开关控件引用，用于聚焦 */
const controlRef = ref<HTMLElement>()
const tipRef = ref<string>(props.tip)
const tipIconName = ref<string>('basic-info')
const tipStatusClass = ref<string>('')

// ==================== Computed ====================
/** 开启标记 class 名称 */
const checkedClass = computed(() => (modelValue.value ? 'is-checked' : ''))
/** 禁用标记 class 名称 */
const disabledClass = computed(() => (props.disabled ? 'is-disabled' : ''))
/** 是否传入校验器 */
const hasValidator = computed(() => props.validator !== undefined)
/** 提示行显隐：禁用时隐藏；未传校验器且提示文案为空时隐藏 */
const showTip = computed(() => !props.disabled && (hasValidator.value || tipRef.value !== ''))

// ==================== Method ====================
/**
 * 触发字段校验
 * @description 未传 validator 时直接通过；校验结果写入提示行，同时作为返回值供 BeeForm 聚合
 * @param value - 字段当前值
 * @returns 校验错误文案，通过时为 undefined
 */
function validate(value: boolean): RuleResult {
  if (!props.validator) return
  const result: RuleResult = props.validator(value)
  if (result == null) {
    tipRef.value = 'OK!'
    tipIconName.value = 'basic-success'
    tipStatusClass.value = 'bee-switch__tip--success'
  } else {
    tipRef.value = result
    tipIconName.value = 'basic-danger'
    tipStatusClass.value = 'bee-switch__tip--danger'
  }
  return result
}

/**
 * 清空校验态
 * @description 提示行恢复为初始 tip（初始值为空时整个提示行不渲染）
 */
function clearValidate() {
  tipRef.value = props.tip
  tipIconName.value = 'basic-info'
  tipStatusClass.value = ''
}

// ==================== Handler ====================
/**
 * 切换开关状态并校验
 */
function handleToggle() {
  if (props.disabled) return
  modelValue.value = !modelValue.value
  validate(modelValue.value)
}

// ==================== Lifecycle ====================
/** 注册到最近 BeeForm 的字段实例 */
const field: BeeFormField = {
  validate: () => validate(modelValue.value),
  focus: () => controlRef.value?.focus(),
  clearValidate,
}

onMounted(() => beeForm?.addField(field))

onBeforeUnmount(() => beeForm?.removeField(field))
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-switch {
  /* stylelint-disable order/custom-properties-alphabetical-order */
  --bee-switch-width: 44px;
  --bee-switch-height: 24px;
  --bee-switch-knob-size: 18px;
  --bee-switch-knob-offset: 3px;
  --bee-switch-color-bg: #{map.get($colors-default, 'bg', 'hover')};
  --bee-switch-color-bg-checked: #{map.get($colors-primary, 'border', 'base')};
  --bee-switch-knob-color: #{$color-text-regular};
  --bee-switch-tip-color: #{$color-text-third};

  .bee-switch__tip--success {
    --bee-switch-tip-color: #{map.get($colors-success, 'text', 'base')};
  }

  .bee-switch__tip--danger {
    --bee-switch-tip-color: #{map.get($colors-danger, 'text', 'base')};
  }

  /* stylelint-enable order/custom-properties-alphabetical-order */
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  &__label {
    display: flex;
    gap: 8px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 12px;
    font-weight: normal;
    color: $color-text-third;
    user-select: none;

    &-left {
      display: flex;
      gap: 8px;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      .bee-switch__label-required {
        font-weight: bold;
        color: map.get($colors-danger, 'text', 'base');
      }
    }
  }

  &__control {
    position: relative;
    flex-shrink: 0;
    width: var(--bee-switch-width);
    height: var(--bee-switch-height);
    border-radius: 9999px;
    background: var(--bee-switch-color-bg);
    cursor: pointer;
    transition: background 0.3s ease;

    &-knob {
      position: absolute;
      top: var(--bee-switch-knob-offset);
      left: var(--bee-switch-knob-offset);
      width: var(--bee-switch-knob-size);
      height: var(--bee-switch-knob-size);
      border-radius: 50%;
      background: var(--bee-switch-knob-color);
      transition: transform 0.3s ease;
    }

    &.is-checked {
      background: var(--bee-switch-color-bg-checked);

      .bee-switch__control-knob {
        transform: translateX(
          calc(var(--bee-switch-width) - var(--bee-switch-knob-size) - var(--bee-switch-knob-offset) * 2)
        );
      }
    }

    &.is-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__tip {
    display: flex;
    gap: 4px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    font-size: 12px;
    font-weight: normal;
    color: var(--bee-switch-tip-color);
  }
}
</style>
