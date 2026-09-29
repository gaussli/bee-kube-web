/**
 * BeeForm 表单上下文
 * @module components/base/BeeForm/context
 */
import type { InjectionKey } from 'vue'

import type { RuleResult } from '@/validators/types'

/**
 * 表单字段实例
 * @remarks 由字段组件（BeeFieldInput / BeeFieldTextarea）实现，并注册到最近的 BeeForm
 */
export interface BeeFormField {
  /** 字段标识，通常取字段组件的 id，仅用于定位 */
  id?: string
  /**
   * 触发校验
   * @returns 校验错误文案，通过时为 undefined
   */
  validate: () => RuleResult
  /** 聚焦字段输入框，校验失败时由 BeeForm 调用 */
  focus: () => void
  /** 清空校验态，提示行恢复为初始 tip */
  clearValidate: () => void
}

/**
 * 表单校验结果
 */
export interface BeeFormValidateResult {
  /** 是否全部字段通过校验 */
  valid: boolean
  /** 首条错误文案，全部通过时为空 */
  firstError?: string
}

/**
 * BeeForm 上下文
 */
export interface BeeFormContext {
  /**
   * 注册字段
   * @param field - 字段实例
   */
  addField: (field: BeeFormField) => void
  /**
   * 注销字段
   * @param field - 字段实例
   */
  removeField: (field: BeeFormField) => void
}

/** BeeForm 上下文注入键 */
export const BEE_FORM_KEY: InjectionKey<BeeFormContext> = Symbol('BeeForm')
