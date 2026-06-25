/**
 * 日期时间工具函数
 * @module utils/datetime
 */

/**
 * 计算从指定日期时间到当前时间的已过时长
 * @param dateTime - 起始日期时间字符串
 * @returns 格式化后的已过时长，如 "5 天 23 时 6 分"
 */
export function formatTimeElapsed(dateTime: string): string {
  const now = new Date()
  const created = new Date(dateTime)
  const diffMs = now.getTime() - created.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  return `${days} 天 ${hours} 时 ${minutes} 分`
}

/**
 * 计算从当前时间到指定日期的剩余天数
 * @param dateTime - 目标日期时间字符串
 * @returns 剩余天数，若已过期则返回 0
 */
export function calcRemainDays(dateTime: string): number {
  const now = new Date()
  const target = new Date(dateTime)
  const diffMs = target.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}
