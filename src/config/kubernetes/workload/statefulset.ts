/**
 * Kubernetes StatefulSet 工作负载常量配置
 * @module config/kubernetes/workload/statefulset
 */

import type { ResourcePageMeta, StatusOption } from '@/config/kubernetes/common'

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_PRIMARY, COLOR_SUCCESS } from '@/config/color'

/** StatefulSet 页面元数据 */
export const STATEFULSET_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-statefulset',
  title: '有状态应用',
  description:
    '有状态应用（StatefulSet）是 Kubernetes 中用于管理有状态工作负载的控制器，为每个 Pod 提供稳定的网络标识和持久存储。',
}

/** StatefulSet 状态原始数据（不含"全部"选项，用于派生类型） */
const _statefulsetStatuses = [
  { value: 'Running', label: '运行中', labelEn: 'Running', color: COLOR_SUCCESS },
  { value: 'Available', label: '部分就绪', labelEn: 'Available', color: COLOR_SUCCESS },
  { value: 'Stopped', label: '已停止', labelEn: 'Stopped', color: COLOR_GRAY_70 },
  { value: 'Creating', label: '创建中', labelEn: 'Creating', color: COLOR_PRIMARY },
  { value: 'Updating', label: '更新中', labelEn: 'Updating', color: COLOR_PRIMARY },
  { value: 'Terminating', label: '终止中', labelEn: 'Terminating', color: COLOR_PRIMARY },
  { value: 'CreateTimeout', label: '创建超时', labelEn: 'CreateTimeout', color: COLOR_DANGER },
  { value: 'UpdateTimeout', label: '更新超时', labelEn: 'UpdateTimeout', color: COLOR_DANGER },
  { value: 'Failed', label: '失败异常', labelEn: 'Failed', color: COLOR_DANGER },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 },
] as const

/** StatefulSet 状态类型 */
export type StatefulSetStatus = (typeof _statefulsetStatuses)[number]['value']

/** StatefulSet 状态配置选项 */
export const STATEFULSET_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  ..._statefulsetStatuses,
]

/** StatefulSet 条件类型映射 */
export const STATEFULSET_CONDITION_TYPE_MAP = {
  Available: '可用',
  Progressing: '处理中',
  ReplicaFailure: '副本失败',
} as const

/** StatefulSet 条件类型 */
export type StatefulSetConditionType = keyof typeof STATEFULSET_CONDITION_TYPE_MAP

/** StatefulSet 更新策略标签映射 */
export const STATEFULSET_UPDATE_STRATEGY_LABEL_MAP = {
  RollingUpdate: '滚动更新',
  OnDelete: '删除时更新',
} as const

/** StatefulSet 更新策略类型 */
export type StatefulSetUpdateStrategyType = keyof typeof STATEFULSET_UPDATE_STRATEGY_LABEL_MAP

/** StatefulSet Pod 管理策略中文映射 */
export const STATEFULSET_POD_MANAGEMENT_POLICY_MAP = {
  OrderedReady: '按序就绪',
  Parallel: '并行管理',
} as const

/** StatefulSet Pod 管理策略类型 */
export type PodManagementPolicyType = keyof typeof STATEFULSET_POD_MANAGEMENT_POLICY_MAP
