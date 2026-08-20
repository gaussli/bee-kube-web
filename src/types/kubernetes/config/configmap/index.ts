/**
 * ConfigMap 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/config/configmap/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { ConfigMap } from './types'

/**
 * ConfigMap 查询条件请求对象
 */
export interface ConfigMapQueryForm extends UidEntity, PageForm {
  /** ConfigMap 名称（模糊匹配） */
  name: string
  /** 命名空间名称 */
  namespace: string
}

/**
 * ConfigMap 列表项响应对象
 */
export interface ConfigMapListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** ConfigMap 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 配置项数量 */
  dataCount?: number
}

/**
 * ConfigMap 详情响应对象
 */
export interface ConfigMapDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta, ConfigMap {
  /** 描述信息 */
  description?: string
}

/** ConfigMap YAML 响应对象 */
export interface ConfigMapYamlVo {
  /** ConfigMap 完整 YAML 文本 */
  yaml: string
}

/** ConfigMap 创建请求对象 */
export interface ConfigMapCreateForm extends ConfigMap {
  /** 描述信息 */
  description?: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
}

/** ConfigMap 更新请求对象 */
export interface ConfigMapUpdateForm extends ConfigMap {
  /** 描述信息 */
  description?: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
}
