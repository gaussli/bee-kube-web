/**
 * 有状态应用（StatefulSet）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/workload/statefulset/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { ServiceType } from '@/config/kubernetes/network/service'
import type { StatefulSetStatus, StatefulSetUpdateStrategyType } from '@/config/kubernetes/workload/statefulset'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'
import type { HistoryRevision } from '../types'

import type { StatefulSetSpec, StatefulSetStatusObj } from './types'

/**
 * 查询条件请求对象
 */
export interface StatefulSetQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** 状态 */
  status: StatefulSetStatus
}

/**
 * 列表项响应对象
 */
export interface StatefulSetListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: StatefulSetStatus
  /** 状态信息 */
  statusMsg?: string
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 更新策略 */
  updateStrategyType: StatefulSetUpdateStrategyType
}

/**
 * 详情响应对象
 */
export interface StatefulSetDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** 状态 */
  status: StatefulSetStatus
  /** 状态信息 */
  statusMsg?: string
  /** Spec */
  spec: StatefulSetSpec
  /** Status */
  statusObj: StatefulSetStatusObj
}

/**
 * YAML 响应对象
 */
export interface StatefulSetYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 历史版本查询条件请求对象
 */
export interface StatefulSetHistoryRevisionQueryForm extends PageForm {
  /** 修订版本号 */
  revision: number
  /** 变更原因 */
  changeCause: string
}

/**
 * 历史版本列表项响应对象
 */
export interface StatefulSetHistoryRevisionListVo extends HistoryRevision {}

/**
 * 关联网络资源响应对象
 */
export interface StatefulSetNetworkVo {
  /** 关联的 Service 列表 */
  services: StatefulSetServiceListVo[]
  /** 关联的 Ingress 列表 */
  ingresses: StatefulSetIngressListVo[]
}

/**
 * 关联服务（Service）列表项响应对象
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
 * 关联入口（Ingress）列表项响应对象
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
 * 监控查询请求对象
 */
export interface StatefulSetMonitorQueryForm {}

/**
 * 监控响应对象
 */
export interface StatefulSetMonitorVo {}

/**
 * 创建请求对象
 */
export interface StatefulSetCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: StatefulSetSpec
}

/**
 * 更新请求对象
 */
export interface StatefulSetUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: StatefulSetSpec
}

/**
 * 导出查询条件请求对象
 */
export interface StatefulSetExportQueryForm extends ExportQueryForm, StatefulSetQueryForm {}

/**
 * 扩缩容请求对象
 */
export interface StatefulSetScaleForm {
  /** 期望副本数 */
  replicas: number
}

/**
 * 滚动更新分区请求对象
 */
export interface StatefulSetPartitionForm {
  /** 分区序号，序号大于等于该值的 Pod 才会被滚动更新 */
  partition: number
}

/**
 * 回滚请求对象
 */
export interface StatefulSetRollbackForm {
  /** 目标历史版本号 */
  revision: number
}
