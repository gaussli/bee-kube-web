/**
 * 配置映射（ConfigMap）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/config/configmap/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/index'
import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '@/types/kubernetes/index'
import type { Clustered, Namespaced, ObjectMeta } from '@/types/kubernetes/types'

import type { ConfigMap } from './types'

/**
 * 查询条件请求对象
 */
export interface ConfigMapQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
}

/**
 * 列表项响应对象
 */
export interface ConfigMapListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 配置项数量 */
  dataCount: number
}

/**
 * 详情响应对象
 */
export interface ConfigMapDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta, ConfigMap {
  /** 描述 */
  description?: string
}

/**
 * YAML 响应对象
 */
export interface ConfigMapYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface ConfigMapCreateForm extends ObjectMetaCreatableForm, ConfigMap {
  /** 描述 */
  description?: string
}

/**
 * 更新请求对象
 */
export interface ConfigMapUpdateForm extends ObjectMetaEditableForm, ConfigMap {
  /** 描述 */
  description?: string
}

/**
 * 导出查询条件请求对象
 */
export interface ConfigMapExportQueryForm extends ExportQueryForm, ConfigMapQueryForm {}
