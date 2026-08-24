/**
 * ConfigMap 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/config/configmap/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { ConfigMap } from './types'

/**
 * ConfigMap 查询条件请求对象
 */
export interface ConfigMapQueryForm extends UidEntity, PageForm {
  /** ConfigMap 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
}

/**
 * ConfigMap 列表项响应对象
 */
export interface ConfigMapListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** ConfigMap 名称 */
  name: string
  /** ConfigMap 描述 */
  description?: string
  /** 配置项数量 */
  dataCount: number
}

/**
 * ConfigMap 详情响应对象
 */
export interface ConfigMapDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta, ConfigMap {
  /** ConfigMap 描述 */
  description?: string
}

/**
 * ConfigMap YAML 响应对象
 */
export interface ConfigMapYamlVo {
  /** ConfigMap 完整 YAML 文本 */
  yaml: string
}

/**
 * ConfigMap 创建请求对象
 */
export interface ConfigMapCreateForm extends ObjectMetaCreatableForm, ConfigMap {
  /** ConfigMap 描述信息 */
  description: string
}

/**
 * ConfigMap 更新请求对象
 */
export interface ConfigMapUpdateForm extends ObjectMetaEditableForm, ConfigMap {
  /** ConfigMap 描述 */
  description: string
}
