/**
 * ClusterRole 资源实体类型定义
 * @module types/kubernetes/security/clusterrole/types
 */

import type { LabelSelector } from '../../types'
import type { PolicyRule } from '../types'

/**
 * ClusterRole 实体
 */
export interface ClusterRole {
  /** 该 ClusterRole 的全部策略规则 */
  rules: PolicyRule[]
  /** 聚合规则（可选）；设置后 Rules 由控制器托管，手动修改会被覆盖 */
  aggregationRule?: AggregationRule
}

/**
 * AggregationRule 聚合规则
 */
export interface AggregationRule {
  /** 用于查找 ClusterRole 并合并其权限的标签选择器列表 */
  clusterRoleSelectors?: LabelSelector
}
