/**
 * Kubernetes 集群管理类型定义
 * @module types/kubernetes/cluster
 */
import type { BaseEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ClusterStatus } from '@/config/kubernetes/cluster'

import type { ResourceVo } from './comomn'

/**
 * 集群查询请求参数
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface ClusterQueryForm extends UidEntity, PageForm {
  /** 集群名称（模糊匹配） */
  name: string
  /** 集群状态 */
  status: ClusterStatus
}

/**
 * 集群列表对象响应数据
 * @extends BaseEntity 继承基础实体类型
 * @extends UidEntity 继承 UID 类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface ClusterListVo extends BaseEntity, UidEntity, DeletableEntity {
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description?: string
  /** API Server 地址 */
  apiServer: string
  /** 集群状态 */
  status: ClusterStatus
  /** 集群状态描述信息（如异常原因） */
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
  /** 集群状态 */
  status: ClusterStatus
  /** 集群状态描述 */
  statusMsg?: string
  /** Kubernetes 版本 */
  k8sVersion: string
  /** 证书过期时间 */
  certExpireAt: string
}

/**
 * 集群资源用量对象
 * @extends ResourceVo
 */
export interface ClusterResourceVo extends ResourceVo {}

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
