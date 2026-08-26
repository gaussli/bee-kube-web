/**
 * 集群角色绑定（ClusterRoleBinding）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/security/clusterrolebinding/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, ObjectMeta } from '../../types'

import type { ClusterRoleBinding } from './types'

/**
 * 查询条件请求对象
 */
export interface ClusterRoleBindingQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
}

/**
 * 列表项响应对象
 */
export interface ClusterRoleBindingListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
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
export interface ClusterRoleBindingDetailVo
  extends UidEntity, Clustered, AuditEntity, DeletableEntity, ObjectMeta, ClusterRoleBinding {
  /** 描述 */
  description?: string
}

/**
 * YAML 响应对象
 */
export interface ClusterRoleBindingYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface ClusterRoleBindingCreateForm extends ObjectMetaCreatableForm, ClusterRoleBinding {
  /** 描述 */
  description?: string
}

/**
 * 更新请求对象
 */
export interface ClusterRoleBindingUpdateForm extends ObjectMetaEditableForm, ClusterRoleBinding {
  /** 描述 */
  description?: string
}

/**
 * 导出查询条件请求对象
 */
export interface ClusterRoleBindingExportQueryForm extends ExportQueryForm, ClusterRoleBindingQueryForm {}
