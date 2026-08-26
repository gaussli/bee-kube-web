/**
 * 密钥（Secret）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/config/secret/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { SecretType } from '@/config/kubernetes/config/secret'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { Secret } from './types'

/**
 * 查询条件请求对象
 */
export interface SecretQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** Secret 类型 */
  type: SecretType
}

/**
 * 列表项响应对象
 */
export interface SecretListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** Secret 类型 */
  type: SecretType
  /** 配置项数量 */
  dataCount: number
}

/**
 * 详情响应对象
 */
export interface SecretDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta, Secret {
  /** 描述 */
  description?: string
}

/**
 * YAML 响应对象
 */
export interface SecretYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface SecretCreateForm extends ObjectMetaCreatableForm, Secret {
  /** 描述 */
  description?: string
}

/**
 * 更新请求对象
 */
export interface SecretUpdateForm extends ObjectMetaEditableForm, Secret {
  /** 描述 */
  description?: string
}

/**
 * 导出查询条件请求对象
 */
export interface SecretExportQueryForm extends ExportQueryForm, SecretQueryForm {}
