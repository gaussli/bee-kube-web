/**
 * 自定义资源定义（CustomResourceDefinition）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/config/secret/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../common'
import type { Clustered, ObjectMeta } from '../types'

/**
 * 查询条件请求对象
 */
export interface CustomResourceDefinitionQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
}

/**
 * 列表项响应对象
 */
export interface CustomResourceDefinitionListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
}

/**
 * 详情响应对象
 */
export interface CustomResourceDefinitionDetailVo
  extends UidEntity, Clustered, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
}

/**
 * YAML 响应对象
 */
export interface CustomResourceDefinitionYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface CustomResourceDefinitionCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
}

/**
 * 更新请求对象
 */
export interface CustomResourceDefinitionUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
}

/**
 * 导出查询条件请求对象
 */
export interface CustomResourceDefinitionExportQueryForm extends ExportQueryForm, CustomResourceDefinitionQueryForm {}
