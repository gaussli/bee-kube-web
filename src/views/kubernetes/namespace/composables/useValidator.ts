import type { RuleResult } from '@/validators/types'

import { chain } from '@/validators/chain'

/**
 * 命名空间表单校验
 * @remarks 元数据（标签 / 注解）校验已抽到 `@/composables/useMetadataValidator` 供各资源复用
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

  return { validateName, validateDescription }
}
