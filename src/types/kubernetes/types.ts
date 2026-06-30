/**
 * Kubernetes 通用类型定义
 * @module types/kubernetes/types
 */

import type { BaseEntity } from '../common'

export interface Clustered extends BaseEntity {
  clusterId?: string
  clusterUid: string
  clusterName?: string
}

export interface Namespaced extends Clustered {
  namespaceId?: string
  namespaceUid?: string
  namespace: string
}

/**
 * Kubernetes 元数据
 */
export interface Metadata {
  /** 标签 */
  labels: Record<string, string>
  /** 注解 */
  annotations: Record<string, string>
}

/**
 * Kubernetes 对象引用
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
 */
export interface Condition<T> {
  /** 条件类型 */
  type: T
  /** 条件状态 */
  status: string
  /** 条件原因 */
  reason?: string
  /** 条件消息 */
  message?: string
  /** 最后一次状态变更时间 */
  lastTransitionTime?: string
  /** Node 特有，最后一次心跳时间 */
  lastHeartbeatTime?: string
  /** Pod 特有，kubelet 最后一次探测 Pod Conditioin 状态时间 */
  lastProbeTime?: string
  /** Workload，最后一次更新时间 */
  lastUpdateTime?: string
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
 * 描述事件产生的来源信息
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
 * Kubernetes 事件
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

export type ContainerStatus = 'Waiting' | 'Running' | 'Terminated'

export interface ContainerResource {
  request: {
    cpu: number
    memory: number
  }
  limit: {
    cpu: number
    memory: number
  }
}

export interface ContainerPort {
  name: string
  protocol: string
  containerPort: number
  hostPort: number
}

export interface Container {
  containerId: string
  name: string
  status: ContainerStatus
  statusMessage: string
  image: string
  ports: ContainerPort[]
  restart: number
  isInit: boolean
}

/**
 * StatefulSet 副本状态
 */
export interface StatefulSetReplicaStatus {
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 当前副本数 */
  currentReplicas: number
  /** 更新副本数 */
  updatedReplicas: number
}

/**
 * VolumeClaimTemplate 持久化存储模板
 */
export interface VolumeClaimTemplate {
  /** 名称 */
  name: string
  /** 存储类名 */
  storageClassName?: string
  /** 请求存储大小 */
  resources?: {
    requests?: {
      storage: string
    }
  }
  /** 访问模式 */
  accessModes?: string[]
}
