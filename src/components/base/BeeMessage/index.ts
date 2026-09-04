/**
 * BeeMessage 命令式 API
 * @module components/BeeMessage
 *
 * @example
 * ```ts
 * import { BeeMessage } from '@/components/BeeMessage'
 *
 * BeeMessage.success('操作成功')
 * BeeMessage.error('操作失败')
 * BeeMessage.warning('请注意')
 * BeeMessage.info('提示信息')
 *
 * // 自定义选项
 * BeeMessage.success('永不消失', { duration: 0 })
 * BeeMessage.error('无关闭按钮', { showClose: false, duration: 5000 })
 * ```
 */
import { createVNode, render } from 'vue'

import type { MessageOptions, MessageType } from './types'

import BeeMessageContainer from './BeeMessageContainer.vue'
import { addMessage, clearAll, removeMessage } from './store.ts'

/** 容器是否已挂载 */
let isMounted = false

/** 容器 DOM 元素 */
let containerEl: HTMLDivElement | null = null

/**
 * 确保容器已挂载到 body
 * @remarks 首次调用时创建并挂载；后续调用复用
 */
function ensureMounted(): void {
  if (isMounted) return
  containerEl = document.createElement('div')
  document.body.appendChild(containerEl)
  const vnode = createVNode(BeeMessageContainer)
  render(vnode, containerEl)
  isMounted = true
}

/**
 * 显示消息
 * @param type - 消息类型
 * @param message - 消息文本
 * @param options - 可选配置
 */
function show(type: MessageType, message: string, options?: MessageOptions): void {
  ensureMounted()
  const id = addMessage(type, message, options)
  const duration = options?.duration ?? 5000
  if (duration > 0) {
    setTimeout(() => removeMessage(id), duration)
  }
}

export const BeeMessage = {
  /**
   * 成功消息
   * @param message
   * @param options
   */
  success: (message: string, options?: MessageOptions) => show('success', message, options),
  /**
   * 错误消息
   * @param message
   * @param options
   */
  error: (message: string, options?: MessageOptions) => show('danger', message, options),
  /**
   * 警告消息
   * @param message
   * @param options
   */
  warning: (message: string, options?: MessageOptions) => show('warning', message, options),
  /**
   * 信息消息
   * @param message
   * @param options
   */
  info: (message: string, options?: MessageOptions) => show('primary', message, options),
  /**
   * 清除所有消息
   */
  closeAll: () => clearAll(),
}

export type { MessageOptions, MessageType }
