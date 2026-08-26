/**
 * Role 页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/security/role/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { Role } from './types'

/**
 * Role 查询条件请求对象
 */
export interface RoleQueryForm extends UidEntity, PageForm {
  /** Role 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
}

/**
 * Role 列表项响应对象
 */
export interface RoleListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** Role 名称 */
  name: string
  /** Role 描述 */
  description?: string
  /** 策略规则数量 */
  ruleCount: number
}

/**
 * Role 详情响应对象
 */
export interface RoleDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta, Role {
  /** Role 描述 */
  description?: string
}

/**
 * Role YAML 响应对象
 */
export interface RoleYamlVo {
  /** Role 完整 YAML 文本 */
  yaml: string
}

/**
 * Role 创建请求对象
 */
export interface RoleCreateForm extends ObjectMetaCreatableForm, Role {
  /** Role 描述 */
  description: string
}

/**
 * Role 更新请求对象
 */
export interface RoleUpdateForm extends ObjectMetaEditableForm, Role {
  /** Role 描述 */
  description: string
}

/**
 * Role 导出查询条件请求对象
 */
export interface RoleExportQueryForm extends ExportQueryForm, RoleQueryForm {}
