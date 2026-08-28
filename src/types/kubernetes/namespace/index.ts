/**
 * 命名空间（Namespace）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/namespace/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { NamespaceStatus } from '@/config/kubernetes/namespace'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../common'
import type { Clustered, ObjectMeta } from '../types'

import type { NamespaceSpec, NamespaceStatusObj } from './types'

export type NamespaceQueryMode = 'Default' | 'Simple'

/**
 * 查询条件请求对象
 */
export interface NamespaceQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** 状态 */
  status: NamespaceStatus
  /** 查询模式 */
  mode: NamespaceQueryMode
}

/**
 * 列表项响应对象
 */
export interface NamespaceListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: NamespaceStatus
  /** 状态信息 */
  statusMsg?: string
}

/**
 * 简要列表项响应对象
 */
export interface NamespaceSimpleListVo extends UidEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
}

/**
 * 详情响应对象
 */
export interface NamespaceDetailVo extends UidEntity, Clustered, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** 状态 */
  status: string
  /** 状态信息 */
  statusMsg?: string
  /** Spec */
  spec: NamespaceSpec
  /** Status */
  statusObj: NamespaceStatusObj
}

/**
 * YAML 响应对象
 */
export interface NamespaceYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 监控查询请求对象
 */
export interface NamespaceMonitorQueryForm {}

/**
 * 监控响应对象
 */
export interface NamespaceMonitorVo {}

/**
 * 创建请求对象
 */
export interface NamespaceCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
}

/**
 * 更新请求对象
 */
export interface NamespaceUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
}

/**
 * 导出查询条件请求对象
 */
export interface NamespaceExportQueryForm extends ExportQueryForm, NamespaceQueryForm {}
