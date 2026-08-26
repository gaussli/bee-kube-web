/**
 * Ingress 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/network/ingress/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { IngressSpec, IngressStatusObj } from './types'

/**
 * Ingress 查询条件请求对象
 */
export interface IngressQueryForm extends UidEntity, PageForm {
  /** Ingress 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** Ingress 类名 */
  ingressClassName: string
}

/**
 * Ingress 列表项响应对象
 */
export interface IngressListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
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
 * Ingress 详情视图对象
 */
export interface IngressDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** Ingress 描述 */
  description?: string
  /** Ingress Spec */
  spec: IngressSpec
  /** Ingress Status */
  statusObj: IngressStatusObj
}

/**
 * Ingress YAML 响应对象
 */
export interface IngressYamlVo {
  /** Ingress 完整 YAML 文本 */
  yaml: string
}

/**
 * Ingress 创建请求对象
 */
export interface IngressCreateForm extends ObjectMetaCreatableForm {
  /** Ingress 描述 */
  description: string
  /** Ingress Spec */
  spec: IngressSpec
}

/**
 * Ingress 更新请求对象
 */
export interface IngressUpdateForm extends ObjectMetaEditableForm {
  /** Ingress 描述 */
  description: string
  /** Ingress Spec */
  spec: IngressSpec
}

/**
 * Ingress 导出查询条件请求对象
 */
export interface IngressExportQueryForm extends ExportQueryForm, IngressQueryForm {}
