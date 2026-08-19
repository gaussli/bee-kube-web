/**
 * Kubernetes 节点实体类型定义（依据 entity-node-design.md 派生）
 * @module types/kubernetes/node/types
 */

import type { ResourceName } from '@/config/kubernetes/core'
import type { NodeAddressType, NodeConditionType, NodePhase, TaintEffect } from '@/config/kubernetes/node'

import type { ObjectMeta, Condition, Quantity } from '../types'

/**
 * 节点行为规格定义
 */
export interface NodeSpec {
  /** 分配给节点的 Pod IP 段 */
  podCIDR?: string
  /** 分配给节点的 Pod IP 段列表，第 0 项须与 podCIDR 一致，IPv4 与 IPv6 各最多 1 个 */
  podCIDRs?: string[]
  /** 云厂商分配的节点 ID，格式为 <ProviderName>://<ProviderSpecificNodeID> */
  providerID?: string
  /** 是否禁止新 Pod 调度到该节点，默认为 false（可调度） */
  unschedulable?: boolean
  /** 节点污点列表 */
  taints?: Taint[]
  /** Deprecated：动态 Kubelet 配置来源，该特性已移除 */
  configSource?: NodeConfigSource
  /** Deprecated：部分 kubelet 不再设置该字段，1.13 后移除，请勿依赖 */
  externalID?: string
}

/**
 * 节点当前状态信息（对应源码 NodeStatus）
 */
export interface NodeStatusObj {
  /** 节点总资源量 */
  capacity?: Record<ResourceName, Quantity>
  /** 节点可调度资源量，默认等于 capacity */
  allocatable?: Record<ResourceName, Quantity>
  /** 节点最近观测到的生命周期阶段，已废弃且不再填充 */
  phase?: NodePhase
  /** 节点当前观测到的条件列表 */
  conditions?: Condition<NodeConditionType>[]
  /** 节点可达地址列表 */
  addresses?: NodeAddress[]
  /** 节点上守护进程暴露的端点 */
  daemonEndpoints?: NodeDaemonEndpoints
  /** 节点唯一标识信息 */
  nodeInfo?: NodeSystemInfo
  /** 节点上的容器镜像列表 */
  images?: ContainerImage[]
  /** 节点上正在使用（已挂载）的卷名称列表，类型为 UniqueVolumeName */
  volumesInUse?: string[]
  /** 已挂载到节点的卷列表 */
  volumesAttached?: AttachedVolume[]
  /** 动态 Kubelet 配置分配状态 */
  config?: NodeConfigStatus
  /** 可用的运行时处理器列表 */
  runtimeHandlers?: NodeRuntimeHandler[]
  /** CRI 实现所支持的特性集合，+featureGate=SupplementalGroupsPolicy */
  features?: NodeFeatures
  /** 节点声明的与 feature gate 相关的特性列表，+featureGate=NodeDeclaredFeatures */
  declaredFeatures?: string[]
}

/**
 * Kubernetes 节点根实体
 * @extends ObjectMeta 继承资源元数据（name / labels / annotations / uid 等）
 */
export interface Node extends ObjectMeta {
  /** 节点行为规格 */
  spec?: NodeSpec
  /** 节点当前状态 */
  status?: NodeStatusObj
}

/**
 * 节点上的污点，对不容忍该污点的 Pod 施加 effect 指定的作用
 */
export interface Taint {
  /** 污点键，必填 */
  key: string
  /** 与污点键对应的值 */
  value?: string
  /** 污点对 Pod 的作用效果，必填 */
  effect: TaintEffect
  /** 污点被添加的时间（ISO 时间） */
  timeAdded?: string
}

/**
 * 节点地址信息
 */
export interface NodeAddress {
  /** 地址类型 */
  type: NodeAddressType
  /** 节点地址 */
  address: string
}

/**
 * 节点上守护进程暴露的端点列表
 */
export interface NodeDaemonEndpoints {
  /** Kubelet 监听端点 */
  kubeletEndpoint?: DaemonEndpoint
}

/**
 * 单个守护进程端点信息
 */
