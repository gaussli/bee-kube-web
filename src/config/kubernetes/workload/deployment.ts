/**
 * Kubernetes Deployment 工作负载常量配置
 * @module config/kubernetes/workload/deployment
 */

import type { ResourcePageMeta, Option } from '@/config/kubernetes/common'

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_PRIMARY, COLOR_SUCCESS } from '@/config/color'

/** Deployment 页面元数据 */
export const DEPLOYMENT_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-deployment',
  title: '无状态应用',
  description:
    '无状态应用（Deployment）是 Kubernetes 中用于管理无状态工作负载的控制器，支持应用的部署、扩缩容、滚动更新和回滚等操作。',
}

/** Deployment 状态原始数据（不含"全部"选项，用于派生类型） */
const _deploymentStatuses = [
  { value: 'Running', label: '运行中', labelEn: 'Running', color: COLOR_SUCCESS },
  { value: 'Available', label: '部分就绪', labelEn: 'Available', color: COLOR_SUCCESS },
  { value: 'Stopped', label: '已停止', labelEn: 'Stopped', color: COLOR_GRAY_70 },
  { value: 'Creating', label: '创建中', labelEn: 'Creating', color: COLOR_PRIMARY },
  { value: 'Updating', label: '更新中', labelEn: 'Updating', color: COLOR_PRIMARY },
  { value: 'Paused', label: '更新暂停', labelEn: 'Paused', color: COLOR_DANGER },
  { value: 'Terminating', label: '终止中', labelEn: 'Terminating', color: COLOR_PRIMARY },
  { value: 'CreateTimeout', label: '创建超时', labelEn: 'CreateTimeout', color: COLOR_DANGER },
  { value: 'UpdateTimeout', label: '更新超时', labelEn: 'UpdateTimeout', color: COLOR_DANGER },
  { value: 'Failed', label: '失败异常', labelEn: 'Failed', color: COLOR_DANGER },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 },
] as const

/** Deployment 状态类型 */
export type DeploymentStatus = (typeof _deploymentStatuses)[number]['value']

/** Deployment 状态配置选项 */
export const DEPLOYMENT_STATUS_OPTIONS: Option[] = [
  { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  ..._deploymentStatuses,
]

/** Deployment 条件类型原始数据（用于派生类型） */
const _deploymentConditionTypes = [
  { value: 'Available', label: '可用', labelEn: 'Available' },
  { value: 'Progressing', label: '处理中', labelEn: 'Progressing' },
  { value: 'ReplicaFailure', label: '副本失败', labelEn: 'ReplicaFailure' },
] as const

/** Deployment 条件类型 */
export type DeploymentConditionType = (typeof _deploymentConditionTypes)[number]['value']

/** Deployment 更新策略原始数据（用于派生类型） */
const _deploymentUpdateStrategies = [
  { value: 'RollingUpdate', label: '滚动更新' },
  { value: 'Recreate', label: '重建' },
] as const

/** Deployment 更新策略类型 */
export type DeploymentUpdateStrategyType = (typeof _deploymentUpdateStrategies)[number]['value']

/** Deployment 更新策略配置选项 */
export const DEPLOYMENT_UPDATE_STRATEGY_OPTIONS: Option[] = [..._deploymentUpdateStrategies]
