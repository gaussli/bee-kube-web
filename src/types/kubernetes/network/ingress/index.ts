/**
 * 入口（Ingress）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/network/ingress/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { IngressSpec, IngressStatusObj } from './types'

/**
 * 查询条件请求对象
 */
export interface IngressQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** Ingress 类名 */
  ingressClassName: string
}

/**
 * 列表项响应对象
 */
export interface IngressListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
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
 * 详情响应对象
 */
export interface IngressDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** Spec */
  spec: IngressSpec
  /** Status */
  statusObj: IngressStatusObj
}

/**
 * YAML 响应对象
 */
export interface IngressYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface IngressCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: IngressSpec
}

/**
 * 更新请求对象
 */
export interface IngressUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: IngressSpec
}

/**
 * 导出查询条件请求对象
 */
export interface IngressExportQueryForm extends ExportQueryForm, IngressQueryForm {}
