/**
 * Kubernetes DaemonSet 工作负载常量配置
 * @module config/kubernetes/workload/daemonset
 */

import type { ResourcePageMeta, StatusOption } from '@/config/kubernetes/common'

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_PRIMARY, COLOR_SUCCESS } from '@/config/color'

/** DaemonSet 页面元数据 */
export const DAEMONSET_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-daemonset',
  title: '守护应用',
  description:
    '守护应用（DaemonSet）是 Kubernetes 中用于确保每个节点运行一个 Pod 副本的控制器，常用于日志采集、监控代理、存储驱动等节点级守护服务。',
}

/** DaemonSet 状态原始数据（不含"全部"选项，用于派生类型） */
const _daemonsetStatuses = [
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

/** DaemonSet 状态类型 */
export type DaemonSetStatus = (typeof _daemonsetStatuses)[number]['value']

/** DaemonSet 状态配置选项 */
export const DAEMONSET_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  ..._daemonsetStatuses,
]

/** DaemonSet 条件类型映射 */
export const DAEMONSET_CONDITION_TYPE_MAP = {
  Available: '可用',
  Progressing: '处理中',
} as const

/** DaemonSet 条件类型 */
export type DaemonSetConditionType = keyof typeof DAEMONSET_CONDITION_TYPE_MAP

/** DaemonSet 更新策略标签映射 */
export const DAEMONSET_STRATEGY_LABEL_MAP = {
  RollingUpdate: '滚动更新',
  OnDelete: '删除时更新',
} as const

/** DaemonSet 更新策略类型 */
export type DaemonSetStrategyType = keyof typeof DAEMONSET_STRATEGY_LABEL_MAP
