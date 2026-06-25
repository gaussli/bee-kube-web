/**
 * Kubernetes 集群管理类型定义
 * @module types/kubernetes/cluster
 */
import type { BaseEntity, PageReq } from '@/types/common'
import type { ResourceResp } from '@/types/kubernetes/comomn'

/**
 * 集群查询请求参数
 */
export interface ClusterQueryReq extends PageReq {
  /** 集群ID */
  id: string
  /** 集群名称 */
  name: string
  /** 集群状态 */
  status: number
}

/**
 * 集群列表响应数据
 */
export interface ClusterListResp extends BaseEntity {
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description?: string
  /** API Server 地址 */
  apiServer: string
  /** 集群状态 */
  status: number
  /** 集群状态描述 */
  statusMsg?: string
  /** Kubernetes 版本 */
  k8sVersion: string
}

/**
 * 集群详情响应数据
 */
export interface ClusterDetailResp extends BaseEntity {
  /** 集群名称 */
  name: string
  /** API Server 地址 */
  apiServer: string
  /** 集群描述 */
  description?: string
  /** 集群状态 */
  status: number
  /** 集群状态描述 */
  statusMsg?: string
  /** Kubernetes 版本 */
  k8sVersion: string
  /** 证书过期时间 */
  certExpireAt: string
}

/**
 * 集群资源用量数据
 */
export interface ClusterResourceResp extends ResourceResp {}

/**
 * 集群创建/更新请求参数
 */
export interface ClusterReq {
  /** 集群ID */
  id: string
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description: string
  /** API Server 地址 */
  apiServer: string
  /** CA 证书 */
  ca: string
  /** 客户端 CA 证书 */
  clientCa: string
  /** 客户端私钥 */
  clientKey: string
  /** Kubeconfig 配置 */
  kubeconfig: string
}

/**
 * 集群注册请求参数（Agent 模式）
 */
export interface ClusterRegistrationReq {
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description: string
  /** Kubeconfig 配置 */
  kubeconfig: string
  /** 集群标签 */
  labels: Record<string, string>
}
