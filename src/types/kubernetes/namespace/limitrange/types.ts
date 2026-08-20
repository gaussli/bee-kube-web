/**
 * LimitRange 资源实体类型定义
 * @module types/kubernetes/namespace/limitrange/types
 */

import type { ResourceName } from '@/config/kubernetes/core'
import type { NamespaceLimitRangeItemType } from '@/config/kubernetes/namespace'

import type { Quantity } from '../../types'

export interface LimitRangeSpec {
  /** 限制范围的资源限制列表 */
  limits: LimitRangeItem[]
}

export interface LimitRangeItem {
  /** 限制范围的类型 */
  type: NamespaceLimitRangeItemType
  /** 限制范围的资源限制列表 */
  max?: Record<ResourceName, Quantity>
  /** 限制范围的资源请求列表 */
  min?: Record<ResourceName, Quantity>
  /** 限制范围的默认资源限制列表 */
  default?: Record<ResourceName, Quantity>
  /** 限制范围的默认请求资源列表 */
  defaultRequest?: Record<ResourceName, Quantity>
  /** 限制范围的最大使用率资源列表 */
  maxLimitRequestRatio?: Record<ResourceName, Quantity>
}
