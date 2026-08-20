/**
 * Ingress 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/network/ingress/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { IngressSpec, IngressStatusObj } from './types'

/**
 * Ingress 查询条件请求对象
 */
export interface IngressQueryForm extends UidEntity, PageForm {
  /** Ingress 名称（模糊匹配） */
  name?: string
  /** 命名空间名称 */
  namespace: string
  /** Ingress 类名 */
  ingressClassName?: string
}

/**
 * Ingress 列表项响应对象
 */
export interface IngressListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** Ingress 名称 */
  name: string
  /** 描述信息（取自 annotations.bee.kube/description） */
  description: string
  /** Ingress 类名（对应 IngressClassName 资源名称） */
  ingressClassName?: string
  defaultBackendService: string
  ruleCount: number
  tlsCount: number
}

export interface IngressDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述信息（取自 annotations.bee.kube/description） */
  description: string
  spec: IngressSpec
  statusObj: IngressStatusObj
}

/** Ingress YAML 响应对象 */
export interface IngressYamlVo {
  /** Ingress 完整 YAML 文本 */
  yaml: string
}

/** Ingress 创建请求对象 */
export interface IngressCreateForm {
  /** 描述信息 */
  description: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
  spec: IngressSpec
}

/** Ingress 更新请求对象 */
export interface IngressUpdateForm {
  /** 描述信息 */
  description: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
  spec: IngressSpec
}