export interface DaemonEndpoint {
  /** 端点端口号 */
  Port: number
}

/**
 * 用于唯一标识节点的 ID / UUID 集合
 */
export interface NodeSystemInfo {
  /** 节点 machine-id，集群内唯一机器标识首选字段 */
  machineID: string
  /** 节点 SystemUUID，Red Hat 主机专用 */
  systemUUID: string
  /** 节点 Boot ID */
  bootID: string
  /** 节点内核版本（uname -r） */
  kernelVersion: string
  /** 节点操作系统镜像（/etc/os-release） */
  osImage: string
  /** 节点容器运行时版本（如 containerd://1.4.2） */
  containerRuntimeVersion: string
  /** 节点 Kubelet 版本 */
  kubeletVersion: string
  /** Deprecated：节点 KubeProxy 版本 */
  kubeProxyVersion?: string
  /** 节点操作系统 */
  operatingSystem: string
  /** 节点架构 */
  architecture: string
  /** 节点交换内存信息，+optional */
  swap?: NodeSwapStatus
}

/**
 * 节点交换内存信息
 */
export interface NodeSwapStatus {
  /** 交换内存总量（字节） */
  capacity?: number
}

/**
 * 容器镜像描述
 */
export interface ContainerImage {
  /** 镜像的已知名称列表 */
  names?: string[]
  /** 镜像大小（字节） */
  sizeBytes?: number
}

/**
 * 已挂载到节点的卷描述
 */
export interface AttachedVolume {
  /** 已挂载卷名称，类型为 UniqueVolumeName */
  name: string
  /** 卷可用的设备路径 */
  devicePath: string
}

/**
 * 运行时处理器信息集合
 */
export interface NodeRuntimeHandler {
  /** 运行时处理器名称，默认为空表示默认运行时处理器 */
  name?: string
  /** 支持的特性，+optional */
  features?: NodeRuntimeHandlerFeatures
}

/**
 * 运行时处理器实现的特性集合
 */
export interface NodeRuntimeHandlerFeatures {
  /** 是否支持递归只读挂载 */
  recursiveReadOnlyMounts?: boolean
  /** 是否支持用户命名空间（含卷） */
  userNamespaces?: boolean
}

/**
 * CRI 实现所支持的特性集合（仅依赖 CRI 实现，独立于运行时处理器）
 */
export interface NodeFeatures {
  /** 运行时是否支持 SupplementalGroupsPolicy 与 ContainerUser，+featureGate=SupplementalGroupsPolicy */
  supplementalGroupsPolicy?: boolean
}

/**
 * Node.Spec.ConfigSource 所分配配置的状态
 */
export interface NodeConfigStatus {
  /** 节点将尝试使用的已检查点配置 */
  assigned?: NodeConfigSource
  /** 节点正在使用的已检查点配置 */
  active?: NodeConfigSource
  /** 出错时回退的已知良好配置 */
  lastKnownGood?: NodeConfigSource
  /** 同步 Spec.ConfigSource 到 Active 配置过程中出现的可读错误描述 */
  error?: string
}

/**
 * 节点配置来源（Deprecated：自 1.22 起废弃，动态 Kubelet 配置特性已移除）
 */
export interface NodeConfigSource {
  /** 指向节点 ConfigMap 的引用 */
  configMap?: ConfigMapNodeConfigSource
}

/**
 * 引用 ConfigMap 作为节点配置来源的详细信息（Deprecated：自 1.22 起废弃）
 */
export interface ConfigMapNodeConfigSource {
  /** 被引用 ConfigMap 的 metadata.namespace，必填 */
  namespace: string
  /** 被引用 ConfigMap 的 metadata.name，必填 */
  name: string
  /** 被引用 ConfigMap 的 metadata.UID；在 Node.Spec 中禁用，Node.Status 中必填 */
  uid?: string
  /** 被引用 ConfigMap 的 metadata.ResourceVersion；在 Node.Spec 中禁用，Node.Status 中必填 */
  resourceVersion?: string
  /** 被引用 ConfigMap 中对应 KubeletConfiguration 结构的键名，必填 */
  kubeletConfigKey: string
}
