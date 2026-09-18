<template>
  <div class="bee-field-textarea">
    <!-- 标签 -->
    <div class="bee-field-textarea__label">
      <div class="bee-field-textarea__label-left">
        <BeeIcon v-if="icon" :name="icon" />
        <span>{{ label }}</span>
        <span v-if="required" class="bee-field-textarea__label-required">*</span>
      </div>
      <div class="bee-field-textarea__label-right">
        <span v-if="maxLength"> {{ modelValue?.length }} / {{ maxLength }}</span>
      </div>
    </div>
    <!-- 输入框 -->
    <div class="bee-field-textarea__input" :class="[disabledClass]">
      <textarea
        :id="id"
        ref="textareaRef"
        v-model="modelValue"
        autocomplete="off"
        :disabled="disabled"
        :maxlength="maxLength"
        :rows="rows"
        @blur="handleBlur"
        @compositionend="handleCompositionEnd"
        @compositionstart="handleCompositionStart"
        @input="handleInput"
      />
      <div class="bee-field-textarea__input-icon">
        <BeeIcon
          v-if="disabled && modelValue"
          class="bee-field-textarea__input-copy"
          name="basic-copy"
          @click="handleCopy"
        />
        <BeeIcon
          v-if="!disabled && clearable"
          class="bee-field-textarea__input-clear"
          name="basic-close"
          @click="handleClear"
          @mousedown.prevent
        />
      </div>
    </div>
    <!-- 提示区域 -->
    <div v-if="showTip" class="bee-field-textarea__tip" :class="[tipStatusClass]">
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
    /** 输入框 id，透传给原生 textarea，便于外部 label 关联 */
    id: string
    /** 标签文案 */
    label: string
    /** 标签左侧图标名称，不传则不渲染 */
    icon?: string
    /** 文本域行数，决定初始高度 */
    rows?: number
    /** 必填标记，为 true 时在标签后渲染红色星号 */
    required?: boolean
    /** 可清除标记，false 时不渲染清除按钮 */
    clearable?: boolean
    /** 禁用标记：禁用时隐藏提示区与清除按钮，且值非空时显示复制按钮 */
    disabled?: boolean
    /** 最大长度，同时约束原生 textarea 的 maxlength 与标签右侧的字数计数 */
    maxLength?: number
    /** 提示文案：传入 validator 时会被校验结果覆盖；未传 validator 时永久展示（为空则整个提示行不渲染） */
    tip?: string
    /** 校验函数：返回 null/undefined 视为通过，否则为错误文案；输入（防抖 300ms）、中文输入结束、失焦与清空时触发；不传则不校验 */
    validator?: (value: string) => RuleResult
  }>(),
  {
    icon: undefined,
    rows: 3,
    required: false,
    clearable: true,
    disabled: false,
    maxLength: undefined,
    tip: '',
    validator: undefined,
  },
)

// ==================== Reactive State ====================
const textareaRef = ref<HTMLTextAreaElement>()
const isComposing = ref<boolean>(false)
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
    tipStatusClass.value = 'bee-field-textarea__tip--success'
  } else {
    tipRef.value = result
    tipIconName.value = 'basic-danger'
    tipStatusClass.value = 'bee-field-textarea__tip--danger'
  }
}

// ==================== Handler ====================
async function handleInput(e: Event) {
  if (!isComposing.value) {
    await debouncedValidate((e.target as HTMLTextAreaElement).value)
  }
}

function handleCompositionStart() {
  isComposing.value = true
}

async function handleCompositionEnd(e: Event) {
  isComposing.value = false
  await debouncedValidate((e.target as HTMLTextAreaElement).value)
}

function handleBlur(e: Event) {
  validate((e.target as HTMLTextAreaElement).value)
}

async function handleCopy() {
  if (!modelValue.value) return
  await useClipboard().copy(modelValue.value)
}

function handleClear() {
  modelValue.value = ''
  validate('')
  textareaRef.value?.focus()
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-field-textarea {
  /* stylelint-disable order/custom-properties-alphabetical-order */
  --bee-field-textarea-padding: 10px 14px;
  --bee-field-textarea-font-size: 14px;
  --bee-field-textarea-radius: 16px;
  --bee-field-textarea-color: #{$color-text-secondary};
  --bee-field-textarea-color-border: #{map.get($colors-default, 'border', 'base')};
  --bee-field-textarea-color-active: #{$color-text-primary};
  --bee-field-textarea-color-border-active: #{$color-text-secondary};
  --bee-field-textarea-color-bg-disabled: #{map.get($colors-default, 'bg', 'hover')};
  --bee-field-textarea-tip-color: #{$color-text-third};

  .bee-field-textarea__tip--success {
    --bee-field-textarea-tip-color: #{map.get($colors-success, 'text', 'base')};
  }

  .bee-field-textarea__tip--danger {
    --bee-field-textarea-tip-color: #{map.get($colors-danger, 'text', 'base')};
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

      .bee-field-textarea__label-required {
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
    padding: var(--bee-field-textarea-padding);
    border: 1px solid;
    border-color: var(--bee-field-textarea-color-border);
    border-radius: var(--bee-field-textarea-radius);
    font-size: var(--bee-field-textarea-font-size);
    font-weight: normal;
    color: var(--bee-field-textarea-color);

    textarea {
      resize: none;
      flex: 1;
      min-width: 0;
      line-height: 1.5;
    }

    &-icon {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      align-self: flex-end;
      width: 32px;
      height: 32px;
      margin: 0 -8px -8px 0;
      opacity: 0;
      cursor: pointer;
      transition: opacity 0.3s ease;

      &:hover {
        color: map.get($colors-primary, 'text', 'base');
      }
    }

    &:hover {
      .bee-field-textarea__input-icon {
        opacity: 1;
      }
    }

    &:focus-within {
      border-color: var(--bee-field-textarea-color-border-active);
      color: var(--bee-field-textarea-color-active);
    }

    &.is-disabled {
      background: var(--bee-field-textarea-color-bg-disabled);
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
    color: var(--bee-field-textarea-tip-color);
  }
}
</style>
