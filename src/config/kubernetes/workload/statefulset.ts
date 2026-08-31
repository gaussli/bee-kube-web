import type { Option, ResourcePageMeta } from '..'

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_PRIMARY, COLOR_SUCCESS } from '@/config/color'

/** StatefulSet 列表页面功能元数据 */
export const STATEFULSET_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-statefulset',
  title: '有状态应用',
  description:
    '有状态应用（StatefulSet）是 Kubernetes 中用于管理有状态工作负载的控制器，为每个 Pod 提供稳定的网络标识和持久存储。',
}

/** StatefulSet 状态原始数据（用于派生类型） */
const _statefulsetStatuses = [
  { value: 'Running', label: '运行中', labelEn: 'Running', color: COLOR_SUCCESS },
  { value: 'Available', label: '部分就绪', labelEn: 'Available', color: COLOR_SUCCESS },
  { value: 'Stopped', label: '已停止', labelEn: 'Stopped', color: COLOR_GRAY_70 },
  { value: 'Creating', label: '创建中', labelEn: 'Creating', color: COLOR_PRIMARY },
  { value: 'Updating', label: '更新中', labelEn: 'Updating', color: COLOR_PRIMARY },
  { value: 'Paused', label: '更新暂停', labelEn: 'Paused', color: COLOR_GRAY_70 },
  { value: 'Terminating', label: '终止中', labelEn: 'Terminating', color: COLOR_PRIMARY },
  { value: 'CreateTimeout', label: '创建超时', labelEn: 'CreateTimeout', color: COLOR_DANGER },
  { value: 'UpdateTimeout', label: '更新超时', labelEn: 'UpdateTimeout', color: COLOR_DANGER },
  { value: 'Failed', label: '失败异常', labelEn: 'Failed', color: COLOR_DANGER },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 },
] as const

/** StatefulSet 状态类型 */
export type StatefulSetStatus = (typeof _statefulsetStatuses)[number]['value']

/** StatefulSet 状态配置选项 */
export const STATEFULSET_STATUS_OPTIONS: Option[] = [
  { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  ..._statefulsetStatuses,
]

/** StatefulSet 更新策略原始数据（用于派生类型） */
const _statefulsetUpdateStrategyTypes = [
  { value: 'RollingUpdate', label: '滚动更新' },
  { value: 'OnDelete', label: '删除时更新' },
] as const

/** StatefulSet 更新策略类型 */
export type StatefulSetUpdateStrategyType = (typeof _statefulsetUpdateStrategyTypes)[number]['value']

/** StatefulSet 更新策略配置选项 */
export const STATEFULSET_UPDATE_STRATEGY_OPTIONS: Option[] = [..._statefulsetUpdateStrategyTypes]

/** Pod 管理策略原始数据（用于派生类型） */
const _podManagementPolicies = [
  { value: 'OrderedReady', label: '按序就绪' },
  { value: 'Parallel', label: '并行管理' },
] as const

/** Pod 管理策略 */
export type PodManagementPolicyType = (typeof _podManagementPolicies)[number]['value']

/** Pod 管理策略配置选项 */
export const POD_MANAGEMENT_POLICY_OPTIONS: Option[] = [..._podManagementPolicies]

/** StatefulSet 条件类型原始数据（用于派生类型） */
const _statefulsetConditionTypes = [
  { value: 'Available', label: '可用' },
  { value: 'Progressing', label: '处理中' },
  { value: 'ReplicaFailure', label: '副本失败' },
] as const

/** StatefulSet 条件类型 */
export type StatefulSetConditionType = (typeof _statefulsetConditionTypes)[number]['value']
