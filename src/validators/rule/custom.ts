import type { Rule, RuleResult } from '../types'

/**
 *
 * @param fn
 */
export function custom(fn: () => RuleResult): Rule {
  return fn
}
