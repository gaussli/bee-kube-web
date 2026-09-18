import type { RuleResult } from '@/validators/types'

import { chain } from '@/validators/chain'

/**
 *
 */
export function useValidator() {
  function validateName(value: string): RuleResult {
    return chain(value).required().dnsLabelName().maxLength(63).done()
  }

  /**
   * 校验集群描述：仅限制长度不超过 255 个字符（允许为空）
   * @param value - 描述内容
   * @returns 校验错误文案，通过时为 undefined
   */
  function validateDescription(value: string): RuleResult {
    return chain(value).maxLength(255).done()
  }

  return { validateName, validateDescription }
}
