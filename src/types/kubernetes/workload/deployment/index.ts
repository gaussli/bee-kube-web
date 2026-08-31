/**
 * 无状态应用（Deployment）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/workload/deployment/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/index'
import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '@/types/kubernetes/index'
import type { Clustered, Namespaced, ObjectMeta } from '@/types/kubernetes/types'
import type { HistoryRevision } from '@/types/kubernetes/workload/types'

import type { ServiceType } from '@/config/kubernetes/network/service'
import type { DeploymentStatus, DeploymentUpdateStrategyType } from '@/config/kubernetes/workload/deployment'

import type { DeploymentSpec, DeploymentStatusObj } from './types'

/**
 * 查询条件请求对象
 */
export interface DeploymentQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** 状态 */
  status: DeploymentStatus
}

/**
 * 列表项响应对象
 */
export interface DeploymentListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
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
 * 详情响应对象
 */
export interface DeploymentDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** 状态 */
  status: DeploymentStatus
  /** 状态信息 */
  statusMsg?: string
  /** Spec */
  spec: DeploymentSpec
  /** Status */
  statusObj: DeploymentStatusObj
}

/**
 * YAML 响应对象
 */
export interface DeploymentYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 历史版本查询条件请求对象
 */
export interface DeploymentHistoryRevisionQueryForm extends PageForm {
  /** 修订版本号 */
  revision: number
  /** 变更原因 */
  changeCause: string
}

/**
 * 历史版本列表项响应对象
 */
export interface DeploymentHistoryRevisionListVo extends HistoryRevision {}

/**
 * 关联网络资源响应对象
 */
export interface DeploymentNetworkVo {
  /** 关联的 Service 列表 */
  services: DeploymentServiceListVo[]
  /** 关联的 Ingress 列表 */
  ingresses: DeploymentIngressListVo[]
}

/**
 * 关联服务（Service）列表项响应对象
 */
export interface DeploymentServiceListVo extends UidEntity, AuditEntity, DeletableEntity {
  /** Service 名称 */
  name: string
  /** Service 描述 */
  description?: string
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
 * 关联入口（Ingress）列表项响应对象
 */
export interface DeploymentIngressListVo extends UidEntity, AuditEntity, DeletableEntity {
  /** Ingress 名称 */
  name: string
  /** Ingress 描述 */
  description?: string
  /** Ingress 类名 */
  ingressClassName?: string
  /** 默认 Service */
  defaultBackendService: string
  /** 路由规则数量 */
  ruleCount: number
  /** TLS 配置数量 */
  tlsCount: number
}

/**
 * 监控查询请求对象
 */
export interface DeploymentMonitorQueryForm {}

/**
 * 监控响应对象
 */
export interface DeploymentMonitorVo {}

/**
 * 创建请求对象
 */
export interface DeploymentCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: DeploymentSpec
}

/**
 * 更新请求对象
 */
export interface DeploymentUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: DeploymentSpec
}

/**
 * 导出查询条件请求对象
 */
export interface DeploymentExportQueryForm extends ExportQueryForm, DeploymentQueryForm {}

/**
 * 扩缩容请求对象
 */
export interface DeploymentScaleForm {
  /** 期望副本数 */
  replicas: number
}

/**
 * 回滚请求对象
 */
export interface DeploymentRollbackForm {
  /** 目标历史版本号 */
  revision: number
}
