import type { Rule } from '../types'

/**
 * 最小长度
 * @param min
 * @param msg
 */
export function minLength(min: number, msg = `长度不能少于 ${min} 个字符。`): Rule<string> {
  return v => (v != null && v.trim().length < min ? msg : undefined)
}

/**
 * 最大长度
 * @param max
 * @param msg
 */
export function maxLength(max: number, msg = `长度不能超过 ${max} 个字符。`): Rule<string> {
  return v => (v != null && v.trim().length > max ? msg : undefined)
}

/**
 * 长度范围
 * @param min
 * @param max
 * @param msg
 */
export function rangeLength(min: number, max: number, msg = `长度必须在 ${min} ~ ${max} 之间。`): Rule<string> {
  return v => (v != null && (v.trim().length < min || v.trim().length > max) ? msg : undefined)
}

/**
 * 正则匹配
 * @param regex
 * @param msg
 */
export function pattern(regex: RegExp, msg = '格式不正确。'): Rule<string> {
  return v => (v != null && !regex.test(v) ? msg : undefined)
}

/**
 * 邮箱
 * @param msg
 */
export function email(msg = '邮箱格式不正确。'): Rule<string> {
  const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return pattern(EMAIL_RE, msg)
}

/**
 * 身份证号
 * @param msg
 */
export function idCard(msg = '身份证格式不正确。'): Rule<string> {
  const ID_CARD_RE = /^\d{17}[\dXx]$/
  return pattern(ID_CARD_RE, msg)
}
