/**
 * Role 资源实体类型定义
 * @module types/kubernetes/security/role/types
 */

import type { PolicyRule } from '@/types/kubernetes/security/types'

/**
 * Role 实体
 * @description 命名空间级别的 PolicyRule 逻辑分组，可被 RoleBinding 引用
 */
export interface Role {
  /** 该 Role 的全部策略规则 */
  rules: PolicyRule[]
}
