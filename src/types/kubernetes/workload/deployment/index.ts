/**
 * Deployment 工作负载页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/workload/deployment/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ServiceType } from '@/config/kubernetes/network/service'
import type { DeploymentStatus, DeploymentUpdateStrategyType } from '@/config/kubernetes/workload/deployment'

import type { Clustered, Namespaced, ObjectMeta } from '../../types'
import type { HistoryRevision } from '../types'

import type { DeploymentSpec, DeploymentStatusObj } from './types'

/**
 * Deployment 查询条件请求对象
 */
export interface DeploymentQueryForm extends UidEntity, PageForm {
  /** Deployment 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** Deployment 状态 */
  status: DeploymentStatus
}

/**
 * Deployment 列表项响应对象
 */
export interface DeploymentListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** Deployment 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: DeploymentStatus
  /** 状态信息 */
  statusMsg?: string
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 更新策略 */
  updateStrategyType: DeploymentUpdateStrategyType
}

/**
 * Deployment 详情响应对象
 */
export interface DeploymentDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: DeploymentStatus
  /** 状态信息 */
  statusMsg?: string
  /** Deployment 的规格定义 */
  spec: DeploymentSpec
  /** Deployment 的观测状态 */
  statusObj: DeploymentStatusObj
}

/** Deployment YAML 响应对象 */
export interface DeploymentYamlVo {
  /** Deployment 的完整 YAML 文本 */
  yaml: string
}

/**
 * Deployment 历史版本查询条件请求对象
 */
export interface DeploymentHistoryRevisionQueryForm extends PageForm {
  /** 修订版本号 */
  revision: number
  /** 变更原因 */
  changeCause: string
}

/**
 * Deployment 历史版本列表项响应对象
 */
export interface DeploymentHistoryRevisionListVo extends HistoryRevision {}

/**
 * Deployment 关联网络资源响应对象
 */
export interface DeploymentNetworkVo {
  /** 关联的 Service 列表 */
  services: DeploymentServiceListVo[]
  /** 关联的 Ingress 列表 */
  ingresses: DeploymentIngressListVo[]
}

/**
 * Deployment 关联 Service 列表项响应对象
 */
export interface DeploymentServiceListVo extends UidEntity, AuditEntity, DeletableEntity {
  /** Service 名称 */
  name: string
  /** Service 描述 */
  description: string
  /** Service 类型 */
  type: ServiceType
  /** 集群内部 IP */
  clusterIp: string
  /** 外部域名（仅 ExternalName 类型生效） */
  externalName: string
  /** 是否为 Headless Service */
  headless: boolean
}

/**
 * Deployment 关联 Ingress 列表项响应对象
 */
export interface DeploymentIngressListVo extends UidEntity, AuditEntity, DeletableEntity {
  /** Ingress 名称 */
  name: string
  /** Ingress 描述 */
  description: string
  /** Ingress 类名 */
  ingressClassName?: string
}

/**
 * Deployment 监控响应对象
 */
export interface DeploymentMonitorVo {}

/**
 * Deployment 创建请求对象
 */
export interface DeploymentCreateForm {
  /** Deployment 描述 */
  description?: string
  /** Deployment 的资源元数据 */
  metadata: ObjectMeta
  /** Deployment 的规格定义 */
  spec: DeploymentSpec
}

/**
 * Deployment 更新请求对象
 */
export interface DeploymentUpdateForm {
  /** Deployment 描述 */
  description?: string
  /** Deployment 的资源元数据 */
  metadata: ObjectMeta
  /** Deployment 的规格定义 */
  spec: DeploymentSpec
}

/**
 * Deployment 扩缩容请求对象
 */
export interface DeploymentScaleForm {
  /** 期望副本数 */
  replicas: number
}

/**
 * Deployment 回滚请求对象
 */
export interface DeploymentRollbackForm {
  /** 目标历史版本号 */
  revision: number
}
