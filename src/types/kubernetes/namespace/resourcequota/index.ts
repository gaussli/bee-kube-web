/**
 * Namespace ResourceQuota 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/namespace/resourcequota/index
 */

import type { AuditEntity, DeletableEntity, UidEntity } from '@/types/common'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'

import type { ResourceQuotaSpec, ResourceQuotaStatusObj } from './types'

/**
 * Namespace ResourceQuota 详情视图对象
 */
export interface NamespaceResourceQuotaDetailVo extends UidEntity, AuditEntity, DeletableEntity {
  /** 描述信息 */
  description?: string
  /** ResourceQuota 资源配额规格 */
  spec: ResourceQuotaSpec
  /** ResourceQuota 资源配额使用状态 */
  status: ResourceQuotaStatusObj
}

/**
 * Namespace ResourceQuota YAML 响应对象
 */
export interface NamespaceResourceQuotaYamlVo {
  /** ResourceQuota 完整 YAML 文本 */
  yaml: string
}

/**
 * Namespace ResourceQuota 创建请求对象
 */
export interface NamespaceResourceQuotaCreateForm extends ObjectMetaCreatableForm {
  /** 描述信息 */
  description: string
  /** ResourceQuota 资源配额规格 */
  spec: ResourceQuotaSpec
}

/**
 * Namespace ResourceQuota 更新请求对象
 */
export interface NamespaceResourceQuotaUpdateForm extends ObjectMetaEditableForm {
  /** 描述信息 */
  description: string
  /** ResourceQuota 资源配额规格 */
  spec: ResourceQuotaSpec
}
