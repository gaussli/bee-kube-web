/**
 * Pod 亲和性相关实体类型定义
 * @module types/kubernetes/pod/affinity/types
 */

import type { LabelSelector } from '@/types/kubernetes/types'

import type { NodeExpressionOperator } from '@/config/kubernetes/pod'

/**
 * 节点选择器表达式
 */
export interface NodeExpression {
  /** 节点标签键 */
  key: string
  /** 匹配运算符 */
  operator: NodeExpressionOperator
  /** 匹配值列表，operator 为 Exists / DoesNotExist 时不生效 */
  values?: string[]
}

/**
 * 节点亲和性匹配条件
 */
export interface NodeAffinityTerm {
  /** 节点标签匹配表达式列表 */
  matchExpressions?: NodeExpression[]
}

/**
 * 带权重的节点亲和性匹配条件
 * @extends NodeAffinityTerm 继承节点标签匹配表达式列表
 */
export interface WeightedNodeAffinityTerm extends NodeAffinityTerm {
  /** 权重，1~100，值越大优先级越高 */
  weight: number
}

/**
 * 节点亲和性
 */
export interface NodeAffinity {
  /** 必须满足的硬性调度条件，不满足则 Pod 无法调度 */
  required?: NodeAffinityTerm[]
  /** 优先满足的软性调度条件，尽量满足，非强制 */
  preferred?: WeightedNodeAffinityTerm[]
}

/**
 * Pod 亲和性/反亲和性调度条件
 */
export interface PodAffinityTerm {
  /** 通过标签选择目标 Pod 集合 */
  labelSelector?: LabelSelector
  /** 目标 Pod 所在命名空间列表，不填或空数组表示当前命名空间 */
  namespaces?: string[]
  /** 通过命名空间标签选择目标命名空间 */
  namespaceSelector?: LabelSelector
  /** 拓扑域键，如 kubernetes.io/hostname 表示节点级别，failure-domain.beta.kubernetes.io/zone 表示可用区级别 */
  topologyKey: string
  /** 需匹配的标签键列表 */
  matchLabelKeys?: string[]
  /** 需排除匹配的标签键列表 */
  mismatchLabelKeys?: string[]
}

/**
 * 带权重的 Pod 亲和性调度条件
 * @extends PodAffinityTerm 继承 Pod 亲和性/反亲和性调度条件
 */
export interface WeightedPodAffinityTerm extends PodAffinityTerm {
  /** 权重，1~100 */
  weight: number
}

/**
 * Pod 亲和性
 */
export interface PodAffinity {
  /** 必须满足的硬性亲和要求 */
  required?: PodAffinityTerm[]
  /** 优先满足的软性亲和要求 */
  preferred?: WeightedPodAffinityTerm[]
}

/**
 * Pod 反亲和性
 */
export interface PodAntiAffinity {
  /** 必须满足的硬性反亲和要求 */
  required?: PodAffinityTerm[]
  /** 优先满足的软性反亲和要求 */
  preferred?: WeightedPodAffinityTerm[]
}

/**
 * 亲和性配置
 */
export interface Affinity {
  /** 节点亲和性 */
  nodeAffinity?: NodeAffinity
  /** Pod 亲和性 */
  podAffinity?: PodAffinity
  /** Pod 反亲和性 */
  podAntiAffinity?: PodAntiAffinity
}
