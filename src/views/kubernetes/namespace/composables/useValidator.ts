import type { RuleResult } from '@/validators/types'

import { chain } from '@/validators/chain'

/** 元数据键前缀（可选的 DNS 子域名部分） */
const META_KEY_PREFIX_RE = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/
/** 元数据键名与标签值（字母数字开头结尾，中间可含 - _ .） */
const META_NAME_RE = /^[A-Za-z0-9]([-A-Za-z0-9_.]*[A-Za-z0-9])?$/

/** 元数据键名格式错误提示 */
const META_NAME_MESSAGE = '只能包含字母、数字、-、_、.，且必须以字母或数字开头和结尾。'

/**
 * 命名空间表单校验
 */
export function useValidator() {
  /**
   * 校验命名空间名称：K8s DNS-1123 label，最长 63 个字符
   * @param value - 名称
   * @returns 校验错误文案，通过时为 undefined
   */
  function validateName(value: string): RuleResult {
    return chain(value).required('请输入命名空间名称').dnsLabelName().maxLength(63, '名称长度不能超过 63 个字符').done()
  }

  /**
   * 校验命名空间描述：仅限制长度不超过 255 个字符（允许为空）
   * @param value - 描述内容
   * @returns 校验错误文案，通过时为 undefined
   */
  function validateDescription(value: string): RuleResult {
    return chain(value).maxLength(255, '描述长度不能超过 255 个字符').done()
  }

  /**
   * 校验元数据键（标签 / 注解通用）：可选的 DNS 子域名前缀 + 键名，总长不超过 253
   * @param value - 键
   * @returns 校验错误文案，通过时为 undefined
   */
  function validateMetadataKey(value: string): RuleResult {
    const lengthResult = chain(value).required('键不能为空').maxLength(253, '键长度不能超过 253 个字符').done()
    if (lengthResult) return lengthResult
    const slashIndex = value.indexOf('/')
    if (slashIndex < 0) {
      return META_NAME_RE.test(value) ? undefined : META_NAME_MESSAGE
    }
    const prefix = value.slice(0, slashIndex)
    const name = value.slice(slashIndex + 1)
    if (!META_KEY_PREFIX_RE.test(prefix)) return '前缀必须是以 . 分隔的 DNS 子域名（小写字母、数字与 -）。'
    if (!META_NAME_RE.test(name)) return META_NAME_MESSAGE
    return undefined
  }

  /**
   * 校验标签值：允许为空，非空时最长 63 个字符且需符合 K8s 标签值格式
   * @param value - 标签值
   * @returns 校验错误文案，通过时为 undefined
   */
  function validateLabelValue(value: string): RuleResult {
    if (!value) return
    const result = chain(value).maxLength(63, '标签值长度不能超过 63 个字符').done()
    if (result) return result
    return META_NAME_RE.test(value) ? undefined : '标签值只能包含字母、数字、-、_、.，且必须以字母或数字开头和结尾。'
  }

  return { validateName, validateDescription, validateMetadataKey, validateLabelValue }
}
