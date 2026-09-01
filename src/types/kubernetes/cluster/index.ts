/**
 * 集群（Cluster）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/cluster/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/index'
import type { Quantity } from '@/types/kubernetes/types'

import type { ClusterStatus } from '@/config/kubernetes/cluster'
import type { ResourceName } from '@/config/kubernetes/core'

/**
 * 查询条件请求对象
 */
export interface ClusterQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** 状态 */
  status: ClusterStatus
}

/**
 * 列表项响应对象
 */
export interface ClusterListVo extends UidEntity, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: ClusterStatus
  /** 状态信息 */
  statusMsg?: string
  /** API Server 地址 */
  apiServer: string
  /** Kubernetes 版本 */
  k8sVersion: string
}

/**
 * 集群资源响应对象
 */
export interface ClusterResourceVo {
  /** 物理容量（Node 总硬件资源） */
  capacity: Partial<Record<ResourceName, Quantity>>
  /** Kubernetes 可分配容量（物理容量减去操作系统等系统预留资源） */
  allocation: Partial<Record<ResourceName, Quantity>>
  /** 资源已用量 */
  usage: Partial<Record<ResourceName, Quantity>>
}

/**
 * 详情响应对象
 */
export interface ClusterDetailVo extends UidEntity, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: ClusterStatus
  /** 状态信息 */
  statusMsg?: string
  /** API Server 地址 */
  apiServer: string
  /** Kubernetes 版本 */
  k8sVersion: string
  /** 证书过期时间 */
  certExpireAt: string
  /** 集群资源 */
  resource: ClusterResourceVo
}

/**
 * 纳管请求对象
 */
export interface ClusterRegisterForm {}

/**
 * 更新请求对象
 */
export interface ClusterUpdateForm {
  /** 描述 */
  description?: string
}

/**
 * 导出查询条件请求对象
 */
export interface ClusterExportQueryForm extends ExportQueryForm, ClusterQueryForm {}
