/**
 * Kubernetes 事件类型定义
 * @module types/kubernetes/event
 */
import type { PageForm } from '../common'

import type { Event, EventType } from './types'

/**
 * 事件查询表单
 * @extends PageForm
 */
export interface EventQueryForm extends PageForm {
  /** 事件类型（Normal: 正常事件；Warning: 警告事件） */
  type: EventType
  /** 事件原因 */
  reason: string
  /** 关联的资源对象所属命名空间 */
  involvedObjectNamespace: string
  /** 关联的资源对象名称 */
  involvedObjectName: string
  /** 关联的资源对象类型 */
  involvedObjectType: string
}

/**
 * 事件列表对象
 * @extends Event
 */
export interface EventListVo extends Event {}
