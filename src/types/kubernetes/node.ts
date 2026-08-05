/**
 * 节点管理相关类型定义
 * @module types/kubernetes/node
 */
import type { BaseEntity, PageForm } from '@/types/common'

import type { MetadataAnnotationForm, MetadataLabelForm, ResourceVo } from './comomn'
import type { Condition, Event, Metadata, Taint } from './types'

/**
 * 节点状态枚举
 * - Ready: 节点健康，可正常调度 Pod
 * - NotReady: 节点不健康，无法调度 Pod
 * - Unknown: 节点状态未知
 */
export type NodeType = 'Ready' | 'NotReady' | 'Unknown'

/**
 * 节点条件类型枚举
 * - Ready: 节点Ready状态
 * - MemoryPressure: 内存压力
 * - DiskPressure: 磁盘压力
 * - PIDPressure: PID压力
 * - NetworkUnavailable: 网络不可用
 */
export type NodeConditionType = 'Ready' | 'MemoryPressure' | 'DiskPressure' | 'PIDPressure' | 'NetworkUnavailable'

/**
 * 节点响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface NodeListResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 ID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName: string
  /** 节点名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: NodeType
  /** 状态描述信息 */
  statusMsg?: string
  /** IP 地址 */
  ip: string
  /** 是否不可调度 */
  unschedulable: boolean
  /** 节点资源（容量/可分配/已用） */
  resource: NodeResourceVo
}

/**
 * 节点概览响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface NodeOverviewResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 ID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName: string
  /** 节点名称 */
  name: string
  /** 描述信息 */
  description: string
  /** 状态 */
  status: NodeType
  /** 状态描述信息 */
  statusMsg?: string
  /** 角色列表 */
  roles: string[]
  /** IP 地址 */
  ip: string
  /** 主机名 */
  hostname: string
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
  /** 条件列表 */
  conditions: Condition<NodeConditionType>[]
  /** 污点列表 */
  taints: Taint[]
}

/**
 * 节点资源用量响应数据
 */
export interface NodeResourceVo extends ResourceVo {}

/**
 * 节点元数据响应数据
 */
export interface NodeMetadataResp extends Metadata {
  /** 拓扑信息 */
  topologies: Record<string, string>
}

/**
 * 节点事件响应数据
 * @extends Event 继承事件基础类型
 */
export interface NodeEventResp extends Event {}

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
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface NodeQueryReq extends PageForm {
  id: string
  /** 节点名称（模糊匹配） */
  name: string
  /** IP 地址 */
  ip: string
  /** 状态 */
  status: NodeType
  /** 状态描述信息 */
  statusMsg?: string
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
export interface NodeLabelsReq extends MetadataLabelForm {}

/**
 * 节点注解配置请求
 */
export interface NodeAnnotationsReq extends MetadataAnnotationForm {}

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
