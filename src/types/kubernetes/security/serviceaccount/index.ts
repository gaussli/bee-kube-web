/**
 * 服务帐号（ServiceAccount）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/security/serviceaccount/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { ServiceAccount } from './types'

/**
 * 查询条件请求对象
 */
export interface ServiceAccountQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
}

/**
 * 列表项响应对象
 */
export interface ServiceAccountListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 关联的 Secret 数量 */
  secretCount: number
  /** 是否自动挂载 Token */
  automountServiceAccountToken: boolean
}

/**
 * 详情响应对象
 */
export interface ServiceAccountDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta, ServiceAccount {
  /** 描述 */
  description?: string
}

/**
 * YAML 响应对象
 */
export interface ServiceAccountYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface ServiceAccountCreateForm extends ObjectMetaCreatableForm, ServiceAccount {
  /** 描述 */
  description?: string
}

/**
 * 更新请求对象
 */
export interface ServiceAccountUpdateForm extends ObjectMetaEditableForm, ServiceAccount {
  /** 描述 */
  description?: string
}

/**
 * 导出查询条件请求对象
 */
export interface ServiceAccountExportQueryForm extends ExportQueryForm, ServiceAccountQueryForm {}
