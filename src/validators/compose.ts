import type { Rule, RuleResult } from './types'

/**
 *
 * @param {...any} rules
 */
export function compose<V>(...rules: Rule<V>[]): Rule<V> {
  return (v: V): RuleResult => {
    for (const rule of rules) {
      const result = rule(v)
      if (result) return result
    }
    return undefined
  }
}

/**
 *
 * @param condition
 * @param {...any} rules
 */
export function when<V>(condition: () => boolean, ...rules: Rule<V>[]): Rule<V> {
  return (v: V): RuleResult => {
    if (condition()) {
      for (const rule of rules) {
        const result = rule(v)
        if (result) return result
      }
    }
    return undefined
  }
}
