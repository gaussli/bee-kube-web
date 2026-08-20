/**
 * NetworkPolicy 资源实体类型定义
 * @module types/kubernetes/network/networkpolicy/types
 */

import type { Protocol } from '@/config/kubernetes/core'
import type { PolicyType } from '@/config/kubernetes/network/networkpolicy'

import type { LabelSelector } from '../../types'

/**
 * NetworkPolicy 规格定义
 */
export interface NetworkPolicySpec {
  /** 选择应用该策略的 Pod；空选择器匹配策略命名空间内所有 Pod */
  podSelector: LabelSelector
  /** 入站规则列表；为空时该策略不允许任何入站流量（默认隔离） */
  ingress?: NetworkPolicyIngressRule[]
  /** 出站规则列表；为空时限制所有出站流量 */
  egress?: NetworkPolicyEgressRule[]
  /** 策略类型列表，如 ['Ingress'] / ['Egress'] / ['Ingress','Egress']；未指定时根据 ingress/egress 规则自动推断 */
  policyTypes?: PolicyType[]
}

/**
 * NetworkPolicy 入站规则
 */
export interface NetworkPolicyIngressRule {
  /** 允许的端口列表，逻辑 OR；为空则匹配所有端口 */
  ports?: NetworkPolicyPort[]
  /** 允许的流量来源，逻辑 OR；为空则匹配所有来源 */
  from?: NetworkPolicyPeer[]
}

/**
 * NetworkPolicy 出站规则
 */
export interface NetworkPolicyEgressRule {
  /** 允许的目标端口列表，逻辑 OR；为空则匹配所有端口 */
  ports?: NetworkPolicyPort[]
  /** 允许的流量目标，逻辑 OR；为空则匹配所有目标 */
  to?: NetworkPolicyPeer[]
}

/**
 * NetworkPolicy 允许的端口
 */
export interface NetworkPolicyPort {
  /** 协议，'TCP' / 'UDP' / 'SCTP'，默认 'TCP' */
  protocol?: Protocol
  /** 端口，可为数字或命名端口；不提供则匹配所有端口 */
  port?: number | string
  /** 端口范围上限（含）；仅当 port 为数字时可用，且须 ≥ port */
  endPort?: number
}

/**
 * NetworkPolicy 对端
 */
export interface NetworkPolicyPeer {
  /** 选择 Pod；与 namespaceSelector 同时设置时选择指定命名空间内匹配的 Pod */
  podSelector?: LabelSelector
  /** 基于集群范围标签选择命名空间；与 podSelector 同时设置时选择匹配命名空间内匹配的 Pod */
  namespaceSelector?: LabelSelector
  /** 基于 IPBlock 的策略；设置后其他字段不可同时设置 */
  ipBlock?: IPBlock
}

/**
 * IPBlock 描述允许/排除的 CIDR 网段
 */
export interface IPBlock {
  /** IPBlock CIDR 网段，如 '192.168.1.0/24' 或 '2001:db8::/64' */
  cidr: string
  /** 不应包含的 CIDR 列表；若在 cidr 范围内则会被拒绝 */
  except?: string[]
}
