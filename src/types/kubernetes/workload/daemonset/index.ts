/**
 * 守护进程集（DaemonSet）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/workload/daemonset/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { ServiceType } from '@/config/kubernetes/network/service'
import type { DaemonSetStatus, DaemonSetUpdateStrategyType } from '@/config/kubernetes/workload/daemonset'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'
import type { HistoryRevision } from '../types'

import type { DaemonSetSpec, DaemonSetStatusObj } from './types'

/**
 * 查询条件请求对象
 */
export interface DaemonSetQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** 状态 */
  status: DaemonSetStatus
}

/**
 * 列表项响应对象
 */
export interface DaemonSetListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: DaemonSetStatus
  /** 状态信息 */
  statusMsg?: string
  /** 目标调度副本总数 */
  desiredNumberScheduled: number
  /** 就绪副本数 */
  numberReady: number
  /** 更新策略 */
  updateStrategyType: DaemonSetUpdateStrategyType
}

/**
 * 详情响应对象
 */
export interface DaemonSetDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** 状态 */
  status: DaemonSetStatus
  /** 状态信息 */
  statusMsg?: string
  /** Spec */
  spec: DaemonSetSpec
  /** Status */
  statusObj: DaemonSetStatusObj
}

/**
 * YAML 响应对象
 */
export interface DaemonSetYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 历史版本查询条件请求对象
 */
export interface DaemonSetHistoryRevisionQueryForm extends PageForm {
  /** 修订版本号 */
  revision: number
  /** 变更原因 */
  changeCause: string
}

/**
 * 历史版本列表项响应对象
 */
export interface DaemonSetHistoryRevisionListVo extends HistoryRevision {}

/**
 * 关联网络资源响应对象
 */
export interface DaemonSetNetworkVo {
  /** 关联的 Service 列表 */
  services: DaemonSetServiceListVo[]
  /** 关联的 Ingress 列表 */
  ingresses: DaemonSetIngressListVo[]
}

/**
 * 关联服务（Service）列表项响应对象
 */
export interface DaemonSetServiceListVo extends UidEntity, AuditEntity {
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
export interface DaemonSetIngressListVo extends UidEntity, AuditEntity {
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
export interface DaemonSetMonitorQueryForm {}

/**
 * 监控响应对象
 */
export interface DaemonSetMonitorVo {}

/**
 * 创建请求对象
 */
export interface DaemonSetCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: DaemonSetSpec
}

/**
 * 更新请求对象
 */
export interface DaemonSetUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: DaemonSetSpec
}

/**
 * 导出查询条件请求对象
 */
export interface DaemonSetExportQueryForm extends ExportQueryForm, DaemonSetQueryForm {}

/**
 * 回滚请求对象
 */
export interface DaemonSetRollbackForm {
  /** 目标历史版本号 */
  revision: number
}
