/**
 * 集群资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/cluster/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ClusterStatus } from '@/config/kubernetes/cluster'

/**
 * 集群查询请求参数
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface ClusterQueryForm extends UidEntity, PageForm {
  /** 集群名称 */
  name: string
  /** 集群状态 */
  status: ClusterStatus
}

/**
 * 集群列表对象响应数据
 * @extends UidEntity 继承 UID 类型
 * @extends AuditEntity 继承基础实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface ClusterListVo extends UidEntity, AuditEntity, DeletableEntity {
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description?: string
  /** 集群状态 */
  status: ClusterStatus
  /** 状态信息 */
  statusMsg?: string
  /** API Server 地址 */
  apiServer: string
  /** Kubernetes 版本 */
  k8sVersion: string
}

/**
 * 集群详情对象响应数据
 * @extends UidEntity 继承 UID 类型
 * @extends AuditEntity 继承基础实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface ClusterDetailVo extends UidEntity, AuditEntity, DeletableEntity {
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description?: string
  /** 集群状态 */
  status: ClusterStatus
  /** 集群状态描述信息（如异常原因） */
  statusMsg?: string
  /** API Server 地址 */
  apiServer: string
  /** Kubernetes 版本 */
  k8sVersion: string
  /** 证书过期时间 */
  certExpireAt: string
}

/**
 * 集群注册表单（Agent 模式）
 * @remarks 暂无字段，预留扩展
 */
export interface ClusterRegisterForm {}
