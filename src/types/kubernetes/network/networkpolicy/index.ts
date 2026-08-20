/**
 * NetworkPolicy 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/network/networkpolicy/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { PolicyType } from '@/config/kubernetes/network/networkpolicy'

import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { NetworkPolicySpec } from './types'

/**
 * NetworkPolicy 查询条件请求对象
 */
export interface NetworkPolicyQueryForm extends UidEntity, PageForm {
  /** NetworkPolicy 名称（模糊匹配） */
  name?: string
}

/**
 * NetworkPolicy 列表项响应对象
 */
export interface NetworkPolicyListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** NetworkPolicy 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** Pod 数量 */
  podCount: number
  /** 策略类型列表 */
  policyTypes?: PolicyType[]
  ingressCount: number
  egressCount: number
}

export interface NetworkPolicyDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述信息 */
  description: string
  spec: NetworkPolicySpec
}

/** NetworkPolicy YAML 响应对象 */
export interface NetworkPolicyYamlVo {
  /** NetworkPolicy 完整 YAML 文本 */
  yaml: string
}

/** NetworkPolicy 创建请求对象 */
export interface NetworkPolicyCreateForm {
  /** 描述信息 */
  description: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
  spec: NetworkPolicySpec
}

/** NetworkPolicy 更新请求对象 */
export interface NetworkPolicyUpdateForm {
  /** 描述信息 */
  description: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
  spec: NetworkPolicySpec
}
