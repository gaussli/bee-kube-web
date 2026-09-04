/**
 * BeeMessage 组件类型定义
 * @module components/BeeMessage/types
 */

/** 消息类型 */
export type MessageType = 'primary' | 'success' | 'warning' | 'danger'

/** 消息项 */
export interface MessageItem {
  /** 唯一标识 */
  id: number
  /** 消息类型 */
  type: MessageType
  /** 消息文本 */
  message: string
  /** 自动消失时长(ms)，0 表示不自动消失 */
  duration: number
  /** 是否显示关闭按钮 */
  showClose: boolean
}

/** BeeMessage 调用选项 */
export interface MessageOptions {
  /** 自动消失时长(ms)，0 则不消失 */
  duration?: number
  /** 是否显示关闭按钮，默认 true */
  showClose?: boolean
}
