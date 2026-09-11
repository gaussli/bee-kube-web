import type * as RuleFns from './rule'
import type { Rule, RuleResult } from './types'

import {
  date,
  datetime,
  email,
  idCard,
  max,
  maxLength,
  min,
  minLength,
  pattern,
  range,
  rangeLength,
  required,
  time,
  dnsLabelName,
  custom,
} from './rule'

/** 所有「返回值为 Rule 的函数」的键名（自动过滤非函数导出） */
type RuleFnKeys = {
  [K in keyof typeof RuleFns]: (typeof RuleFns)[K] extends (...args: any[]) => Rule<any> ? K : never
}[keyof typeof RuleFns]

/** 链式校验对象：规则方法签名自动跟随 rule 模块导出，外加 done */
export type RuleChain<V> = {
  [K in RuleFnKeys]: (typeof RuleFns)[K] extends (...args: infer A) => Rule<any> ? (...args: A) => RuleChain<V> : never
} & {
  done: () => RuleResult
}

/** 已注册规则 */
interface RegisteredRule {
  args: any[]
  fn: (...args: any[]) => Rule
}

/**
 * 创建链式校验，按注册顺序执行规则，返回第一条错误信息
 * @param v
 */
export function chain<V>(v: V): RuleChain<V> {
  const registeredRules: RegisteredRule[] = []

  // 注册一条规则并返回链式对象自身（闭包捕获 registeredRules 与 chain）
  const add = (fn: (...args: any[]) => Rule, ...args: any[]): RuleChain<V> => {
    registeredRules.push({ args, fn })
    return chain
  }

  const chain: RuleChain<V> = {
    // Basic
    required: (msg?: string) => add(required, msg),
    // String
    minLength: (min: number, msg?: string) => add(minLength, min, msg),
    maxLength: (max: number, msg?: string) => add(maxLength, max, msg),
    rangeLength: (min: number, max: number, msg?: string) => add(rangeLength, min, max, msg),
    pattern: (regex: RegExp, msg?: string) => add(pattern, regex, msg),
    email: (msg?: string) => add(email, msg),
    idCard: (msg?: string) => add(idCard, msg),
    // Number
    min: (minValue: number, msg?: string) => add(min, minValue, msg),
    max: (maxValue: number, msg?: string) => add(max, maxValue, msg),
    range: (minValue: number, maxValue: number, msg?: string) => add(range, minValue, maxValue, msg),
    // Datetime
    date: (msg?: string) => add(date, msg),
    time: (msg?: string) => add(time, msg),
    datetime: (msg?: string) => add(datetime, msg),
    // Kubernetes
    dnsLabelName: (msg?: string) => add(dnsLabelName, msg),
    // Custom
    custom: (fn: () => RuleResult) => add(custom, fn),
    done: (): RuleResult => {
      for (const item of registeredRules) {
        const msg = item.fn(...item.args)(v)
        if (msg) return msg
      }
      return undefined
    },
  }

  return chain
}
