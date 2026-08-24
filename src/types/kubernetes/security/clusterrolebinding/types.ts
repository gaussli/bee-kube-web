/**
 * ClusterRoleBinding 资源实体类型定义
 * @module types/kubernetes/security/clusterrolebinding/types
 */

import type { RoleRef, Subject } from '../types'

/**
 * ClusterRoleBinding 实体
 */
export interface ClusterRoleBinding {
  /** 角色绑定作用的主体列表 */
  subjects?: Subject[]
  /** 角色引用，只能指向全局命名空间下的 ClusterRole；此字段不可变 */
  roleRef: RoleRef
}
