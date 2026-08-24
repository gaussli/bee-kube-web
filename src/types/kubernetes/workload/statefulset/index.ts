/**
 * StatefulSet 工作负载页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/workload/statefulset/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ServiceType } from '@/config/kubernetes/network/service'
import type { StatefulSetStatus, StatefulSetUpdateStrategyType } from '@/config/kubernetes/workload/statefulset'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'
import type { HistoryRevision } from '../types'

import type { StatefulSetSpec, StatefulSetStatusObj } from './types'

/**
 * StatefulSet 查询条件请求对象
 */
export interface StatefulSetQueryForm extends UidEntity, PageForm {
  /** StatefulSet 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** StatefulSet 状态 */
  status: StatefulSetStatus
}

/**
 * StatefulSet 列表项响应对象
 */
export interface StatefulSetListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** StatefulSet 名称 */
  name: string
  /** StatefulSet 描述 */
  description?: string
  /** StatefulSet 状态 */
  status: StatefulSetStatus
  /** StatefulSet 状态信息 */
  statusMsg?: string
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 更新策略 */
  updateStrategyType: StatefulSetUpdateStrategyType
}

/**
 * StatefulSet 详情响应对象
 */
export interface StatefulSetDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** StatefulSet 描述 */
  description?: string
  /** StatefulSet 状态 */
  status: StatefulSetStatus
  /** StatefulSet 状态信息 */
  statusMsg?: string
  /** StatefulSet Spec */
  spec: StatefulSetSpec
  /** StatefulSet Status */
  statusObj: StatefulSetStatusObj
}

/**
 * StatefulSet YAML 响应对象
 */
export interface StatefulSetYamlVo {
  /** StatefulSet 完整 YAML 文本 */
  yaml: string
}

/**
 * StatefulSet 历史版本查询条件请求对象
 */
export interface StatefulSetHistoryRevisionQueryForm extends PageForm {
  /** 修订版本号 */
  revision: number
  /** 变更原因 */
  changeCause: string
}

/**
 * StatefulSet 历史版本列表项响应对象
 */
export interface StatefulSetHistoryRevisionListVo extends HistoryRevision {}

/**
 * StatefulSet 关联网络资源响应对象
 */
export interface StatefulSetNetworkVo {
  /** 关联的 Service 列表 */
  services: StatefulSetServiceListVo[]
  /** 关联的 Ingress 列表 */
  ingresses: StatefulSetIngressListVo[]
}

/**
 * StatefulSet 关联 Service 列表项响应对象
 */
export interface StatefulSetServiceListVo extends UidEntity, AuditEntity {
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
 * StatefulSet 关联 Ingress 列表项响应对象
 */
export interface StatefulSetIngressListVo extends UidEntity, AuditEntity {
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
 * StatefulSet 监控响应对象
 */
export interface StatefulSetMonitorVo {}

/**
 * StatefulSet 创建请求对象
 */
export interface StatefulSetCreateForm extends ObjectMetaCreatableForm {
  /** StatefulSet 描述 */
  description: string
  /** StatefulSet Spec */
  spec: StatefulSetSpec
}

/**
 * StatefulSet 更新请求对象
 */
export interface StatefulSetUpdateForm extends ObjectMetaEditableForm {
  /** StatefulSet 描述 */
  description: string
  /** StatefulSet Spec */
  spec: StatefulSetSpec
}

/**
 * StatefulSet 扩缩容请求对象
 */
export interface StatefulSetScaleForm {
  /** 期望副本数 */
  replicas: number
}

/**
 * StatefulSet 滚动更新分区请求对象
 */
export interface StatefulSetPartitionForm {
  /** 分区序号，序号大于等于该值的 Pod 才会被滚动更新 */
  partition: number
}

/**
 * StatefulSet 回滚请求对象
 */
export interface StatefulSetRollbackForm {
  /** 目标历史版本号 */
  revision: number
}
