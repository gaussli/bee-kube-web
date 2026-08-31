/**
 * 服务（Service）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/network/service/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/index'
import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '@/types/kubernetes/index'
import type { Clustered, Namespaced, ObjectMeta } from '@/types/kubernetes/types'

import type { ServiceType } from '@/config/kubernetes/network/service'

import type { ServiceSpec, ServiceStatusObj } from './types'

/**
 * 查询条件请求对象
 */
export interface ServiceQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** Service 类型 */
  type: ServiceType
}

/**
 * 列表项响应对象
 */
export interface ServiceListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
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
 * 详情响应对象
 */
export interface ServiceDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** Spec */
  spec: ServiceSpec
  /** Status */
  statusObj: ServiceStatusObj
}

/**
 * YAML 响应对象
 */
export interface ServiceYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface ServiceCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: ServiceSpec
}

/**
 * 更新请求对象
 */
export interface ServiceUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: ServiceSpec
}

/**
 * 导出查询条件请求对象
 */
export interface ServiceExportQueryForm extends ExportQueryForm, ServiceQueryForm {}
