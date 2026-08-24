/**
 * Service 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/network/service/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ServiceType } from '@/config/kubernetes/network/service'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { ServiceSpec, ServiceStatusObj } from './types'

/**
 * Service 查询条件请求对象
 */
export interface ServiceQueryForm extends UidEntity, PageForm {
  /** Service 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** Service 类型 */
  type: ServiceType
}

/**
 * Service 列表项响应对象
 */
export interface ServiceListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
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
 * Service 详情视图对象
 */
export interface ServiceDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** Service 描述 */
  description?: string
  /** Service Spec */
  spec: ServiceSpec
  /** Service Status */
  statusObj: ServiceStatusObj
}

/**
 * Service YAML 响应对象
 */
export interface ServiceYamlVo {
  /** Service 完整 YAML 文本 */
  yaml: string
}

/**
 * Service 创建请求对象
 */
export interface ServiceCreateForm extends ObjectMetaCreatableForm {
  /** Service 描述 */
  description: string
  /** Service Spec */
  spec: ServiceSpec
}

/**
 * Service 更新请求对象
 */
export interface ServiceUpdateForm extends ObjectMetaEditableForm {
  /** Service 描述 */
  description: string
  /** Service Spec */
  spec: ServiceSpec
}
