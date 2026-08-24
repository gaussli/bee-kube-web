/**
 * Cluster 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/cluster/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ClusterStatus } from '@/config/kubernetes/cluster'

/**
 * Cluster 查询请求参数
 */
export interface ClusterQueryForm extends UidEntity, PageForm {
  /** Cluster 名称 */
  name: string
  /** Cluster 状态 */
  status: ClusterStatus
}

/**
 * Cluster 列表对象响应数据
 */
export interface ClusterListVo extends UidEntity, AuditEntity, DeletableEntity {
  /** Cluster 名称 */
  name: string
  /** Cluster 描述 */
  description?: string
  /** Cluster 状态 */
  status: ClusterStatus
  /** Cluster 状态信息 */
  statusMsg?: string
  /** API Server 地址 */
  apiServer: string
  /** Kubernetes 版本 */
  k8sVersion: string
}

/**
 * Cluster 详情对象响应数据
 */
export interface ClusterDetailVo extends UidEntity, AuditEntity, DeletableEntity {
  /** Cluster 名称 */
  name: string
  /** Cluster 描述 */
  description?: string
  /** Cluster 状态 */
  status: ClusterStatus
  /** Cluster 状态信息 */
  statusMsg?: string
  /** API Server 地址 */
  apiServer: string
  /** Kubernetes 版本 */
  k8sVersion: string
  /** 证书过期时间 */
  certExpireAt: string
}

/**
 * Cluster 纳管请求对象
 */
export interface ClusterRegisterForm {}
