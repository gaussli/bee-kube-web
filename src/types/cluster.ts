/**
 * 集群管理相关类型定义
 * @description 包含集群查询请求、创建/更新请求、响应等类型定义
 */
import type { BaseEntity, PageReq } from './common'

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
 * 集群响应数据
 */
export interface ClusterResp extends BaseEntity {
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description?: string
  /** API Server 地址 */
  apiServer: string
  /** 集群状态 */
  status: number
  /** Kubernetes 版本 */
  k8sVersion?: string
}
