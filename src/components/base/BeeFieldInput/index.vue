<template>
  <div class="bee-field-input">
    <!-- 标签 -->
    <div class="bee-field-input__label">
      <div class="bee-field-input__label-left">
        <BeeIcon v-if="icon" :name="icon" />
        <span>{{ label }}</span>
        <span v-if="required" class="bee-field-input__label-required">*</span>
      </div>
      <div class="bee-field-input__label-right">
        <span v-if="maxLength"> {{ modelValue?.length }} / {{ maxLength }}</span>
      </div>
    </div>
    <!-- 输入框 -->
    <div class="bee-field-input__input" :class="[disabledClass]">
      <input
        :id="id"
        ref="inputRef"
        v-model="modelValue"
        autocomplete="off"
        :disabled="disabled"
        :maxlength="maxLength"
        @blur="handleBlur"
        @compositionend="handleCompositionEnd"
        @compositionstart="handleCompositionStart"
        @input="handleInput"
      />
      <div class="bee-field-input__input-icon">
        <BeeIcon
          v-if="disabled && modelValue"
          class="bee-field-input__input-copy"
          name="basic-copy"
          @click="handleCopy"
        />
        <BeeIcon
          v-if="!disabled && clearable"
          class="bee-field-input__input-clear"
          name="basic-close"
          @click="handleClear"
          @mousedown.prevent
        />
      </div>
    </div>
    <!-- 提示区域 -->
    <div v-if="showTip" class="bee-field-input__tip" :class="[tipStatusClass]">
      <BeeIcon :name="tipIconName" />
      <span>{{ tipRef }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { useDebounceFn } from '@vueuse/core'

import type { RuleResult } from '@/validators/types'

import BeeIcon from '@/components/base/BeeIcon/index.vue'

import { useClipboard } from '@/composables/useClipboard'

// ==================== Prop & Emit ====================
const modelValue = defineModel<string>()
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
    /** 可清除标记；模板尚未使用，当前清除按钮仅受 disabled 控制 */
    clearable?: boolean
    /** 禁用标记：禁用时隐藏提示区与清除按钮，且值非空时显示复制按钮 */
    disabled?: boolean
    /** 最大长度，同时约束原生 input 的 maxlength 与标签右侧的字数计数 */
    maxLength?: number
    /** 提示文案：传入 validator 时会被校验结果覆盖；未传 validator 时永久展示（为空则整个提示行不渲染） */
    tip?: string
    /** 校验函数：返回 null/undefined 视为通过，否则为错误文案；输入（防抖 300ms）、中文输入结束、失焦与清空时触发；不传则不校验 */
    validator?: (value: string) => RuleResult
  }>(),
  {
    icon: undefined,
    size: 'default',
    required: false,
    clearable: true,
    disabled: false,
    maxLength: undefined,
    tip: '',
    validator: undefined,
  },
)

// ==================== Reactive State ====================
const inputRef = ref<HTMLInputElement>()
const isComposing = ref<boolean>(false)
const isChange = ref<boolean>(false)
const tipRef = ref<string>(props.tip)
const tipIconName = ref<string>('basic-info')
const tipStatusClass = ref<string>('')

// ==================== Computed ====================
const disabledClass = computed(() => (props.disabled ? 'is-disabled' : ''))
/** 是否传入校验器 */
const hasValidator = computed(() => props.validator !== undefined)
/** 提示行显隐：禁用时隐藏；未传校验器且提示文案为空时隐藏 */
const showTip = computed(() => !props.disabled && (hasValidator.value || tipRef.value !== ''))

// ==================== Vueuse ====================
const debouncedValidate = useDebounceFn((value: string) => {
  validate(value)
}, 300)

// ==================== Method ====================
function validate(value: string) {
  if (!props.validator) return
  const result: RuleResult = props.validator(value)
  if (result == null) {
    tipRef.value = 'OK!'
    tipIconName.value = 'basic-success'
    tipStatusClass.value = 'bee-field-input__tip--success'
  } else {
    tipRef.value = result
    tipIconName.value = 'basic-danger'
    tipStatusClass.value = 'bee-field-input__tip--danger'
  }
}

// ==================== Handler ====================
async function handleInput(e: Event) {
  isChange.value = true
  if (!isComposing.value) {
    await debouncedValidate((e.target as HTMLInputElement).value)
  }
}

function handleCompositionStart() {
  isComposing.value = true
  isChange.value = true
}

async function handleCompositionEnd(e: Event) {
  isComposing.value = false
  await debouncedValidate((e.target as HTMLInputElement).value)
}

function handleBlur(e: Event) {
  validate((e.target as HTMLInputElement).value)
}

async function handleCopy() {
  if (!modelValue.value) return
  await useClipboard().copy(modelValue.value)
}

function handleClear() {
  modelValue.value = ''
  validate('')
  inputRef.value?.focus()
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-field-input {
  /* stylelint-disable order/custom-properties-alphabetical-order */
  --bee-field-input-height: 32px;
  --bee-field-input-padding: 0 14px;
  --bee-field-input-font-size: 14px;
  --bee-field-input-color: #{$color-text-secondary};
  --bee-field-input-color-border: #{map.get($colors-default, 'border', 'base')};
  --bee-field-input-color-active: #{$color-text-primary};
  --bee-field-input-color-border-active: #{$color-text-secondary};
  --bee-field-input-color-bg-disabled: #{map.get($colors-default, 'bg', 'hover')};
  --bee-field-input-tip-color: #{$color-text-third};

  .bee-field-input__tip--success {
    --bee-field-input-tip-color: #{map.get($colors-success, 'text', 'base')};
  }

  .bee-field-input__tip--danger {
    --bee-field-input-tip-color: #{map.get($colors-danger, 'text', 'base')};
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

      .bee-field-input__label-required {
        font-weight: bold;
        color: map.get($colors-danger, 'text', 'base');
      }
    }

    &-right {
      display: flex;
      gap: 8px;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
  }

  &__input {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    width: 100%;
    height: var(--bee-field-input-height);
    padding: var(--bee-field-input-padding);
    border: 1px solid;
    border-color: var(--bee-field-input-color-border);
    border-radius: 9999px;
    font-size: var(--bee-field-input-font-size);
    font-weight: normal;
    color: var(--bee-field-input-color);

    input {
      flex: 1;
      min-width: 0;
    }

    &-icon {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      margin-right: -8px;
      opacity: 0;
      cursor: pointer;
      transition: opacity 0.3s ease;

      &:hover {
        color: map.get($colors-primary, 'text', 'base');
      }
    }

    &:hover {
      .bee-field-input__input-icon {
        opacity: 1;
      }
    }

    &:focus-within {
      border-color: var(--bee-field-input-color-border-active);
      color: var(--bee-field-input-color-active);
    }

    &.is-disabled {
      background: var(--bee-field-input-color-bg-disabled);
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
    color: var(--bee-field-input-tip-color);
  }
}
</style>
