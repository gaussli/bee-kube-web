// 节点管理相关类型定义

import type { BaseEntity, PageReq } from './common'

export interface NodeQueryReq extends PageReq {
  id?: string
  name?: string
  ip?: string
  status?: string
}

export interface NodeResp extends BaseEntity {
  id: string
  name: string
  description?: string
  clusterId: string
  clusterName?: string
  status: string
  roles: string[]
  version: string
  os: string
  architecture: string
  internalIp: string
  cpu: string
  memory: string
  pods: string
  allocatedCpu?: string
  allocatedMemory?: string
  labels?: Record<string, string>
  annotations?: Record<string, string>
  schedulable?: boolean
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
