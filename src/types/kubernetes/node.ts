/**
 * 节点管理相关类型定义
 * @module types/kubernetes/node
 */
import type { BaseEntity, PageReq } from '@/types/common'
import type { Condition, Event, Taint } from './types'

/**
 * 节点响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface NodeResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName: string
  /** 节点名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** IP 地址 */
  ip: string
  /** 状态 */
  status: string
  /** 是否不可调度 */
  unschedulable: boolean
  /** CPU 分配 */
  cpuAllocation: string
  /** CPU 使用 */
  cpuUsage: string
  /** 内存分配 */
  memoryAllocation: string
  /** 内存使用 */
  memoryUsage: string
  /** 存储分配 */
  storageAllocation: string
  /** 存储使用 */
  storageUsage: string
  /** Pod 分配 */
  podAllocation: string
  /** Pod 使用 */
  podUsage: string
}

/**
 * 节点概览响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface NodeOverviewResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName: string
  /** 节点名称 */
  name: string
  /** 描述信息 */
  description: string
  /** IP 地址 */
  ip: string
  /** 主机名 */
  hostname: string
  /** 角色列表 */
  roles: string[]
  /** 状态 */
  status: string
  /** 是否不可调度 */
  unschedulable: boolean
  /** CRI 版本 */
  criVersion: string
  /** Kubelet 版本 */
  kubeletVersion: string
  /** Kube-Proxy 版本 */
  kubeProxyVersion: string
  /** 操作系统 */
  os: string
  /** 操作系统镜像 */
  osImage: string
  /** 内核版本 */
  kernelVersion: string
  /** 架构 */
  architecture: string
}

/**
 * 节点运行状态响应数据
 */
export interface NodeRunningResp {
  /** 条件列表 */
  conditions: Condition[]
  /** 污点列表 */
  taints: Taint[]
  /** CPU 容量 */
  cpuCapacity: string
  /** CPU 分配 */
  cpuAllocation: string
  /** CPU 使用 */
  cpuUsage: string
  /** 内存容量 */
  memoryCapacity: string
  /** 内存分配 */
  memoryAllocation: string
  /** 内存使用 */
  memoryUsage: string
  /** 存储容量 */
  storageCapacity: string
  /** 存储分配 */
  storageAllocation: string
  /** 存储使用 */
  storageUsage: string
  /** Pod 容量 */
  podCapacity: string
  /** Pod 分配 */
  podAllocation: string
  /** Pod 使用 */
  podUsage: string
}

/**
 * 节点元数据响应数据
 */
export interface NodeMetadataResp {
  /** 标签 */
  labels: Record<string, string>
  /** 注解 */
  annotations: Record<string, string>
  /** 拓扑信息 */
  topologies: Record<string, string>
}

/**
 * 节点事件响应数据
 * @extends Event 继承事件基础类型
 */
export interface NodeEventResp extends Event {}

/**
 * 节点镜像响应数据
 */
export interface NodeImageResp {
  /** 镜像名称列表 */
  names: string[]
  /** 镜像大小（字节） */
  sizeBytes: number
}

/**
 * 节点卷响应数据
 */
export interface NodeVolumesResp {
  /** 卷名称 */
  name: string
  /** 挂载路径 */
  mountPath: string
  /** 卷类型（如 emptyDir、hostPath、persistentVolumeClaim 等） */
  type: string
  /** 存储容量 */
  capacity: string
  /** 挂载状态 */
  status: string
}

/**
 * 节点查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface NodeQueryReq extends PageReq {
  /** 节点名称（模糊匹配） */
  name?: string
  /** IP 地址 */
  ip?: string
  /** 状态 */
  status?: string
  /** 标签选择器 */
  labelSelector?: string
}

/**
 * 节点创建/更新请求参数
 */
export interface NodeReq {
  /** 节点名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 拓扑信息 */
  topologies?: Record<string, string>
}

/**
 * 节点调度控制请求
 * @description 用于设置节点是否可调度（cordon/uncordon）
 */
export interface NodeCordonReq {
  /** 是否不可调度 */
  cordon: boolean
}

/**
 * 节点标签配置请求
 */
export interface NodeLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * 节点注解配置请求
 */
export interface NodeAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * 节点拓扑配置请求
 */
export interface NodeTopologiesReq {
  /** 拓扑键值对 */
  topologies: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * 节点污点配置请求
 */
export interface NodeTaintsReq {
  /** 污点配置列表 */
  taints: Taint[]
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}
