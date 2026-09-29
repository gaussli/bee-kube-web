<template>
  <div class="bee-form">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'

import { BEE_FORM_KEY, type BeeFormField, type BeeFormValidateResult } from './context'

/**
 * 表单容器
 * @description 纯校验编排器：不接管数据（字段值仍由页面 `v-model` 控制）、不参与布局、不渲染提交按钮，
 * 只负责字段注册与校验聚合，因此提交按钮可以放在本组件之外的任意位置（如 BeeBackHeader 的操作区），
 * 由页面通过模板 ref 调用 `validate()`
 * @example
 * ```vue
 * <BeeBackHeader :actions="actionItems" @action="handleHeaderActions" />
 * <BeeForm ref="formRef" class="edit-basic">
 *   <BeeFieldInput id="name" v-model="formData.name" label="名称" :validator="validateName" />
 * </BeeForm>
 * ```
 * ```ts
 * const { valid, firstError } = formRef.value!.validate()
 * ```
 */
defineOptions({ name: 'BeeForm' })

// ==================== Reactive State ====================
/** 已注册字段，顺序与字段挂载顺序（即模板顺序）一致 */
const fields = ref<BeeFormField[]>([])

// ==================== Provide ====================
provide(BEE_FORM_KEY, {
  addField,
  removeField,
})

// ==================== Method ====================
/**
 * 注册字段
 * @param field - 字段实例
 */
function addField(field: BeeFormField) {
  if (fields.value.includes(field)) return
  fields.value.push(field)
}

/**
 * 注销字段
 * @param field - 字段实例
 */
function removeField(field: BeeFormField) {
  fields.value = fields.value.filter(item => item !== field)
}

/**
 * 校验全部字段
 * @description 依次触发所有字段校验（使每个字段的提示行都刷新），返回是否通过及首条错误文案；失败时聚焦首个错误字段
 * @returns 校验结果
 */
function validate(): BeeFormValidateResult {
  let firstErrorField: BeeFormField | undefined
  let firstError: string | undefined
  for (const field of fields.value) {
    const error = field.validate()
    if (error == null) continue
    if (firstErrorField) continue
    firstErrorField = field
    firstError = error
  }
  if (!firstErrorField) return { valid: true }
  firstErrorField.focus()
  return { valid: false, firstError }
}

/**
 * 清空全部字段的校验态
 * @description 各字段提示行恢复为初始 tip，用于重新拉取数据或重置表单的场景
 */
function clearValidate() {
  fields.value.forEach(field => field.clearValidate())
}

// ==================== Expose ====================
defineExpose({ validate, clearValidate })
</script>
