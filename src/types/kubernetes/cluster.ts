/**
 * Kubernetes 集群管理类型定义
 * @module types/kubernetes/cluster
 */
import type { BaseEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

/**
 * 集群列表对象
 * @extends BaseEntity
 */
export interface ClusterListVo extends BaseEntity, UidEntity, DeletableEntity {
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description?: string
  /** API Server 地址 */
  apiServer: string
  /** 集群状态（0: 未就绪；1: 就绪） */
  status: number
  /** 集群状态描述 */
  statusMsg?: string
  /** Kubernetes 版本 */
  k8sVersion: string
}

/**
 * 集群详情对象
 * @extends BaseEntity
 */
export interface ClusterDetailVo extends BaseEntity, UidEntity, DeletableEntity {
  /** 集群名称 */
  name: string
  /** API Server 地址 */
  apiServer: string
  /** 集群描述 */
  description?: string
  /** 集群状态（0: 未就绪；1: 就绪） */
  status: number
  /** 集群状态描述 */
  statusMsg?: string
  /** Kubernetes 版本 */
  k8sVersion: string
  /** 证书过期时间 */
  certExpireAt: string
}

/**
 * 集群查询表单
 * @extends PageForm
 */
export interface ClusterQueryForm extends PageForm {
  /** 集群 UID */
  uid: string
  /** 集群名称 */
  name: string
  /** 集群状态（0: 未就绪；1: 就绪） */
  status: number
}

/**
 * 集群创建表单
 * @remarks 暂无字段，预留扩展
 */
export interface ClusterCreateForm {}

/**
 * 集群注册表单（Agent 模式）
 * @remarks 暂无字段，预留扩展
 */
export interface ClusterRegisterForm {}

/**
 * 集群更新表单
 * @remarks 暂无字段，预留扩展
 */
export interface ClusterUpdateForm {}
