/**
 * Namespace ResourceQuota 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/namespace/resourcequota/index
 */

import type { AuditEntity, DeletableEntity, UidEntity } from '@/types/common'

import type { ResourceQuotaSpec, ResourceQuotaStatusObj } from './types'

export interface NamespaceResourceQuotaDetailVo extends UidEntity, AuditEntity, DeletableEntity {
  description?: string
  spec: ResourceQuotaSpec
  status: ResourceQuotaStatusObj
}

export interface NamespaceResourceQuotaYamlVo {
  yaml: string
}

export interface NamespaceResourceQuotaCreateForm {
  description?: string
  spec: ResourceQuotaSpec
}

export interface NamespaceResourceQuotaUpdateForm {
  description?: string
  spec: ResourceQuotaSpec
}
