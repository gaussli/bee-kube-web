/**
 * Event 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/event/index
 */

import type { EventType } from '@/config/kubernetes/event'

import type { PageForm } from '../../common'
import type { ObjectReference } from '../types'

import type { Event } from './types'

/**
 * 事件查询条件请求对象
 */
export interface EventQueryForm extends PageForm {
  /** 事件类型 */
  type: EventType
  /** 事件原因 */
  reason: string
  /** 事件描述 */
  note: string
  /** 事件关联对象（按 apiVersion/kind/name/namespace/uid 精确匹配，可选） */
  regarding: ObjectReference
}

/**
 * 事件列表项响应对象
 */
export interface EventListVo extends Event {}
