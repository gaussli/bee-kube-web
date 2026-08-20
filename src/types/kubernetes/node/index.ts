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
 * 节点查询条件请求对象
 */
export interface NodeQueryForm extends UidEntity, PageForm {
  /** 节点名称（模糊匹配） */
  name: string
  /** IP 地址 */
  ip: string
  /** 状态 */
  status: NodeStatus
}

/**
 * 节点列表项响应对象
 */
export interface NodeListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** 节点名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: NodeStatus
  /** 状态描述信息 */
  statusMsg?: string
  /** IP 地址 */
  ip: string
  /** 是否不可调度 */
  unschedulable: boolean
  /** 节点资源 */
  resource: {
    /** 物理容量（节点/集群的总硬件资源） */
    capacity: Record<ResourceName, Quantity>
    /** Kubernetes 可分配容量（物理容量减去操作系统等系统预留资源） */
    allocation: Record<ResourceName, Quantity>
    /** 资源已用量 */
    usage: Record<ResourceName, Quantity>
  }
  /** 节点上运行的 Pod 数量 */
  podCount: number
  /** Kubelet 版本 */
  kubeletVersion: string
}

/**
 * 节点详情响应对象
 */
export interface NodeDetail extends UidEntity, Clustered, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: NodeStatus
  /** 状态描述信息 */
  statusMsg?: string
  spec: NodeSpec
  statusObj: NodeStatusObj
}

/** 节点 YAML 响应对象 */
export interface NodeYamlVo {
  /** 节点完整 YAML 文本 */
  yaml: string
}

/**
 * 节点监控响应对象
 */
export interface NodeMonitorVo {}

/**
 * 节点封锁请求对象
 */
export interface NodeCordonForm {
  cordon: boolean
}

/**
 * 节点拓扑配置请求对象
 */
export interface NodeTopologiesForm {
  /** 拓扑键值对 */
  topologies: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * 节点污点配置请求对象
 */
export interface NodeTaintsForm {
  /** 污点配置列表 */
  taints: Taint[]
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}
