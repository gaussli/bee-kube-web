/**
 * Kubernetes 通用类型定义
 * @module types/kubernetes/types
 */

/**
 * Kubernetes 对象引用
 * @description 用于引用集群中的任意 Kubernetes 资源对象
 */
export interface ObjectReference {
  /** 资源所属 API 组 */
  apiVersion?: string
  /** 资源类型 */
  kind?: string
  /** 资源名称 */
  name?: string
  /** 资源所属命名空间（集群级资源为空） */
  namespace?: string
  /** 资源唯一标识 */
  uid?: string
  /** 资源版本号（用于乐观锁） */
  resourceVersion?: string
}

/**
 * Kubernetes 条件状态
 * @description 描述资源的当前状态条件
 */
export interface Condition {
  /** 条件类型 */
  type: string
  /** 条件原因 */
  reason?: string
  /** 条件消息 */
  message?: string
  /** 上次转换时间 */
  lastTransitionTime?: string
  /** 上次心跳时间 */
  lastHeartbeatTime?: string
}

/**
 * Kubernetes 污点效果枚举
 */
export type TaintEffect = 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute'

/**
 * Kubernetes 污点配置
 */
export interface Taint {
  /** 键名 */
  key: string
  /** 值（可选） */
  value?: string
  /** 影响效果 */
  effect: TaintEffect
  /** 添加时间（可选） */
  timeAdded?: string
}

/**
 * 事件来源
 * @description 描述事件产生的来源信息
 */
export interface EventSource {
  /** 来源组件（如 kubelet、scheduler） */
  component?: string
  /** 来源主机名 */
  host?: string
}

/**
 * 事件
 */
export interface Event {
  /** 事件类型（Normal: 正常事件；Warning: 警告事件） */
  type?: string
  /** 事件原因 */
  reason?: string
  /** 事件消息 */
  message?: string
  /** 关联的资源对象 */
  involvedObject?: ObjectReference
  /** 事件来源 */
  source?: EventSource
  /** 事件发生次数 */
  count?: number
  /** 首次发生时间 */
  firstTimestamp?: string
  /** 最后发生时间 */
  lastTimestamp?: string
}
