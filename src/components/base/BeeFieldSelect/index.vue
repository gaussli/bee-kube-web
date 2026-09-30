<template>
  <div class="bee-field-select">
    <!-- 标签 -->
    <div class="bee-field-select__label">
      <div class="bee-field-select__label-left">
        <BeeIcon v-if="icon" :name="icon" />
        <span>{{ label }}</span>
        <span v-if="required" class="bee-field-select__label-required">*</span>
      </div>
    </div>
    <!-- 下拉选择 -->
    <BeeSelect
      ref="selectRef"
      v-model="modelValue"
      :disabled="disabled"
      :options="options"
      :placeholder="placeholder"
      :width="width"
      @change="handleChange"
    />
    <!-- 提示区域 -->
    <div v-if="showTip" class="bee-field-select__tip" :class="[tipStatusClass]">
      <BeeIcon :name="tipIconName" />
      <span>{{ tipRef }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'

import type { SelectOption } from '@/components/base/BeeSelect/types'

import type { RuleResult } from '@/validators/types'

import { BEE_FORM_KEY, type BeeFormField } from '@/components/base/BeeForm/context'
import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeSelect from '@/components/base/BeeSelect/index.vue'

/**
 * 下拉选择表单字段
 * @description 与 `BeeFieldInput` / `BeeFieldTextarea` 同构的表单字段，内部复用 `BeeSelect` 作为触发器，
 * 提供标签、必填标记、提示行与校验；会通过 inject 自动注册到最近的 BeeForm
 * @remarks 不在 BeeForm 内时行为退化为「带标签与提示的下拉选择」，与其它字段组件一致
 * @example
 * ```vue
 * <BeeFieldSelect v-model="form.namespace" :options="namespaceOptions" label="命名空间" required :validator="validateNamespace" />
 * ```
 */
defineOptions({ name: 'BeeFieldSelect' })

// ==================== Prop & Emit ====================
const modelValue = defineModel<string | number | undefined>()
const props = withDefaults(
  defineProps<{
    /** 标签文案 */
    label: string
    /** 选项列表 */
    options: SelectOption[]
    /** 标签左侧图标名称，不传则不渲染 */
    icon?: string
    /** 占位文本 */
    placeholder?: string
    /** 组件宽度，默认撑满容器；下拉菜单浮层按选项内容自适应 */
    width?: number | string
    /** 必填标记，为 true 时在标签后渲染红色星号 */
    required?: boolean
    /** 禁用标记：禁用时隐藏提示区且不可展开菜单 */
    disabled?: boolean
    /** 提示文案：传入 validator 时会被校验结果覆盖；未传 validator 时永久展示（为空则整个提示行不渲染） */
    tip?: string
    /** 校验函数：返回 null/undefined 视为通过，否则为错误文案；选中变化时触发；不传则不校验 */
    validator?: (value: string | number | undefined) => RuleResult
  }>(),
  {
    icon: undefined,
    placeholder: '请选择',
    width: '100%',
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
/** 内部 BeeSelect 实例，用于聚焦 */
const selectRef = ref<InstanceType<typeof BeeSelect>>()
const tipRef = ref<string>(props.tip)
const tipIconName = ref<string>('basic-info')
const tipStatusClass = ref<string>('')

// ==================== Computed ====================
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
function validate(value: string | number | undefined): RuleResult {
  if (!props.validator) return
  const result: RuleResult = props.validator(value)
  if (result == null) {
    tipRef.value = 'OK!'
    tipIconName.value = 'basic-success'
    tipStatusClass.value = 'bee-field-select__tip--success'
  } else {
    tipRef.value = result
    tipIconName.value = 'basic-danger'
    tipStatusClass.value = 'bee-field-select__tip--danger'
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
 * 选中值变化后立即校验
 */
function handleChange() {
  validate(modelValue.value)
}

// ==================== Lifecycle ====================
/** 注册到最近 BeeForm 的字段实例 */
const field: BeeFormField = {
  validate: () => validate(modelValue.value),
  focus: () => selectRef.value?.focus(),
  clearValidate,
}

onMounted(() => beeForm?.addField(field))

onBeforeUnmount(() => beeForm?.removeField(field))
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-field-select {
  /* stylelint-disable order/custom-properties-alphabetical-order */
  --bee-field-select-tip-color: #{$color-text-third};

  .bee-field-select__tip--success {
    --bee-field-select-tip-color: #{map.get($colors-success, 'text', 'base')};
  }

  .bee-field-select__tip--danger {
    --bee-field-select-tip-color: #{map.get($colors-danger, 'text', 'base')};
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

      .bee-field-select__label-required {
        font-weight: bold;
        color: map.get($colors-danger, 'text', 'base');
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
    color: var(--bee-field-select-tip-color);
  }
}
</style>
