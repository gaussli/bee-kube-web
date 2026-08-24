/**
 * ServiceAccount 页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/security/serviceaccount/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { ServiceAccount } from './types'

/**
 * ServiceAccount 查询条件请求对象
 */
export interface ServiceAccountQueryForm extends UidEntity, PageForm {
  /** ServiceAccount 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
}

/**
 * ServiceAccount 列表项响应对象
 */
export interface ServiceAccountListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** ServiceAccount 名称 */
  name: string
  /** ServiceAccount 描述 */
  description?: string
  /** 关联的 Secret 数量 */
  secretCount: number
  /** 是否自动挂载 Token */
  automountServiceAccountToken: boolean
}

/**
 * ServiceAccount 详情响应对象
 */
export interface ServiceAccountDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta, ServiceAccount {
  /** ServiceAccount 描述 */
  description?: string
}

/**
 * ServiceAccount YAML 响应对象
 */
export interface ServiceAccountYamlVo {
  /** ServiceAccount 完整 YAML 文本 */
  yaml: string
}

/**
 * ServiceAccount 创建请求对象
 */
export interface ServiceAccountCreateForm extends ObjectMetaCreatableForm, ServiceAccount {
  /** ServiceAccount 描述 */
  description?: string
}

/**
 * ServiceAccount 更新请求对象
 */
export interface ServiceAccountUpdateForm extends ObjectMetaEditableForm, ServiceAccount {
  /** ServiceAccount 描述 */
  description: string
}
