/**
 * Kubernetes 命名空间实体类型定义（依据 entity-namespace-design.md 派生）
 * @module types/kubernetes/namespace/types
 */

import type { Condition } from '@/types/kubernetes/types'

import type { FinalizerName, NamespaceConditionType, NamespacePhase } from '@/config/kubernetes/namespace'

/**
 * 命名空间行为规格定义
 */
export interface NamespaceSpec {
  /** 命名空间生命周期阶段（已废弃，保留兼容） */
  finalizers?: FinalizerName[]
}

/**
 * 命名空间当前状态信息（对应源码 NamespaceStatus）
 */
export interface NamespaceStatusObj {
  /** 命名空间最近观测到的生命周期阶段 */
  phase?: NamespacePhase
  /** 命名空间当前观测到的条件列表 */
  conditions?: Condition<NamespaceConditionType>[]
}
