/**
 * Event 类型定义
 * @module types/kubernetes/event
 *
 * @remarks
 * 对应文档「Event 类型定义」章节（`/src/types/kubernetes/event/index.ts`）
 * 查询条件与列表项类型；原始类型（Event / EventType / EventInvolvedObject / EventSeries）见 ./types
 */
import type { PageForm } from '../../common'

import type { Event, EventInvolvedObject, EventType } from './types'

/**
 * 事件查询条件请求对象
 * @extends PageForm 继承分页请求
 */
export interface EventQueryForm extends PageForm {
  /** 事件类型（Normal: 正常事件；Warning: 警告事件） */
  type: EventType
  /** 事件原因 */
  reason: string
  /** 事件描述 */
  note: string
  /** 事件关联对象（按 apiVersion/kind/name/namespace/uid 精确匹配，可选） */
  regarding: EventInvolvedObject
}

/**
 * 事件列表项响应对象
 * @extends Event 继承事件实体
 */
export interface EventListVo extends Event {}
