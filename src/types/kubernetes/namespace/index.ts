/**
 * Namespace 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/namespace/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { NamespaceStatus } from '@/config/kubernetes/namespace'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../common'
import type { Clustered, ObjectMeta } from '../types'

import type { NamespaceSpec, NamespaceStatusObj } from './types'

/**
 * Namespace 查询条件请求对象
 */
export interface NamespaceQueryForm extends UidEntity, PageForm {
  /** Namespace 名称 */
  name: string
  /** Namespace 状态 */
  status: NamespaceStatus
  /** 查询模式 */
  mode: 'Default' | 'Simple'
}

/**
 * Namespace 列表项响应对象
 */
export interface NamespaceListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** Namespace 名称 */
  name: string
  /** Namespace 描述 */
  description?: string
  /** Namespace 状态 */
  status: NamespaceStatus
  /** Namespace 状态信息 */
  statusMsg?: string
}

/**
 * Namespace 简要列表项响应对象
 */
export interface NamespaceSimpleListVo extends UidEntity {
  /** Namespace 名称 */
  name: string
  /** Namespace 描述 */
  description?: string
}

/**
 * Namespace 详情响应对象
 */
export interface NamespaceDetailVo extends UidEntity, Clustered, AuditEntity, DeletableEntity, ObjectMeta {
  /** Namespace 描述 */
  description?: string
  /** Namespace 状态 */
  status: string
  /** Namespace 状态信息 */
  statusMsg?: string
  /** Namespace Spec */
  spec: NamespaceSpec
  /** Namespace Status */
  statusObj: NamespaceStatusObj
}

/**
 * Namespace YAML 响应对象
 */
export interface NamespaceYamlVo {
  /** Namespace 完整 YAML 文本 */
  yaml: string
}

/**
 * Namespace 监控查询请求对象
 */
export interface NamespaceMonitorQueryForm {}

/**
 * Namespace 监控响应对象
 */
export interface NamespaceMonitorVo {}

/**
 * Namespace 创建请求对象
 */
export interface NamespaceCreateForm extends ObjectMetaCreatableForm {
  /** Namespace 描述 */
  description: string
}

/**
 * Namespace 更新请求对象
 */
export interface NamespaceUpdateForm extends ObjectMetaEditableForm {
  /** Namespace 描述 */
  description: string
}

/**
 * 命名空间（Namespace）导出请求对象
 */
export interface NamespaceExportQueryForm extends ExportQueryForm, NamespaceQueryForm {}
