/**
 * 网络策略（NetworkPolicy）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/network/networkpolicy/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { PolicyType } from '@/config/kubernetes/network/networkpolicy'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { NetworkPolicySpec } from './types'

/**
 * 查询条件请求对象
 */
export interface NetworkPolicyQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
}

/**
 * 列表项响应对象
 */
export interface NetworkPolicyListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
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
 * 详情响应对象
 */
export interface NetworkPolicyDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** Spec */
  spec: NetworkPolicySpec
}

/**
 * YAML 响应对象
 */
export interface NetworkPolicyYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface NetworkPolicyCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: NetworkPolicySpec
}

/**
 * 更新请求对象
 */
export interface NetworkPolicyUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: NetworkPolicySpec
}

/**
 * 导出查询条件请求对象
 */
export interface NetworkPolicyExportQueryForm extends ExportQueryForm, NetworkPolicyQueryForm {}
