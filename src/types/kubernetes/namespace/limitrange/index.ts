/**
 * Namespace LimitRange 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/namespace/limitrange/index
 */

import type { AuditEntity, DeletableEntity, UidEntity } from '@/types/common'

import type { LimitRangeSpec } from './types'

/**
 * Namespace LimitRange 详情视图对象
 */
export interface NamespaceLimitRangeDetailVo extends UidEntity, AuditEntity, DeletableEntity {
  /** 描述信息 */
  description?: string
  /** LimitRange 配置约束规格 */
  spec: LimitRangeSpec
}

/**
 * Namespace LimitRange YAML 响应对象
 */
export interface NamespaceLimitRangeYamlVo {
  /** LimitRange 完整 YAML 文本 */
  yaml: string
}

/**
 * Namespace LimitRange 创建请求对象
 */
export interface NamespaceLimitRangeCreateForm {
  /** 描述信息 */
  description: string
  /** LimitRange 配置约束规格 */
  spec: LimitRangeSpec
}

/**
 * Namespace LimitRange 更新请求对象
 */
export interface NamespaceLimitRangeUpdateForm {
  /** 描述信息 */
  description: string
  /** LimitRange 配置约束规格 */
  spec: LimitRangeSpec
}
