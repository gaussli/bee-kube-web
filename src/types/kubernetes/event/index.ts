/**
 * 事件（Event）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/event/index
 */

import type { PageForm } from '@/types/index'
import type { Event } from '@/types/kubernetes/event/types'
import type { ObjectReference } from '@/types/kubernetes/types'

import type { EventType } from '@/config/kubernetes/event'

/**
 * 查询条件请求对象
 */
export interface EventQueryForm extends PageForm {
  /** 事件类型 */
  type: EventType
  /** 事件原因 */
  reason: string
  /** 描述 */
  note: string
  /** 事件关联对象（按 apiVersion/kind/name/namespace/uid 精确匹配，可选） */
  regarding: ObjectReference
}

/**
 * 列表项响应对象
 */
export interface EventListVo extends Event {}
