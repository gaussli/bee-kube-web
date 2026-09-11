export type RuleResult = string | undefined

/**
 * 原子规则定义
 */
export type Rule<V = any> = (value: V) => RuleResult
