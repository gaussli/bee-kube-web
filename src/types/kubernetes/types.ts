/**
 * Kubernetes 通用类型定义
 * @module types/kubernetes/types
 */

/**
 * 集群归属信息
 */
export interface Clustered {
  /** 集群 UID */
  clusterUid: string
  /** 集群名称 */
  clusterName: string
}

/**
 * 命名空间归属信息
 */
export interface Namespaced {
  /** 命名空间 UID */
  namespaceUid: string
  /** 命名空间名称 */
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
  apiVersion: string
  /** 资源类型 */
  kind: string
  /** 资源名称 */
  name: string
  /** 资源所属命名空间（集群级资源为空） */
  namespace?: string
  /** 资源唯一标识 */
  uid: string
  /** 资源版本号（用于乐观锁） */
  resourceVersion: string
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
  type: EventType
  /** 事件原因 */
  reason: string
  /** 事件消息 */
  message: string
  /** 关联的资源对象 */
  involvedObject: ObjectReference
  /** 事件来源 */
  source: EventSource
  /** 事件发生次数 */
  count: number
  /** 首次发生时间 */
  firstTimestamp: string
  /** 最后发生时间 */
  lastTimestamp: string
}

/**
 * 容器状态枚举
 * - Waiting: 等待中（如镜像拉取、依赖未就绪）
 * - Running: 运行中
 * - Terminated: 已终止
 */
export type ContainerStatus = 'Waiting' | 'Running' | 'Terminated'

/**
 * 容器资源配置
 * @remarks 包含资源请求（Request）和资源限制（Limit）两部分
 */
export interface ContainerResource {
  /** 资源请求量 */
  request: {
    /** CPU 请求量（单位：核） */
    cpu: number
    /** 内存请求量（单位：Mi） */
    memory: number
  }
  /** 资源限制量 */
  limit: {
    /** CPU 限制量（单位：核） */
    cpu: number
    /** 内存限制量（单位：Mi） */
    memory: number
  }
}

/**
 * 容器端口映射
 */
export interface ContainerPort {
  /** 端口名称 */
  name: string
  /** 协议类型（如 TCP、UDP） */
  protocol: string
  /** 容器端口号 */
  containerPort: number
  /** 宿主机端口号 */
  hostPort: number
}

/**
 * 容器信息
 */
export interface Container {
  /** 容器 ID */
  containerId: string
  /** 容器名称 */
  name: string
  /** 容器状态 */
  status: ContainerStatus
  /** 容器状态详情信息 */
  statusMessage: string
  /** 容器镜像 */
  image: string
  /** 容器端口映射列表 */
  ports: ContainerPort[]
  /** 重启次数 */
  restart: number
  /** 是否为初始化容器 */
  isInit: boolean
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
