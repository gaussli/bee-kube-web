import type { Rule } from '../types'

/**
 * 最小值
 * @param min
 * @param msg
 */
export function min(min: number, msg = `数值不能小于 ${min}。`): Rule<number> {
  return v => (v != null && v < min ? msg : undefined)
}

/**
 * 最大值
 * @param max
 * @param msg
 */
export function max(max: number, msg = `数值不能大于 ${max}。`): Rule<number> {
  return v => (v != null && v > max ? msg : undefined)
}

/**
 * 数值范围
 * @param min
 * @param max
 * @param msg
 */
export function range(min: number, max: number, msg = `数值必须在 ${min} ~ ${max} 之间。`): Rule<number> {
  return v => (v != null && (v < min || v > max) ? msg : undefined)
}
