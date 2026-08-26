/**
 * 命名空间资源限制（LimitRange）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/namespace/limitrange/index
 */

import type { AuditEntity, DeletableEntity, UidEntity } from '@/types/common'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { LimitRangeSpec } from './types'

/**
 * 详情响应对象
 */
export interface NamespaceLimitRangeDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** LimitRange 配置约束规格 */
  spec: LimitRangeSpec
}

/**
 * YAML 响应对象
 */
export interface NamespaceLimitRangeYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface NamespaceLimitRangeCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
  /** LimitRange 配置约束规格 */
  spec: LimitRangeSpec
}

/**
 * 更新请求对象
 */
export interface NamespaceLimitRangeUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
  /** LimitRange 配置约束规格 */
  spec: LimitRangeSpec
}
