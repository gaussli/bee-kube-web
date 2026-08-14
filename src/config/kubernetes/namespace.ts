/**
 * Kubernetes 命名空间管理常量配置
 * @module config/kubernetes/namespace
 */

import type { ResourcePageMeta, StatusOption } from '@/config/kubernetes/common'

import { COLOR_PRIMARY, COLOR_SUCCESS } from '@/config/color'

/** 命名空间页面元数据 */
export const NAMESPACE_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-namespace',
  title: '命名空间管理',
  description:
    '命名空间（Namespace）是 Kubernetes 集群中用于资源隔离的虚拟集群，可以将集群划分为多个独立的工作空间，实现项目、团队或环境之间的资源隔离和管理。',
}

/** 命名空间状态原始数据（不含"全部"选项，用于派生类型） */
const _namespaceStatuses = [
  { value: 'Active', label: '活跃', labelEn: 'Active', color: COLOR_SUCCESS },
  { value: 'Terminating', label: '终止中', labelEn: 'Terminating', color: COLOR_PRIMARY },
] as const

/** 命名空间状态类型 */
export type NamespaceStatus = (typeof _namespaceStatuses)[number]['value']

/** 命名空间状态配置选项 */
export const NAMESPACE_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '所有状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  ..._namespaceStatuses,
]

/** 命名空间条件类型映射 */
export const NAMESPACE_CONDITION_TYPE_MAP = {
  NamespaceContentRemaining: '内容未清理完成',
  NamespaceDeletionDiscoveryFailure: '资源发现失败',
  NamespaceDeletionContentFailure: '内容删除失败',
  NamespaceFinalizersRemaining: '终结器未清理完成',
} as const

/** 命名空间条件类型 */
export type NamespaceConditionType = keyof typeof NAMESPACE_CONDITION_TYPE_MAP

/** 命名空间类型映射 */
export const NAMESPACE_TYPE_MAP = {
  0: '系统级',
  1: '用户级',
} as const

/** 命名空间类型 */
export type NamespaceType = keyof typeof NAMESPACE_TYPE_MAP
