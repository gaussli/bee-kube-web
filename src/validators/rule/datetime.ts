import type { Rule } from '../types'

import { pattern } from './string'

/**
 * 日期（YYYY-MM-DD）
 * @param msg
 */
export function date(msg = '日期格式不正确。'): Rule<string> {
  const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/
  return pattern(DATE_RE, msg)
}

/**
 * 时间（HH:mm 或 HH:mm:ss）
 * @param msg
 */
export function time(msg = '时间格式不正确。'): Rule<string> {
  const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/
  return pattern(TIME_RE, msg)
}

/**
 * 日期时间（YYYY-MM-DD HH:mm 或 YYYY-MM-DD HH:mm:ss 或 YYYY-MM-DDTHH:mm 或 YYYY-MM-DDTHH:mm:ss）
 * @param msg
 */
export function datetime(msg = '日期时间格式不正确。'): Rule<string> {
  const DATETIME_RE = /^\d{4}-\d{2}-\d{2}[ T]([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/
  return pattern(DATETIME_RE, msg)
}
