/**
 * ClusterRole 页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/security/clusterrole/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, ObjectMeta } from '../../types'

import type { ClusterRole } from './types'

/**
 * ClusterRole 查询条件请求对象
 */
export interface ClusterRoleQueryForm extends UidEntity, PageForm {
  /** ClusterRole 名称 */
  name: string
}

/**
 * ClusterRole 列表项响应对象
 */
export interface ClusterRoleListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** ClusterRole 名称 */
  name: string
  /** ClusterRole 描述 */
  description?: string
  /** 策略规则数量 */
  ruleCount: number
}

/**
 * ClusterRole 详情响应对象
 */
export interface ClusterRoleDetailVo
  extends UidEntity, Clustered, AuditEntity, DeletableEntity, ObjectMeta, ClusterRole {
  /** ClusterRole 描述 */
  description?: string
}

/**
 * ClusterRole YAML 响应对象
 */
export interface ClusterRoleYamlVo {
  /** ClusterRole 完整 YAML 文本 */
  yaml: string
}

/**
 * ClusterRole 创建请求对象
 */
export interface ClusterRoleCreateForm extends ObjectMetaCreatableForm, ClusterRole {
  /** ClusterRole 描述 */
  description: string
}

/**
 * ClusterRole 更新请求对象
 */
export interface ClusterRoleUpdateForm extends ObjectMetaEditableForm, ClusterRole {
  /** ClusterRole 描述 */
  description: string
}

/**
 * ClusterRole 导出查询条件请求对象
 */
export interface ClusterRoleExportQueryForm extends ExportQueryForm, ClusterRoleQueryForm {}
