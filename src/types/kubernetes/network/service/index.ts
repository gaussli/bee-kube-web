/**
 * Service 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/network/service/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ServiceType } from '@/config/kubernetes/network/service'

import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { ServiceSpec, ServiceStatusObj } from './types'

/**
 * Service 查询条件请求对象
 */
export interface ServiceQueryForm extends UidEntity, PageForm {
  /** Service 名称（模糊匹配） */
  name?: string
  /** 命名空间名称 */
  namespace: string
  /** Service 类型 */
  type?: ServiceType
}

/**
 * Service 列表项响应对象
 */
export interface ServiceListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** Service 名称 */
  name: string
  /** 描述信息 */
  description: string
  /** Service 类型 */
  type: ServiceType
  /** 集群内部 IP（ClusterIP / NodePort / LoadBalancer 类型自动分配） */
  clusterIp: string
  /** 外部域名（仅 ExternalName 类型生效） */
  externalName: string
  /** 是否为 Headless Service（clusterIp 为 None） */
  headless: boolean
}

export interface ServiceDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述信息 */
  description: string
  spec: ServiceSpec
  statusObj: ServiceStatusObj
}

/** Service YAML 响应对象 */
export interface ServiceYamlVo {
  /** Service 完整 YAML 文本 */
  yaml: string
}

/** Service 创建请求对象 */
export interface ServiceCreateForm {
  /** 描述信息 */
  description: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
  spec: ServiceSpec
}

/** Service 更新请求对象 */
export interface ServiceUpdateForm {
  /** 描述信息 */
  description: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
  spec: ServiceSpec
}
