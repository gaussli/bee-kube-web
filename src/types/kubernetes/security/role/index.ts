/**
 * 角色（Role）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/security/role/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/index'
import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '@/types/kubernetes/index'
import type { Clustered, Namespaced, ObjectMeta } from '@/types/kubernetes/types'

import type { Role } from './types'

/**
 * 查询条件请求对象
 */
export interface RoleQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
}

/**
 * 列表项响应对象
 */
export interface RoleListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 策略规则数量 */
  ruleCount: number
}

/**
 * 详情响应对象
 */
export interface RoleDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta, Role {
  /** 描述 */
  description?: string
}

/**
 * YAML 响应对象
 */
export interface RoleYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface RoleCreateForm extends ObjectMetaCreatableForm, Role {
  /** 描述 */
  description?: string
}

/**
 * 更新请求对象
 */
export interface RoleUpdateForm extends ObjectMetaEditableForm, Role {
  /** 描述 */
  description?: string
}

/**
 * 导出查询条件请求对象
 */
export interface RoleExportQueryForm extends ExportQueryForm, RoleQueryForm {}
