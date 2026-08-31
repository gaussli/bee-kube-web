/**
 * ResourceQuota 资源实体类型定义
 * @module types/kubernetes/namespace/resourcequota/types
 */

import type { Quantity } from '@/types/kubernetes/types'

import type {
  NamespaceResourceQuotaResourceType,
  NamespaceResourceQuotaScopeType,
  NamespaceResourceQuotaScopeSelectorOperator,
} from '@/config/kubernetes/namespace'

export interface ResourceQuotaSpec {
  /** 资源配额的硬限制列表 */
  hard?: Partial<Record<NamespaceResourceQuotaResourceType, Quantity>>
  scopes?: NamespaceResourceQuotaScopeType[]
  /** 资源配额的作用范围选择器 */
  scopeSelector?: ResourceQuotaScopeSelector
}

export interface ResourceQuotaScopeSelector {
  /** 资源配额的作用范围选择器的匹配表达式列表 */
  matchExpressions?: ResourceQuotaScopeSelectorRequirement[]
}

export interface ResourceQuotaScopeSelectorRequirement {
  /** 资源配额的作用范围选择器的匹配表达式的键 */
  key: NamespaceResourceQuotaScopeType
  /** 资源配额的作用范围选择器的匹配表达式的操作符 */
  operator: NamespaceResourceQuotaScopeSelectorOperator
  /** 资源配额的作用范围选择器的匹配表达式的值列表 */
  values?: string[]
}

export interface ResourceQuotaStatusObj {
  /** 资源配额的硬限制列表 */
  hard?: Partial<Record<NamespaceResourceQuotaResourceType, Quantity>>
  /** 资源配额的当前使用量列表 */
  used?: Partial<Record<NamespaceResourceQuotaResourceType, Quantity>>
}
