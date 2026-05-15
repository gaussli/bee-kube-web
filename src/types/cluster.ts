// 集群管理相关类型定义
import type { BaseEntity, PageReq } from './common'

export interface ClusterQueryReq extends PageReq {
  id: string
  name: string
  status: number
}

export interface ClusterReq {
  id: string
  name: string
  description: string
  apiServer: string
  ca: string
  clientCa: string
  clientKey: string
  kubeconfig: string
}

export interface ClusterResp extends BaseEntity {
  name: string
  description?: string
  apiServer: string
  status: number
  k8sVersion?: string
}
