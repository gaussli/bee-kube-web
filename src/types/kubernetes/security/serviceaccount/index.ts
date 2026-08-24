/**
 * ServiceAccount 页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/security/serviceaccount/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { Clustered, Namespaced, ObjectMeta } from '../../types'
import type { ServiceAccount } from './types'

/**
 * ServiceAccount 查询条件请求对象
 */
export interface ServiceAccountQueryForm extends UidEntity, PageForm {
  /** ServiceAccount 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
}

/**
 * ServiceAccount 列表项响应对象
 */
export interface ServiceAccountListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** ServiceAccount 名称 */
  name: string
  /** ServiceAccount 描述 */
  description?: string
  /** 关联的 Secret 数量 */
  secretCount: number
  /** 是否自动挂载 Token */
  automountServiceAccountToken?: boolean
}

/**
 * ServiceAccount 详情响应对象
 */
export interface ServiceAccountDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** ServiceAccount 描述 */
  description?: string
  /** 关联的 Secret 列表 */
  secrets?: ServiceAccount['secrets']
  /** 镜像拉取 Secret 列表 */
  imagePullSecrets?: ServiceAccount['imagePullSecrets']
  /** 是否自动挂载 Token */
  automountServiceAccountToken?: boolean
}

/**
 * ServiceAccount YAML 响应对象
 */
export interface ServiceAccountYamlVo {
  /** ServiceAccount 完整 YAML 文本 */
  yaml: string
}

/**
 * ServiceAccount 创建请求对象
 */
export interface ServiceAccountCreateForm {
  /** ServiceAccount 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** ServiceAccount 描述 */
  description?: string
  /** 镜像拉取 Secret 名称列表 */
  imagePullSecretNames?: string[]
  /** 是否自动挂载 Token */
  automountServiceAccountToken?: boolean
}

/**
 * ServiceAccount 更新请求对象
 */
export interface ServiceAccountUpdateForm {
  /** ServiceAccount 描述 */
  description?: string
  /** 镜像拉取 Secret 名称列表 */
  imagePullSecretNames?: string[]
  /** 是否自动挂载 Token */
  automountServiceAccountToken?: boolean
}
