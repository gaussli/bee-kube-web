import type { RuleResult } from '@/validators/types'

import { chain } from '@/validators/chain'

/**
 *
 */
export function useValidator() {
  function validateName(value: string): RuleResult {
    return chain(value).required().dnsLabelName().maxLength(63).done()
  }

  return { validateName }
}
