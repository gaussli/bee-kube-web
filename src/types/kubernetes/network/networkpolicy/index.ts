/**
 * NetworkPolicy 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/network/networkpolicy/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { PolicyType } from '@/config/kubernetes/network/networkpolicy'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { NetworkPolicySpec } from './types'

/**
 * NetworkPolicy 查询条件请求对象
 */
export interface NetworkPolicyQueryForm extends UidEntity, PageForm {
  /** NetworkPolicy 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
}

/**
 * NetworkPolicy 列表项响应对象
 */
export interface NetworkPolicyListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** NetworkPolicy 名称 */
  name: string
  /** NetworkPolicy 描述 */
  description?: string
  /** 受策略影响的 Pod 数量 */
  podCount: number
  /** 生效的策略类型 */
  policyTypes?: PolicyType[]
  /** Ingress 规则数量 */
  ingressCount: number
  /** Egress 规则数量 */
  egressCount: number
}

/**
 * NetworkPolicy 详情视图对象
 */
export interface NetworkPolicyDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** NetworkPolicy 描述 */
  description?: string
  /** NetworkPolicy Spec */
  spec: NetworkPolicySpec
}

/**
 * NetworkPolicy YAML 响应对象
 */
export interface NetworkPolicyYamlVo {
  /** NetworkPolicy 完整 YAML 文本 */
  yaml: string
}

/**
 * NetworkPolicy 创建请求对象
 */
export interface NetworkPolicyCreateForm extends ObjectMetaCreatableForm {
  /** NetworkPolicy 描述 */
  description?: string
  /** NetworkPolicy Spec */
  spec: NetworkPolicySpec
}

/**
 * NetworkPolicy 更新请求对象
 */
export interface NetworkPolicyUpdateForm extends ObjectMetaEditableForm {
  /** NetworkPolicy 描述 */
  description?: string
  /** NetworkPolicy Spec */
  spec: NetworkPolicySpec
}

/**
 * NetworkPolicy 导出查询条件请求对象
 */
export interface NetworkPolicyExportQueryForm extends ExportQueryForm, NetworkPolicyQueryForm {}
