/**
 * 命名空间资源配额（ResourceQuota）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/namespace/resourcequota/index
 */

import type { AuditEntity, DeletableEntity, UidEntity } from '@/types/index'
import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '@/types/kubernetes/index'
import type { Clustered, Namespaced, ObjectMeta } from '@/types/kubernetes/types'

import type { ResourceQuotaSpec, ResourceQuotaStatusObj } from './types'

/**
 * 详情响应对象
 */
export interface NamespaceResourceQuotaDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** ResourceQuota 资源配额规格 */
  spec: ResourceQuotaSpec
  /** 名称 */
  status: ResourceQuotaStatusObj
}

/**
 * YAML 响应对象
 */
export interface NamespaceResourceQuotaYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface NamespaceResourceQuotaCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
  /** ResourceQuota 资源配额规格 */
  spec: ResourceQuotaSpec
}

/**
 * 更新请求对象
 */
export interface NamespaceResourceQuotaUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
  /** ResourceQuota 资源配额规格 */
  spec: ResourceQuotaSpec
}
