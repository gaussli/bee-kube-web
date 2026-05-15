// 节点管理相关类型定义

import type { BaseEntity, PageReq } from './common'

/**
 * 节点响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface NodeResp extends BaseEntity {
  /** 节点ID */
  id: string // 节点ID
  /** 节点名称 */
  name: string // 节点名称
  description?: string // 节点描述
  clusterId: string // 所属集群ID
  clusterName?: string // 所属集群名称
  status: string // 节点状态
  roles: string[] // 节点角色，如 master, worker
  version: string // Kubernetes 版本
  os: string // 操作系统
  architecture: string // CPU 架构
  internalIp: string // 内网 IP
  cpu: string // CPU 使用情况，格式：已用/总量
  memory: string // 内存使用情况，格式：已用/总量
  pods: string // Pod 数量，格式：已用/上限
  allocatedCpu?: string // 已分配 CPU 核数
  allocatedMemory?: string // 已分配内存
  labels?: Record<string, string> // 节点标签
  annotations?: Record<string, string> // 节点注解
  schedulable?: boolean // 是否可调度
}

export interface NodeQueryReq extends PageReq {
  id: string
  name: string
  ip: string
  status: string
}

export interface NodeReq {
  id: string
  name: string
  description: string
}

export interface NodeEditReq {
  labels?: Record<string, string>
  annotations?: Record<string, string>
  taints?: Array<{
    key: string
    value: string
    effect: string
  }>
}
