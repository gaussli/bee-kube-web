/**
 * Namespace LimitRange 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/namespace/limitrange/index
 */

import type { AuditEntity, DeletableEntity, UidEntity } from '@/types/common'

import type { LimitRangeSpec } from './types'

export interface NamespaceLimitRangeDetailVo extends UidEntity, AuditEntity, DeletableEntity {
  description?: string
  spec: LimitRangeSpec
}

export interface NamespaceLimitRangeYamlVo {
  yaml: string
}

export interface NamespaceLimitRangeCreateForm {
  description?: string
  spec: LimitRangeSpec
}

export interface NamespaceLimitRangeUpdateForm {
  description?: string
  spec: LimitRangeSpec
}
