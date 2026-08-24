/**
 * Node 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/node/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ResourceName } from '@/config/kubernetes/core'
import type { NodeStatus } from '@/config/kubernetes/node'

import type { Clustered, ObjectMeta, Quantity } from '../types'

import type { NodeSpec, NodeStatusObj, Taint } from './types'

/**
 * Node 查询条件请求对象
 */
export interface NodeQueryForm extends UidEntity, PageForm {
  /** Node 名称 */
  name: string
  /** Node 状态 */
  status: NodeStatus
  /** IP 地址 */
  ip: string
}

/**
 * Node 列表项响应对象
 */
export interface NodeListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** Node 名称 */
  name: string
  /** Node 描述 */
  description?: string
  /** Node 状态 */
  status: NodeStatus
  /** Node 状态信息 */
  statusMsg?: string
  /** IP 地址 */
  ip: string
  /** 是否不可调度 */
  unschedulable: boolean
  /** Node 资源 */
  resource: {
    /** 物理容量（Node 总硬件资源） */
    capacity: Record<ResourceName, Quantity>
    /** Kubernetes 可分配容量（物理容量减去操作系统等系统预留资源） */
    allocation: Record<ResourceName, Quantity>
    /** 资源已用量 */
    usage: Record<ResourceName, Quantity>
  }
  /** Node 的 Pod 数量 */
  podCount: number
  /** Kubelet 版本 */
  kubeletVersion: string
}

/**
 * Node 详情响应对象
 */
export interface NodeDetailVo extends UidEntity, Clustered, AuditEntity, DeletableEntity, ObjectMeta {
  /** Node 描述 */
  description?: string
  /** Node 状态 */
  status: NodeStatus
  /** Node 状态信息 */
  statusMsg?: string
  /** Node Spec */
  spec: NodeSpec
  /** Node Status */
  statusObj: NodeStatusObj
}

/**
 * Node YAML 响应对象
 */
export interface NodeYamlVo {
  /** Node 完整 YAML 文本 */
  yaml: string
}

/**
 * Node 监控响应对象
 */
export interface NodeMonitorVo {}

/**
 * Node 隔离请求对象
 */
export interface NodeCordonForm {
  cordon: boolean
}

/**
 * Node 拓扑配置请求对象
 */
export interface NodeTopologiesForm {
  /** 拓扑键值对 */
  topologies: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * Node 污点配置请求对象
 */
export interface NodeTaintsForm {
  /** 污点配置列表 */
  taints: Taint[]
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}
