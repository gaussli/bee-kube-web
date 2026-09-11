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
        <BeeIcon v-if="!disabled" class="bee-field-input__input-clear" name="basic-close" @click="handleClear" />
      </div>
    </div>
    <!-- 提示区域 -->
    <div v-if="!disabled" class="bee-field-input__tip" :class="[tipStatusClass]">
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
    id: string
    label: string
    icon?: string
    size?: 'default' | 'small' | 'large'
    required?: boolean
    clearable?: boolean
    disabled?: boolean
    maxLength?: number
    tip?: string
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
    validator: () => undefined,
  },
)

// ==================== Reactive State ====================
const isComposing = ref<boolean>(false)
const isChange = ref<boolean>(false)
const tipRef = ref<string>(props.tip)
const tipIconName = ref<string>('basic-info')
const tipStatusClass = ref<string>('')

// ==================== Computed ====================
const disabledClass = computed(() => (props.disabled ? 'is-disabled' : ''))

// ==================== Vueuse ====================
const debouncedValidate = useDebounceFn((value: string) => {
  validate(value)
}, 300)

// ==================== Method ====================
function validate(value: string) {
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
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-field-input {
  display: flex;
  gap: 8px;
  flex-direction: column;
  width: 100%;

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
    align-items: center;
    width: 100%;
    height: 32px;
    padding: 0 14px;
    border: 1px solid;
    border-color: map.get($colors-default, 'border', 'base');
    border-radius: 9999px;
    font-size: 14px;
    font-weight: normal;
    color: $color-text-primary;

    input {
      width: 100%;
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

      &:hover {
        color: map.get($colors-primary, 'text', 'base');
      }
    }

    &:hover {
      .bee-field-input__input-icon {
        opacity: 1;
      }
    }

    &.is-disabled {
      background: map.get($colors-default, 'bg', 'hover');
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
    color: $color-text-third;

    &--success {
      color: map.get($colors-success, 'text', 'base');
    }

    &--danger {
      color: map.get($colors-danger, 'text', 'base');
    }
  }
}
</style>
