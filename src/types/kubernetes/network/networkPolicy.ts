/**
 * NetworkPolicy 资源类型定义
 * @module types/kubernetes/networkPolicy
 */
import type { BaseEntity, PageReq } from '@/types/common'

/**
 * IP 块配置
 */
export interface NetworkPolicyIPBlock {
  /** 允许的 CIDR */
  cidr: string
  /** 例外的 CIDR 列表 */
  except?: string[]
}

/**
 * 网络策略入口
 */
export interface NetworkPolicyIngressRule {
  /** 来源端口列表 */
  ports?: Array<{
    protocol: string
    port: number | string
  }>
  /** 来源类型 */
  from?: Array<
    | { kind: 'NamespaceSelector'; namespaceSelector?: Record<string, string>; matchLabels?: Record<string, string> }
    | { kind: 'PodSelector'; podSelector?: Record<string, string>; namespaceSelector?: Record<string, string> }
    | { kind: 'IPBlock'; ipBlock: NetworkPolicyIPBlock }
  >
}

/**
 * 网络策略出口
 */
export interface NetworkPolicyEgressRule {
  /** 目标端口列表 */
  ports?: Array<{
    protocol: string
    port: number | string
  }>
  /** 目标类型 */
  to?: Array<
    | { kind: 'NamespaceSelector'; namespaceSelector?: Record<string, string>; matchLabels?: Record<string, string> }
    | { kind: 'PodSelector'; podSelector?: Record<string, string>; namespaceSelector?: Record<string, string> }
    | { kind: 'IPBlock'; ipBlock: NetworkPolicyIPBlock }
  >
}

/**
 * NetworkPolicy 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface NetworkPolicyResp extends BaseEntity {
  /** NetworkPolicy 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName?: string
  /** Pod 选择器 */
  podSelector: Record<string, string>
  /** 入方向规则列表 */
  ingress?: NetworkPolicyIngressRule[]
  /** 出方向规则列表 */
  egress?: NetworkPolicyEgressRule[]
  /** 策略类型列表 */
  policyTypes?: string[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * NetworkPolicy 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface NetworkPolicyQueryReq extends PageReq {
  /** NetworkPolicy 名称（模糊匹配） */
  name?: string
  /** 标签选择器 */
  labelSelector?: string
}

/**
 * NetworkPolicy 创建/更新请求参数
 */
export interface NetworkPolicyReq {
  /** NetworkPolicy 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** Pod 选择器 */
  podSelector: Record<string, string>
  /** 入方向规则列表 */
  ingress?: NetworkPolicyIngressRule[]
  /** 出方向规则列表 */
  egress?: NetworkPolicyEgressRule[]
  /** 策略类型列表 */
  policyTypes?: ('Ingress' | 'Egress')[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * NetworkPolicy 标签更新请求
 */
export interface NetworkPolicyLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * NetworkPolicy 注解更新请求
 */
export interface NetworkPolicyAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}
