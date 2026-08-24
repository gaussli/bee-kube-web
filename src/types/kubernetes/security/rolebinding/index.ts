/**
 * RoleBinding 页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/security/rolebinding/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { RoleBinding } from './types'

/**
 * RoleBinding 查询条件请求对象
 */
export interface RoleBindingQueryForm extends UidEntity, PageForm {
  /** RoleBinding 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
}

/**
 * RoleBinding 列表项响应对象
 */
export interface RoleBindingListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** RoleBinding 名称 */
  name: string
  /** RoleBinding 描述 */
  description?: string
  /** 绑定的角色名称 */
  roleName: string
  /** 绑定的角色类型 */
  roleKind: string
  /** 主体数量 */
  subjectCount: number
}

/**
 * RoleBinding 详情响应对象
 */
export interface RoleBindingDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta, RoleBinding {
  /** RoleBinding 描述 */
  description?: string
}

/**
 * RoleBinding YAML 响应对象
 */
export interface RoleBindingYamlVo {
  /** RoleBinding 完整 YAML 文本 */
  yaml: string
}

/**
 * RoleBinding 创建请求对象
 */
export interface RoleBindingCreateForm extends ObjectMetaCreatableForm, RoleBinding {
  /** RoleBinding 描述 */
  description: string
}

/**
 * RoleBinding 更新请求对象
 */
export interface RoleBindingUpdateForm extends ObjectMetaEditableForm, RoleBinding {
  /** RoleBinding 描述 */
  description: string
}
