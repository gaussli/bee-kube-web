/**
 * Mock 工具函数
 */

import type { PageVo } from '@/types/index'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

/**
 * 生成32位随机ID（数字+小写字母）
 * @returns 随机生成的32位ID字符串
 */
export function generateId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let id = ''
  for (let i = 0; i < 32; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

/**
 * 处理事件 mock 列表
 * @param query - 事件查询条件
 * @param mockList - 事件 mock 列表
 * @returns 分页后的事件列表
 */
export function handleEventList(query: Partial<EventQueryForm>, mockList: EventListVo[]): PageVo<EventListVo> {
  const filtered = mockList.filter((e: EventListVo) => {
    if (query.type && e.type !== query.type) return false
    return true
  })
  const filteredReason = query.reason ? filtered.filter(p => p.reason?.includes(query.reason as string)) : []
  const filteredNote = query.note ? filtered.filter(p => p.note?.includes(query.note as string)) : []
  const matched = query.reason || query.note ? Array.from(new Set([...filteredReason, ...filteredNote])) : filtered
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  return {
    list: matched.slice((page - 1) * pageSize, page * pageSize),
    total: matched.length,
    page,
    pageSize,
  }
}
