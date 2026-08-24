/**
 * DaemonSet 工作负载页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/workload/daemonset/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ServiceType } from '@/config/kubernetes/network/service'
import type { DaemonSetStatus, DaemonSetUpdateStrategyType } from '@/config/kubernetes/workload/daemonset'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'
import type { HistoryRevision } from '../types'

import type { DaemonSetSpec, DaemonSetStatusObj } from './types'

/**
 * DaemonSet 查询条件请求对象
 */
export interface DaemonSetQueryForm extends UidEntity, PageForm {
  /** DaemonSet 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** DaemonSet 状态 */
  status: DaemonSetStatus
}

/**
 * DaemonSet 列表项响应对象
 */
export interface DaemonSetListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** DaemonSet 名称 */
  name: string
  /** DaemonSet 描述 */
  description?: string
  /** DaemonSet 状态 */
  status: DaemonSetStatus
  /** DaemonSet 状态信息 */
  statusMsg?: string
  /** 目标调度副本总数 */
  desiredNumberScheduled: number
  /** 就绪副本数 */
  numberReady: number
  /** 更新策略 */
  updateStrategyType: DaemonSetUpdateStrategyType
}

/**
 * DaemonSet 详情响应对象
 */
export interface DaemonSetDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** DaemonSet 描述 */
  description?: string
  /** DaemonSet 状态 */
  status: DaemonSetStatus
  /** DaemonSet 状态信息 */
  statusMsg?: string
  /** DaemonSet Spec */
  spec: DaemonSetSpec
  /** DaemonSet Status */
  statusObj: DaemonSetStatusObj
}

/**
 * DaemonSet YAML 响应对象
 */
export interface DaemonSetYamlVo {
  /** DaemonSet 完整 YAML 文本 */
  yaml: string
}

/**
 * DaemonSet 历史版本查询条件请求对象
 */
export interface DaemonSetHistoryRevisionQueryForm extends PageForm {
  /** 修订版本号 */
  revision: number
  /** 变更原因 */
  changeCause: string
}

/**
 * DaemonSet 历史版本列表项响应对象
 */
export interface DaemonSetHistoryRevisionListVo extends HistoryRevision {}

/**
 * DaemonSet 关联网络资源响应对象
 */
export interface DaemonSetNetworkVo {
  /** 关联的 Service 列表 */
  services: DaemonSetServiceListVo[]
  /** 关联的 Ingress 列表 */
  ingresses: DaemonSetIngressListVo[]
}

/**
 * DaemonSet 关联 Service 列表项响应对象
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
 * DaemonSet 关联 Ingress 列表项响应对象
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
 * DaemonSet 监控响应对象
 */
export interface DaemonSetMonitorVo {}

/**
 * DaemonSet 创建请求对象
 */
export interface DaemonSetCreateForm extends ObjectMetaCreatableForm {
  /** DaemonSet 描述 */
  description: string
  /** DaemonSet Spec */
  spec: DaemonSetSpec
}

/**
 * DaemonSet 更新请求对象
 */
export interface DaemonSetUpdateForm extends ObjectMetaEditableForm {
  /** DaemonSet 描述 */
  descriptio: string
  /** DaemonSet Spec */
  spec: DaemonSetSpec
}

/**
 * DaemonSet 回滚请求对象
 */
export interface DaemonSetRollbackForm {
  /** 目标历史版本号 */
  revision: number
}
