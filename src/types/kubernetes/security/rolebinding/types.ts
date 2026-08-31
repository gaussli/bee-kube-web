/**
 * RoleBinding 资源实体类型定义
 * @module types/kubernetes/security/rolebinding/types
 */

import type { RoleRef, Subject } from '@/types/kubernetes/security/types'

/**
 * RoleBinding 实体
 * @description 引用一个 Role（不包含其定义），并通过 Subject 追加作用对象信息；命名空间级别资源
 */
export interface RoleBinding {
  /** 角色绑定作用的主体列表 */
  subjects?: Subject[]
  /** 角色引用，指向同命名空间下的 Role；此字段不可变 */
  roleRef: RoleRef
}
