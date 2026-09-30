<template>
  <div class="bee-field-number">
    <!-- 标签 -->
    <div class="bee-field-number__label">
      <div class="bee-field-number__label-left">
        <BeeIcon v-if="icon" :name="icon" />
        <span>{{ label }}</span>
        <span v-if="required" class="bee-field-number__label-required">*</span>
      </div>
    </div>
    <!-- 数字步进器：左减、中间手动输入、右加 -->
    <div class="bee-field-number__stepper" :class="[disabledClass]">
      <BeeIconButton aria-label="减少" :disabled="isMinusDisabled" icon="basic-minus" @click="handleStep(-step)" />
      <input
        :id="id"
        ref="inputRef"
        autocomplete="off"
        class="bee-field-number__stepper-input"
        :disabled="disabled"
        inputmode="numeric"
        :maxlength="maxLength"
        :placeholder="placeholder"
        :value="inputText"
        @blur="handleBlur"
        @input="handleInput"
        @keydown.down.prevent="handleStep(-step)"
        @keydown.up.prevent="handleStep(step)"
      />
      <BeeIconButton aria-label="增加" :disabled="isPlusDisabled" icon="basic-plus" @click="handleStep(step)" />
    </div>
    <!-- 提示区域 -->
    <div v-if="showTip" class="bee-field-number__tip" :class="[tipStatusClass]">
      <BeeIcon :name="tipIconName" />
      <span>{{ tipRef }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { RuleResult } from '@/validators/types'

import { BEE_FORM_KEY, type BeeFormField } from '@/components/base/BeeForm/context'
import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeIconButton from '@/components/base/BeeIconButton/index.vue'

/**
 * 数字表单字段
 * @description 与 `BeeFieldInput` / `BeeFieldSelect` 同构的表单字段，控件为「左减 / 中间输入 / 右加」的数字步进器。
 * 输入只接受数字字符（不接受负号与小数点），上下方向键与两侧按钮按 `step` 增减并夹紧到 `min` / `max`；
 * 值为空时 `v-model` 为 `undefined`
 * @remarks 会通过 inject 自动注册到最近的 BeeForm，随表单一起被 `validate()`
 * @example
 * ```vue
 * <BeeFieldNumber v-model="form.replicas" icon="kubernetes-scale" id="replicas" label="副本数" :validator="validateReplicas" />
 * ```
 */
defineOptions({ name: 'BeeFieldNumber' })

// ==================== Prop & Emit ====================
const modelValue = defineModel<number>()
const props = withDefaults(
  defineProps<{
    /** 输入框 id，透传给原生 input，便于外部 label 关联 */
    id: string
    /** 标签文案 */
    label: string
    /** 标签左侧图标名称，不传则不渲染 */
    icon?: string
    /** 必填标记，为 true 时在标签后渲染红色星号 */
    required?: boolean
    /** 禁用标记：禁用时隐藏提示区且不可增减 */
    disabled?: boolean
    /** 输入框占位文案 */
    placeholder?: string
    /** 最小值，达到该值时「减少」按钮不可用 */
    min?: number
    /** 最大值，不传则不限，达到该值时「增加」按钮不可用 */
    max?: number
    /** 每次增减的步长 */
    step?: number
    /** 最大输入长度，透传给原生 input */
    maxLength?: number
    /** 提示文案：传入 validator 时会被校验结果覆盖；未传 validator 时永久展示（为空则整个提示行不渲染） */
    tip?: string
    /** 校验函数：返回 null/undefined 视为通过，否则为错误文案；输入、失焦与增减时触发；不传则不校验 */
    validator?: (value: number | undefined) => RuleResult
  }>(),
  {
    icon: undefined,
    required: false,
    disabled: false,
    placeholder: '',
    min: 0,
    max: undefined,
    step: 1,
    maxLength: 10,
    tip: '',
    validator: undefined,
  },
)

// ==================== Inject ====================
/** 最近的 BeeForm 上下文，未包裹在 BeeForm 中时为 undefined */
const beeForm = inject(BEE_FORM_KEY, undefined)

// ==================== Reactive State ====================
/** 输入框引用，用于聚焦 */
const inputRef = ref<HTMLInputElement>()
/** 输入框文本：承载输入中间态（如清空待输入），与 v-model 的数值双向同步 */
const inputText = ref<string>(modelValue.value == null ? '' : String(modelValue.value))
const tipRef = ref<string>(props.tip)
const tipIconName = ref<string>('basic-info')
const tipStatusClass = ref<string>('')

// ==================== Computed ====================
const disabledClass = computed(() => (props.disabled ? 'is-disabled' : ''))
/** 是否传入校验器 */
const hasValidator = computed(() => props.validator !== undefined)
/** 提示行显隐：禁用时隐藏；未传校验器且提示文案为空时隐藏 */
const showTip = computed(() => !props.disabled && (hasValidator.value || tipRef.value !== ''))
/** 「减少」是否禁用：已到最小值 */
const isMinusDisabled = computed(
  () => props.disabled || (modelValue.value != null && props.min != null && modelValue.value <= props.min),
)
/** 「增加」是否禁用：已到最大值 */
const isPlusDisabled = computed(
  () => props.disabled || (modelValue.value != null && props.max != null && modelValue.value >= props.max),
)

// ==================== Method ====================
/**
 * 同步输入框文本与 v-model 数值
 * @description 输入框受 `inputText` 控制，非数字字符被过滤、夹紧后数值变化时都需要手动纠正 DOM 值
 * @param value - 数值，undefined 表示空
 */
function applyValue(value: number | undefined) {
  const nextText = value == null ? '' : String(value)
  inputText.value = nextText
  modelValue.value = value
  if (inputRef.value && inputRef.value.value !== nextText) inputRef.value.value = nextText
}

/**
 * 设置数值并夹紧到 min / max 之间
 * @param value - 目标数值
 */
function setValue(value: number) {
  let next = value
  if (props.min != null) next = Math.max(next, props.min)
  if (props.max != null) next = Math.min(next, props.max)
  applyValue(next)
}

/**
 * 触发字段校验
 * @description 未传 validator 时直接通过；校验结果写入提示行，同时作为返回值供 BeeForm 聚合
 * @param value - 字段当前值
 * @returns 校验错误文案，通过时为 undefined
 */
function validate(value: number | undefined): RuleResult {
  if (!props.validator) return
  const result: RuleResult = props.validator(value)
  if (result == null) {
    tipRef.value = 'OK!'
    tipIconName.value = 'basic-success'
    tipStatusClass.value = 'bee-field-number__tip--success'
  } else {
    tipRef.value = result
    tipIconName.value = 'basic-danger'
    tipStatusClass.value = 'bee-field-number__tip--danger'
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
 * 手动输入：过滤非数字字符后同步数值
 * @param e
 * @description 输入过程不夹紧 min / max，避免打断输入（越界由校验器提示）
 */
function handleInput(e: Event) {
  const digits = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  applyValue(digits === '' ? undefined : Number(digits))
  validate(modelValue.value)
}

/**
 * 失焦时校验
 */
function handleBlur() {
  validate(modelValue.value)
}

/**
 * 按步长增减数值
 * @param delta - 变化量，正数为增加
 */
function handleStep(delta: number) {
  if (props.disabled) return
  setValue((modelValue.value ?? props.min ?? 0) + delta)
  validate(modelValue.value)
}

// ==================== Watch ====================
/** 外部直接修改 v-model 时同步输入框文本 */
watch(modelValue, value => {
  const nextText = value == null ? '' : String(value)
  if (nextText !== inputText.value) applyValue(value)
})

// ==================== Lifecycle ====================
/** 注册到最近 BeeForm 的字段实例 */
const field: BeeFormField = {
  id: props.id,
  validate: () => validate(modelValue.value),
  focus: () => inputRef.value?.focus(),
  clearValidate,
}

onMounted(() => beeForm?.addField(field))

onBeforeUnmount(() => beeForm?.removeField(field))
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-field-number {
  /* stylelint-disable order/custom-properties-alphabetical-order */
  --bee-field-number-height: 32px;
  --bee-field-number-font-size: 14px;
  --bee-field-number-color: #{$color-text-secondary};
  --bee-field-number-color-border: #{map.get($colors-default, 'border', 'base')};
  --bee-field-number-color-active: #{$color-text-primary};
  --bee-field-number-color-border-active: #{$color-text-secondary};
  --bee-field-number-color-bg-disabled: #{map.get($colors-default, 'bg', 'hover')};
  --bee-field-number-tip-color: #{$color-text-third};

  .bee-field-number__tip--success {
    --bee-field-number-tip-color: #{map.get($colors-success, 'text', 'base')};
  }

  .bee-field-number__tip--danger {
    --bee-field-number-tip-color: #{map.get($colors-danger, 'text', 'base')};
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

      .bee-field-number__label-required {
        font-weight: bold;
        color: map.get($colors-danger, 'text', 'base');
      }
    }
  }

  &__stepper {
    display: flex;
    gap: 4px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: var(--bee-field-number-height);
    padding: 0 4px;
    border: 1px solid;
    border-color: var(--bee-field-number-color-border);
    border-radius: 9999px;
    font-size: var(--bee-field-number-font-size);
    font-weight: normal;
    color: var(--bee-field-number-color);
    transition: border-color 0.3s ease;

    &:focus-within {
      border-color: var(--bee-field-number-color-border-active);
      color: var(--bee-field-number-color-active);
    }

    &.is-disabled {
      background: var(--bee-field-number-color-bg-disabled);
    }

    // 图标按钮尺寸对齐步进器高度（BeeIconButton 默认 40px，此处收紧为 24px）
    :deep(.bee-icon-button) {
      --bee-icon-button-font-size: 14px;
      --bee-icon-button-size: 24px;
    }

    &-input {
      flex: 1;
      height: 100%;
      min-width: 0;
      font-size: inherit;
      color: inherit;
      text-align: center;
      background: transparent;

      &::placeholder {
        color: $color-text-placeholder;
      }
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
    color: var(--bee-field-number-tip-color);
  }
}
</style>
