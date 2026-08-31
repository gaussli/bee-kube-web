import type { Option, ResourcePageMeta } from '..'

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_PRIMARY, COLOR_SUCCESS } from '@/config/color'

/** DaemonSet 列表页面功能元数据 */
export const DAEMONSET_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-daemonset',
  title: '守护应用',
  description:
    '守护应用（DaemonSet）是 Kubernetes 中用于确保每个节点运行一个 Pod 副本的控制器，常用于日志采集、监控代理、存储驱动等节点级守护服务。',
}

/** DaemonSet 状态原始数据（用于派生类型） */
const _daemonsetStatuses = [
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

/** DaemonSet 状态类型 */
export type DaemonSetStatus = (typeof _daemonsetStatuses)[number]['value']

/** DaemonSet 状态配置选项 */
export const DAEMONSET_STATUS_OPTIONS: Option[] = [
  { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  ..._daemonsetStatuses,
]

/** DaemonSet 更新策略原始数据（用于派生类型） */
const _daemonsetUpdateStrategyTypes = [
  { value: 'RollingUpdate', label: '滚动更新' },
  { value: 'OnDelete', label: '删除时更新' },
] as const

/** DaemonSet 更新策略类型 */
export type DaemonSetUpdateStrategyType = (typeof _daemonsetUpdateStrategyTypes)[number]['value']

/** DaemonSet 更新策略配置选项 */
export const DAEMONSET_UPDATE_STRATEGY_OPTIONS: Option[] = [..._daemonsetUpdateStrategyTypes]

/** DaemonSet 条件类型原始数据（用于派生类型） */
const _daemonsetConditionTypes = [
  { value: 'Available', label: '可用' },
  { value: 'Progressing', label: '处理中' },
  { value: 'ReplicaFailure', label: '副本失败' },
  { value: 'Misconfigured', label: '配置错误' },
] as const

/** DaemonSet 条件类型 */
export type DaemonSetConditionType = (typeof _daemonsetConditionTypes)[number]['value']
