/**
 * 集群（Cluster）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/cluster/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ClusterStatus } from '@/config/kubernetes/cluster'
import type { ResourceName } from '@/config/kubernetes/core'

import type { Quantity } from '../types'

/**
 * 集群（Cluster）查询请求参数
 */
export interface ClusterQueryForm extends UidEntity, PageForm {
  /** 集群名称 */
  name: string
  /** 集群状态 */
  status: ClusterStatus
}

/**
 * 集群（Cluster）列表对象响应数据
 */
export interface ClusterListVo extends UidEntity, AuditEntity, DeletableEntity {
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description?: string
  /** 集群状态 */
  status: ClusterStatus
  /** 集群状态信息 */
  statusMsg?: string
  /** API Server 地址 */
  apiServer: string
  /** Kubernetes 版本 */
  k8sVersion: string
}

/**
 * 集群（Cluster）详情对象响应数据
 */
export interface ClusterDetailVo extends UidEntity, AuditEntity, DeletableEntity {
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description?: string
  /** 集群状态 */
  status: ClusterStatus
  /** 集群状态信息 */
  statusMsg?: string
  /** API Server 地址 */
  apiServer: string
  /** Kubernetes 版本 */
  k8sVersion: string
  /** 证书过期时间 */
  certExpireAt: string
  /** 集群资源 */
  resource: {
    /** 物理容量（Node 总硬件资源） */
    capacity: Partial<Record<ResourceName, Quantity>>
    /** Kubernetes 可分配容量（物理容量减去操作系统等系统预留资源） */
    allocation: Partial<Record<ResourceName, Quantity>>
    /** 资源已用量 */
    usage: Partial<Record<ResourceName, Quantity>>
  }
}

/**
 * 集群（Cluster）纳管请求对象
 */
export interface ClusterRegisterForm {}

/**
 * 集群（Cluster）更新请求对象
 */
export interface ClusterUpdateForm {
  /** 集群描述 */
  description?: string
}
