/**
 * Namespace 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/namespace/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { Clustered, ObjectMeta } from '../types'

import type { NamespaceSpec, NamespaceStatusObj } from './types'

/**
 * 命名空间查询条件请求对象
 */
export interface NamespaceQueryForm extends UidEntity, PageForm {
  /** 命名空间名称（支持模糊搜索） */
  name: string
  /** 状态 */
  status: string
  /** 是否仅返回简要列表 */
  simple: boolean
}

/**
 * 命名空间列表项响应对象
 */
export interface NamespaceListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** 命名空间名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: string
  /** 状态描述信息 */
  statusMsg?: string
}

/**
 * 命名空间简要列表项响应对象
 */
export interface NamespaceSimpleListVo extends UidEntity {
  /** 命名空间名称 */
  name: string
  /** 描述信息 */
  description?: string
}

/**
 * 命名空间详情响应对象
 * 组合多个子对象，提供完整详情信息
 */
export interface NamespaceDetailVo extends UidEntity, Clustered, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: string
  /** 状态描述信息 */
  statusMsg?: string
  spec: NamespaceSpec
  statusObj: NamespaceStatusObj
}

/** 命名空间 YAML 响应对象 */
export interface NamespaceYamlVo {
  /** 命名空间的完整 YAML 文本 */
  yaml: string
}

/**
 * 命名空间监控响应对象
 */
export interface NamespaceMonitorVo {}

/** 命名空间创建请求对象 */
export interface NamespaceCreateForm {
  description?: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
}

/** 命名空间更新请求对象 */
export interface NamespaceUpdateForm {
  description?: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
}
