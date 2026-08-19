/**
 * Kubernetes 命名空间管理常量配置
 * @module config/kubernetes/namespace
 */

import type { ResourcePageMeta, Option } from '@/config/kubernetes/common'

import { COLOR_PRIMARY, COLOR_SUCCESS } from '@/config/color'

/** 命名空间页面元数据 */
export const NAMESPACE_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-namespace',
  title: '命名空间管理',
  description:
    '命名空间（Namespace）是 Kubernetes 集群中用于资源隔离的虚拟集群，可以将集群划分为多个独立的工作空间，实现项目、团队或环境之间的资源隔离和管理。',
}

/** 命名空间状态原始数据（不含"所有状态"选项，用于派生类型） */
const _namespaceStatuses = [
  { value: 'Active', label: '活跃', labelEn: 'Active', color: COLOR_SUCCESS },
  { value: 'Terminating', label: '终止中', labelEn: 'Terminating', color: COLOR_PRIMARY },
] as const

/** 命名空间状态类型 */
export type NamespaceStatuses = (typeof _namespaceStatuses)[number]['value']

/** 命名空间状态配置选项（含"所有状态"） */
export const NAMESPACE_STATUS_OPTIONS: Option[] = [
  { value: undefined, label: '所有状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  ..._namespaceStatuses,
]

/** 命名空间生命周期阶段 */
export const _namespacePhases = [
  { value: 'Active', label: '活跃' },
  { value: 'Terminating', label: '终止中' },
] as const

/** 命名空间生命周期阶段类型 */
export type NamespacePhase = (typeof _namespacePhases)[number]['value']

/** 命名空间终结器名称 */
export const _finalizerNames = ['kubernetes'] as const

/** 命名空间终结器名称类型 */
export type FinalizerName = (typeof _finalizerNames)[number]

/** 命名空间条件类型（原生 K8s 条件类型） */
export const _namespaceConditionTypes = [
  { value: 'NamespaceDeletionDiscoveryFailure', label: '资源发现失败' },
  { value: 'NamespaceDeletionContentFailure', label: '内容删除失败' },
  { value: 'NamespaceDeletionGroupVersionParsingFailure', label: 'GroupVersion 解析失败' },
  { value: 'NamespaceContentRemaining', label: '仍有残留内容' },
  { value: 'NamespaceFinalizersRemaining', label: '仍有 finalizer 未清空' },
] as const

/** 命名空间条件类型 */
export type NamespaceConditionType = (typeof _namespaceConditionTypes)[number]['value']
