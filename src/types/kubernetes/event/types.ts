/**
 * Event 原始类型定义
 * @module types/kubernetes/event/types
 *
 * @remarks
 * 对应文档「Event 原始类型定义」章节（`/src/types/kubernetes/event/types.ts`）
 */

import type { ObjectMeta } from '../types'

/**
 * 事件类型
 * 事件的严重程度分类
 * - Normal：正常事件，资源生命周期中的常规状态变更
 * - Warning：警告事件，资源出现异常或失败需关注
 */
export type EventType = 'Normal' | 'Warning'

/**
 * 事件关联对象
 * 描述事件所涉及的 Kubernetes 资源对象
 */
export interface EventInvolvedObject {
  /** 关联对象所属 API 版本 */
  apiVersion: string
  /** 关联对象的类型，如 Pod / Deployment / StatefulSet */
  kind: string
  /** 关联对象的名称 */
  name: string
  /** 关联对象所属命名空间 */
  namespace: string
  /** 关联对象的 UID */
  uid: string
}

/**
 * 事件系列
 * 同一系列事件的聚合信息
 */
export interface EventSeries {
  /** 该系列事件已发生的次数 */
  count: number
  /** 该系列事件最近一次被观测到的时间 */
  lastObservedTime: string
  /** 系列状态，EventSeriesStateWindingDown 表示系列即将停止 */
  state: string
}

/**
 * Kubernetes 事件实体（events.k8s.io/v1）
 * 记录集群中资源对象的生命周期事件与异常告警
 * @extends ObjectMeta 继承资源元数据（name / namespace / labels / annotations / uid 等）
 */
export interface Event extends ObjectMeta {
  /** 事件首次被观测到的时间（microTime 精度） */
  eventTime: string
  /** 事件系列聚合信息；单条事件为 undefined */
  series?: EventSeries
  /** 上报该事件的控制器名称，如 kubernetes.io/kubelet */
  reportingController: string
  /** 控制器实例 ID，如 kubelet-xyzf */
  reportingInstance: string
  /** 针对关联对象所采取 / 失败的动作（机器可读，最长 128 字符） */
  action: string
  /** 事件原因（人类可读，最长 128 字符） */
  reason: string
  /** 事件关联对象，即事件所描述的资源对象 */
  regarding?: EventInvolvedObject
  /** 可选的二级关联对象，用于更复杂的动作 */
  related?: EventInvolvedObject
  /** 事件描述（人类可读，最大 1kB） */
  note?: string
  /** 事件类型 */
  type: EventType
}
