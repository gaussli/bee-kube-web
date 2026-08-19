/**
 * Kubernetes 事件管理常量配置
 * @module config/kubernetes/event
 */

/** 事件类型原始数据（用于派生类型） */
const _eventTypes = [
  { value: 'Normal', label: '正常' },
  { value: 'Warning', label: '警告' },
] as const

/** 事件类型，标识事件的严重程度分类 */
export type EventType = (typeof _eventTypes)[number]['value']
