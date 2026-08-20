/**
 * Secret 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/config/secret/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { SecretType } from '@/config/kubernetes/config/secret'

import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { Secret } from './types'

/**
 * Secret 查询条件请求对象
 */
export interface ConfigMapQueryForm extends UidEntity, PageForm {
  /** Secret 名称（模糊匹配） */
  name: string
  /** 命名空间名称 */
  namespace: string
  type: SecretType
}

/**
 * Secret 列表项响应对象
 */
export interface ConfigMapListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** Secret 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 配置项数量 */
  dataCount?: number
  type: SecretType
}

/**
 * Secret 详情响应对象
 */
export interface ConfigMapDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta, Secret {
  /** 描述信息 */
  description?: string
}

/** Secret YAML 响应对象 */
export interface ConfigMapYamlVo {
  /** Secret 完整 YAML 文本 */
  yaml: string
}

/** Secret 创建请求对象 */
export interface ConfigMapCreateForm extends Secret {
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
}

/** Secret 更新请求对象 */
export interface ConfigMapUpdateForm extends Secret {
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
}
