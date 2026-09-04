/**
 * BeeMessage 共享响应式状态
 * @module components/BeeMessage/state
 */
import { reactive } from 'vue'

import type { MessageItem, MessageOptions, MessageType } from './types'

/** 消息列表（模块级响应式，index.ts 与容器组件共享） */
export const messageItemList: MessageItem[] = reactive([])

/** 自增 ID */
let uid = 0

/**
 * 添加消息
 * @param type - 消息类型
 * @param message - 消息文本
 * @param options - 可选配置
 * @returns 消息 ID
 */
export function addMessage(type: MessageType, message: string, options?: MessageOptions): number {
  const id = ++uid
  messageItemList.push({
    id,
    type,
    message,
    duration: options?.duration ?? 0,
    showClose: options?.showClose ?? false,
  })
  return id
}

/**
 * 移除消息
 * @param id - 消息 ID
 */
export function removeMessage(id: number): void {
  const idx = messageItemList.findIndex(m => m.id === id)
  if (idx !== -1) messageItemList.splice(idx, 1)
}

/**
 * 清除所有消息
 */
export function clearAll(): void {
  messageItemList.splice(0, messageItemList.length)
}
