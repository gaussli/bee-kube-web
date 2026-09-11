import type { Rule } from '../types'

import { pattern } from './string'

/**
 *
 * @param msg
 */
export function dnsLabelName(msg = '只能包含小写字母、数字和 -，且必须以字母或数字开头和结尾。'): Rule<string> {
  const DNS_LABEL_RE = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/
  return pattern(DNS_LABEL_RE, msg)
}
