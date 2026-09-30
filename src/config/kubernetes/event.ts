/**
 * Kubernetes 事件管理常量配置
 * @module config/kubernetes/event
 */

import type { Option } from '.'

/** 事件类型原始数据（用于派生类型） */
const _eventTypes = [
  { value: 'Normal', label: '正常', type: 'success' },
  { value: 'Warning', label: '警告', type: 'warning' },
] as const

/** 事件类型，标识事件的严重程度分类 */
export type EventType = (typeof _eventTypes)[number]['value']

/** 事件类型配置选项 */
export const EVENT_TYPE_OPTIONS: Option[] = [{ value: undefined, label: '全部类型' }, ..._eventTypes]
