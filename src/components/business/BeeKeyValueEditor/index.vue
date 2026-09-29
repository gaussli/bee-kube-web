<template>
  <div class="bee-key-value-editor" :class="[disabledClass]">
    <!-- 头部：标题 + 新增按钮 -->
    <div class="bee-key-value-editor__header">
      <div class="bee-key-value-editor__title">
        <BeeIcon v-if="icon" :name="icon" />
        <span>{{ label }}</span>
      </div>
      <BeeButton v-if="!disabled" icon="basic-create" size="small" @click="handleAdd">{{ addText }}</BeeButton>
    </div>

    <!-- 条目列表 -->
    <div v-if="rows.length > 0" class="bee-key-value-editor__list">
      <div v-for="(row, index) in rows" :key="index" class="bee-key-value-editor__row">
        <input
          :ref="el => setKeyInputRef(el, index)"
          v-model="row.key"
          autocomplete="off"
          class="bee-key-value-editor__input"
          :class="{ 'is-danger': errorIndexes.includes(index) }"
          :disabled="disabled"
          :maxlength="keyMaxLength"
          :placeholder="keyPlaceholder"
          @blur="handleBlur"
          @input="handleInput"
        />
        <span class="bee-key-value-editor__separator">:</span>
        <input
          v-model="row.value"
          autocomplete="off"
          class="bee-key-value-editor__input"
          :class="{ 'is-danger': errorIndexes.includes(index) }"
          :disabled="disabled"
          :maxlength="valueMaxLength"
          :placeholder="valuePlaceholder"
          @blur="handleBlur"
          @input="handleInput"
        />
        <BeeIconButton v-if="!disabled" icon="basic-delete" size="small" @click="handleRemove(index)" />
      </div>
    </div>
    <div v-else class="bee-key-value-editor__empty">{{ emptyText }}</div>

    <!-- 提示行 -->
    <div v-if="showTip" class="bee-key-value-editor__tip" :class="[tipStatusClass]">
      <BeeIcon :name="tipIconName" />
      <span>{{ tipRef }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'

import { useDebounceFn } from '@vueuse/core'

import type { RuleResult } from '@/validators/types'

import BeeButton from '@/components/base/BeeButton/index.vue'
import { BEE_FORM_KEY, type BeeFormField } from '@/components/base/BeeForm/context'
import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeIconButton from '@/components/base/BeeIconButton/index.vue'

import { isBlankKeyValueItem, type KeyValueItem } from './types'

/**
 * 键值编辑器
 * @description 以「键 : 值」行编辑 `Record<string, string>` 型元数据（标签 / 注解等）。
 * 内部校验包含「键必填」「键重复」，格式规则由 `keyValidator` / `valueValidator` 注入；
 * 键与值均为空的条目视为未填写，不参与校验，也不会进入 `v-model` 结果
 * @remarks 会通过 inject 自动注册到最近的 BeeForm，随表单一起被 `validate()`
 */
defineOptions({ name: 'BeeKeyValueEditor' })

// ==================== Prop & Emit ====================
const modelValue = defineModel<KeyValueItem[]>({ default: () => [] })
const props = withDefaults(
  defineProps<{
    /** 分组标题 */
    label: string
    /** 标题左侧图标名称，不传则不渲染 */
    icon?: string
    /** 新增按钮文案 */
    addText?: string
    /** 空数据提示文案 */
    emptyText?: string
    /** 键输入框占位文案 */
    keyPlaceholder?: string
    /** 值输入框占位文案 */
    valuePlaceholder?: string
    /** 键最大长度，透传给原生 input */
    keyMaxLength?: number
    /** 值最大长度，透传给原生 input，不传则不限 */
    valueMaxLength?: number
    /** 禁用标记：禁用时仅作展示 */
    disabled?: boolean
    /** 初始提示文案 */
    tip?: string
    /** 键校验函数：在「键必填」「键重复」校验之后执行 */
    keyValidator?: (key: string, item: KeyValueItem, items: KeyValueItem[]) => RuleResult
    /** 值校验函数：在键校验通过后执行 */
    valueValidator?: (value: string, item: KeyValueItem, items: KeyValueItem[]) => RuleResult
  }>(),
  {
    icon: undefined,
    addText: '添加',
    emptyText: '暂无数据',
    keyPlaceholder: '键',
    valuePlaceholder: '值',
    keyMaxLength: 253,
    valueMaxLength: undefined,
    disabled: false,
    tip: '',
    keyValidator: undefined,
    valueValidator: undefined,
  },
)

// ==================== Inject ====================
/** 最近的 BeeForm 上下文，未包裹在 BeeForm 中时为 undefined */
const beeForm = inject(BEE_FORM_KEY, undefined)

// ==================== Reactive State ====================
/** 出错条目下标，用于行内标红 */
const errorIndexes = ref<number[]>([])
/** 键输入框引用集合，用于定位出错条目 */
const keyInputRefs: HTMLInputElement[] = []
const tipRef = ref<string>(props.tip)
const tipIconName = ref<string>('basic-info')
const tipStatusClass = ref<string>('')

// ==================== Computed ====================
/** 条目列表，直接以 v-model 数据为源 */
const rows = computed(() => modelValue.value)
const disabledClass = computed(() => (props.disabled ? 'is-disabled' : ''))
/** 提示行显隐：禁用时隐藏；提示文案为空时隐藏 */
const showTip = computed(() => !props.disabled && tipRef.value !== '')

// ==================== Vueuse ====================
const debouncedValidate = useDebounceFn(() => {
  validateAll()
}, 300)

// ==================== Method ====================
/**
 * 设置提示行内容
 * @param error - 错误文案，为空表示校验通过
 */
function setTip(error?: string) {
  if (error) {
    tipRef.value = error
    tipIconName.value = 'basic-danger'
    tipStatusClass.value = 'bee-key-value-editor__tip--danger'
    return
  }
  tipRef.value = 'OK!'
  tipIconName.value = 'basic-success'
  tipStatusClass.value = 'bee-key-value-editor__tip--success'
}

/**
 * 校验单个条目
 * @param row - 条目数据
 * @param index - 条目下标
 * @returns 错误文案，通过时为 undefined
 */
function validateRow(row: KeyValueItem, index: number): RuleResult {
  if (isBlankKeyValueItem(row)) return
  if (!row.key) return '键不能为空'
  const isDuplicated = rows.value.some(
    (item, itemIndex) => itemIndex !== index && !isBlankKeyValueItem(item) && item.key === row.key,
  )
  if (isDuplicated) return `键【${row.key}】重复`
  const keyError = props.keyValidator?.(row.key, row, rows.value)
  if (keyError != null) return keyError
  return props.valueValidator?.(row.value, row, rows.value)
}

/**
 * 校验全部条目
 * @description 记录出错条目下标用于标红，并把首条错误写入提示行
 * @returns 错误文案，通过时为 undefined
 */
function validateAll(): RuleResult {
  const indexes: number[] = []
  let message: string | undefined
  for (let index = 0; index < rows.value.length; index++) {
    const error = validateRow(rows.value[index], index)
    if (error == null) continue
    indexes.push(index)
    if (!message) message = error
  }
  errorIndexes.value = indexes
  setTip(message)
  return message
}

/**
 * 清空校验态
 * @description 提示行恢复为初始 tip（初始值为空时提示行隐藏）
 */
function clearValidate() {
  errorIndexes.value = []
  tipRef.value = props.tip
  tipIconName.value = 'basic-info'
  tipStatusClass.value = ''
}

/**
 * 聚焦首个出错条目的键输入框
 */
function focusFirstError() {
  const index = errorIndexes.value[0]
  if (index === undefined) return
  keyInputRefs[index]?.focus()
}

// ==================== Handler ====================
/**
 * 收集键输入框引用，用于定位出错条目
 * @param el - 元素实例
 * @param index - 条目下标
 */
function setKeyInputRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (el instanceof HTMLInputElement) keyInputRefs[index] = el
}

