/**
 * Event 原始类型定义
 * @module types/kubernetes/event/types
 *
 * @remarks
 * 对应文档「Event 原始类型定义」章节（`/src/types/kubernetes/event/types.ts`）
 */

import type { EventType } from '@/config/kubernetes/event'

import type { ObjectMeta, ObjectReference } from '../types'

/**
 * 事件来源
 * 包含产生事件的组件与主机信息
 */
export interface EventSource {
  /** 产生事件的组件，如 kubelet、controller-manager */
  component?: string
  /** 产生事件的主机名 */
  host?: string
}

/**
 * 事件系列
 * 同一系列事件的聚合信息；单条事件为 undefined
 */
export interface EventSeries {
  /** 该系列事件已发生的次数 */
  count?: number
  /** 该系列事件最近一次被观测到的时间 */
  lastObservedTime?: string
}

/**
 * Kubernetes 事件实体（core/v1）
 * 记录集群中资源对象的生命周期事件与异常告警
 * @extends ObjectMeta 继承资源元数据（name / namespace / labels / annotations / uid 等）
 */
export interface Event extends ObjectMeta {
  /** 事件首次被观测到的时间（microTime 精度） */
  eventTime?: string
  /** 事件所描述的对象 */
  involvedObject: ObjectReference
  /** 事件原因（人类可读，最长 128 字符） */
  reason?: string
  /** 事件描述（人类可读的状态说明，最大 1kB） */
  message?: string
  /** 事件来源，包含组件与主机信息 */
  source?: EventSource
  /** 事件首次被记录的时间 */
  firstTimestamp?: string
  /** 事件最近一次被记录的时间 */
  lastTimestamp?: string
  /** 事件已发生的次数 */
  count?: number
  /** 事件类型 */
  type?: EventType
  /** 事件系列聚合信息，同一系列事件的聚合；单条事件为 undefined */
  series?: EventSeries
  /** 针对关联对象所采取 / 失败的动作（机器可读，最长 128 字符） */
  action?: string
  /** 可选的二级关联对象，用于更复杂的动作 */
  related?: ObjectReference
  /** 上报该事件的控制器名称，例如 kubernetes.io/kubelet */
  reportingController?: string
  /** 控制器实例 ID，例如 kubelet-xyzf */
  reportingInstance?: string
}
