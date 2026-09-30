/**
 * 配置映射 / 密钥表单校验
 * @module views/kubernetes/config/composables/useValidator
 */
import type { RuleResult } from '@/validators/types'

import { chain } from '@/validators/chain'

/** 配置数据键：字母、数字、'-'、'_'、'.' */
const DATA_KEY_RE = /^[A-Za-z0-9._-]+$/

/**
 * 配置映射 / 密钥共用校验
 */
export function useValidator() {
  /**
   * 校验资源名称：K8s DNS-1123 label，最长 63 个字符
   * @param value - 名称
   * @returns 校验错误文案，通过时为 undefined
   */
  function validateName(value: string): RuleResult {
    return chain(value).required('请输入名称').dnsLabelName().maxLength(63, '名称长度不能超过 63 个字符').done()
  }

  /**
   * 校验描述：仅限制长度不超过 255 个字符（允许为空）
   * @param value - 描述内容
   * @returns 校验错误文案，通过时为 undefined
   */
  function validateDescription(value: string): RuleResult {
    return chain(value).maxLength(255, '描述长度不能超过 255 个字符').done()
  }

  /**
   * 校验配置数据键：必填、最长 253 个字符、仅允许字母数字与 `-` `_` `.`
   * @param value - 数据键
   * @returns 校验错误文案，通过时为 undefined
   */
  function validateDataKey(value: string): RuleResult {
    const result = chain(value).required('键不能为空').maxLength(253, '键长度不能超过 253 个字符').done()
    if (result) return result
    return DATA_KEY_RE.test(value) ? undefined : '只能包含字母、数字、-、_、.'
  }

  /**
   * 校验命名空间必选
   * @param value - 选中的命名空间名称
   * @returns 校验错误文案，通过时为 undefined
   */
  function validateNamespace(value: string | number | undefined): RuleResult {
    return value == null || value === '' ? '请选择命名空间' : undefined
  }

  return { validateName, validateDescription, validateDataKey, validateNamespace }
}
