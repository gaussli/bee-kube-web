/**
 * 角色绑定（RoleBinding）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/security/rolebinding/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/index'
import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '@/types/kubernetes/index'
import type { Clustered, Namespaced, ObjectMeta } from '@/types/kubernetes/types'

import type { RoleBinding } from './types'

/**
 * 查询条件请求对象
 */
export interface RoleBindingQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
}

/**
 * 列表项响应对象
 */
export interface RoleBindingListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 绑定的角色名称 */
  roleName: string
  /** 绑定的角色类型 */
  roleKind: string
  /** 主体数量 */
  subjectCount: number
}

/**
 * 详情响应对象
 */
export interface RoleBindingDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta, RoleBinding {
  /** 描述 */
  description?: string
}

/**
 * YAML 响应对象
 */
export interface RoleBindingYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface RoleBindingCreateForm extends ObjectMetaCreatableForm, RoleBinding {
  /** 描述 */
  description?: string
}

/**
 * 更新请求对象
 */
export interface RoleBindingUpdateForm extends ObjectMetaEditableForm, RoleBinding {
  /** 描述 */
  description?: string
}

/**
 * 导出查询条件请求对象
 */
export interface RoleBindingExportQueryForm extends ExportQueryForm, RoleBindingQueryForm {}
