/**
 * ClusterRoleBinding 页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/security/clusterrolebinding/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, ObjectMeta } from '../../types'

import type { ClusterRoleBinding } from './types'

/**
 * ClusterRoleBinding 查询条件请求对象
 */
export interface ClusterRoleBindingQueryForm extends UidEntity, PageForm {
  /** ClusterRoleBinding 名称 */
  name: string
}

/**
 * ClusterRoleBinding 列表项响应对象
 */
export interface ClusterRoleBindingListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** ClusterRoleBinding 名称 */
  name: string
  /** ClusterRoleBinding 描述 */
  description?: string
  /** 绑定的角色名称 */
  roleName: string
  /** 绑定的角色类型 */
  roleKind: string
  /** 主体数量 */
  subjectCount: number
}

/**
 * ClusterRoleBinding 详情响应对象
 */
export interface ClusterRoleBindingDetailVo
  extends UidEntity, Clustered, AuditEntity, DeletableEntity, ObjectMeta, ClusterRoleBinding {
  /** ClusterRoleBinding 描述 */
  description?: string
}

/**
 * ClusterRoleBinding YAML 响应对象
 */
export interface ClusterRoleBindingYamlVo {
  /** ClusterRoleBinding 完整 YAML 文本 */
  yaml: string
}

/**
 * ClusterRoleBinding 创建请求对象
 */
export interface ClusterRoleBindingCreateForm extends ObjectMetaCreatableForm, ClusterRoleBinding {
  /** ClusterRoleBinding 描述 */
  description: string
}

/**
 * ClusterRoleBinding 更新请求对象
 */
export interface ClusterRoleBindingUpdateForm extends ObjectMetaEditableForm, ClusterRoleBinding {
  /** ClusterRoleBinding 描述 */
  description: string
}
