/**
 * 日期时间工具函数
 * @module utils/datetime
 */

/**
 * 计算从指定日期时间到当前时间的已过时长
 * @param dateTime - 起始日期时间字符串
 * @returns 格式化后的已过时长，如 "1 年 5 天 23 时 6 分"，年为 0 则不显示年，天为 0 则不显示天
 */
export function formatTimeElapsed(dateTime?: string): string {
  if (!dateTime) return ''
  const created = new Date(dateTime)
  if (isNaN(created.getTime())) return ''
  const now = new Date()
  const diffMs = now.getTime() - created.getTime()
  if (diffMs < 0) return ''
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const years = Math.floor(totalDays / 365)
  const days = totalDays % 365
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const parts: string[] = []
  if (years > 0) parts.push(`${years} 年`)
  if (days > 0) parts.push(`${days} 天`)
  parts.push(`${hours} 时 ${minutes} 分`)
  return parts.join(' ')
}

/**
 * 计算从当前时间到指定日期的剩余天数
 * @param dateTime - 目标日期时间字符串
 * @returns 剩余天数，若已过期则返回 0
 */
export function calcRemainDays(dateTime?: string): number {
  if (!dateTime) return 0
  const target = new Date(dateTime)
  if (isNaN(target.getTime())) return 0
  const now = new Date()
  const diffMs = target.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}
