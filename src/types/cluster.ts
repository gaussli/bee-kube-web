// 集群管理相关类型定义

import type { BaseEntity } from './common'

export interface ClusterQueryReq {
  id?: string
  name?: string
  status?: number
  page?: number
  pageSize?: number
}

export interface ClusterResp extends BaseEntity {
  name: string
  apiServer: string
  description?: string
  status: number
  k8sVersion?: string
}

export interface ClusterPageResp {
  list: ClusterResp[]
  total: number
}
