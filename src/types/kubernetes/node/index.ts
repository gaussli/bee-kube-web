/**
 * 节点（Node）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/node/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { ResourceName } from '@/config/kubernetes/core'
import type { NodeStatus } from '@/config/kubernetes/node'

import type { Clustered, ObjectMeta, Quantity } from '../types'

import type { NodeSpec, NodeStatusObj, Taint } from './types'

/**
 * TopN 查询条件请求对象
 */
export interface NodeTopNQueryForm {
  /** 排序方式 */
  sorted: 'createAt' | 'cpuUsage' | 'memoryUsage'
  /** n 个 Node */
  n: number
}

/**
 * 查询条件请求对象
 */
export interface NodeQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** 状态 */
  status: NodeStatus
  /** IP 地址 */
  ip: string
}

/**
 * 列表项响应对象
 */
export interface NodeListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: NodeStatus
  /** 状态信息 */
  statusMsg?: string
  /** IP 地址 */
  ip: string
  /** 是否不可调度 */
  unschedulable: boolean
  /** Node 资源 */
  resource: {
    /** 物理容量（Node 总硬件资源） */
    capacity: Partial<Record<ResourceName, Quantity>>
    /** Kubernetes 可分配容量（物理容量减去操作系统等系统预留资源） */
    allocation: Partial<Record<ResourceName, Quantity>>
    /** 资源已用量 */
    usage: Partial<Record<ResourceName, Quantity>>
  }
  /** Kubelet 版本 */
  kubeletVersion: string
}

/**
 * 详情响应对象
 */
export interface NodeDetailVo extends UidEntity, Clustered, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** 状态 */
  status: NodeStatus
  /** 状态信息 */
  statusMsg?: string
  /** Spec */
  spec: NodeSpec
  /** Status */
  statusObj: NodeStatusObj
}

/**
 * YAML 响应对象
 */
export interface NodeYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 监控查询请求对象
 */
export interface NodeMonitorQueryForm {}

/**
 * 监控响应对象
 */
export interface NodeMonitorVo {}

/**
 * 导出查询条件请求对象
 */
export interface NodeExportQueryForm extends ExportQueryForm, NodeQueryForm {}

/**
 * 污点配置请求对象
 */
export interface NodeTaintsForm {
  /** 污点配置列表 */
  taints: Taint[]
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * 拓扑配置请求对象
 */
export interface NodeTopologiesForm {
  /** 拓扑键值对 */
  topologies: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * 封锁/解封请求对象
 */
export interface NodeCordonForm {
  cordon: boolean
}