/**
 * 输入时防抖校验
 */
async function handleInput() {
  await debouncedValidate()
}

/**
 * 失焦时立即校验
 */
function handleBlur() {
  validateAll()
}

/**
 * 新增空条目
 */
function handleAdd() {
  modelValue.value = [...rows.value, { key: '', value: '' }]
}

/**
 * 移除条目
 * @param index - 条目下标
 */
function handleRemove(index: number) {
  const next = [...rows.value]
  next.splice(index, 1)
  modelValue.value = next
  clearValidate()
}

// ==================== Lifecycle ====================
/** 注册到最近 BeeForm 的字段实例 */
const field: BeeFormField = {
  validate: validateAll,
  focus: focusFirstError,
  clearValidate,
}

onMounted(() => beeForm?.addField(field))

onBeforeUnmount(() => beeForm?.removeField(field))
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-key-value-editor {
  /* stylelint-disable order/custom-properties-alphabetical-order */
  --bee-key-value-editor-height: 32px;
  --bee-key-value-editor-padding: 0 14px;
  --bee-key-value-editor-font-size: 14px;
  --bee-key-value-editor-color: #{$color-text-secondary};
  --bee-key-value-editor-color-border: #{map.get($colors-default, 'border', 'base')};
  --bee-key-value-editor-color-active: #{$color-text-primary};
  --bee-key-value-editor-color-border-active: #{$color-text-secondary};
  --bee-key-value-editor-color-border-danger: #{map.get($colors-danger, 'border', 'base')};
  --bee-key-value-editor-color-bg-disabled: #{map.get($colors-default, 'bg', 'hover')};
  --bee-key-value-editor-tip-color: #{$color-text-third};

  .bee-key-value-editor__tip--success {
    --bee-key-value-editor-tip-color: #{map.get($colors-success, 'text', 'base')};
  }

  .bee-key-value-editor__tip--danger {
    --bee-key-value-editor-tip-color: #{map.get($colors-danger, 'text', 'base')};
  }

  /* stylelint-enable order/custom-properties-alphabetical-order */
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;

  &__header {
    display: flex;
    gap: 8px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  &__title {
    display: flex;
    gap: 8px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    font-weight: normal;
    color: $color-text-third;
    user-select: none;
  }

  &__list {
    display: flex;
    gap: 8px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  &__row {
    display: flex;
    gap: 8px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  &__input {
    flex: 1;
    min-width: 0;
    height: var(--bee-key-value-editor-height);
    padding: var(--bee-key-value-editor-padding);
    border: 1px solid;
    border-color: var(--bee-key-value-editor-color-border);
    border-radius: 9999px;
    font-size: var(--bee-key-value-editor-font-size);
    font-weight: normal;
    color: var(--bee-key-value-editor-color);
    background: var(--bee-key-value-editor-color-bg-transparent);

    &:focus {
      border-color: var(--bee-key-value-editor-color-border-active);
      color: var(--bee-key-value-editor-color-active);
      outline: none;
    }

    &.is-danger {
      border-color: var(--bee-key-value-editor-color-border-danger);
    }

    &:disabled {
      background: var(--bee-key-value-editor-color-bg-disabled);
    }
  }

  &__separator {
    flex-shrink: 0;
    color: $color-text-third;
    user-select: none;
  }

  &__empty {
    font-size: 12px;
    font-weight: normal;
    color: $color-text-third;
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
    color: var(--bee-key-value-editor-tip-color);
  }
}
</style>
