import type { Rule } from '../types'

/**
 * 必填
 * @param msg
 */
export function required(msg = '必填'): Rule {
  return v => (v == null || v.trim() == '' || (Array.isArray(v) && v.length === 0) ? msg : undefined)
}
