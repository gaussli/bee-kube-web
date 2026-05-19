/**
 * Kubernetes 通用类型定义
 * @module types/kubernetes/types
 */

/**
 * Kubernetes 元数据
 * @description 用于描述资源的标签和注解信息
 */
export interface Metadata {
  /** 标签 */
  labels: Record<string, string>
  /** 注解 */
  annotations: Record<string, string>
}

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
 * - NoSchedule: 不允许调度新 Pod 到该节点
 * - PreferNoSchedule: 尽量避免调度新 Pod 到该节点
 * - NoExecute: 不允许调度并驱逐已有 Pod
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
 * Kubernetes 事件类型枚举
 * - Normal: 正常事件（如容器启动、调度成功）
 * - Warning: 警告事件（如资源不足、镜像拉取失败）
 */
export type EventType = 'Normal' | 'Warning'

/**
 * 事件
 */
export interface Event {
  /** 事件类型（Normal: 正常事件；Warning: 警告事件） */
  type?: EventType
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
