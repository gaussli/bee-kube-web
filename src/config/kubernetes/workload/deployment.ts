import type { Option, ResourcePageMeta } from '..'

/** Deployment 列表页面功能元数据 */
export const DEPLOYMENT_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-deployment',
  title: '无状态应用',
  description:
    '无状态应用（Deployment）是 Kubernetes 中用于管理无状态工作负载的控制器，支持应用的部署、扩缩容、滚动更新和回滚等操作。',
}

/** Deployment 状态原始数据（用于派生类型） */
const _deploymentStatuses: Option[] = [
  { value: 'Running', label: '运行中', type: 'success' },
  { value: 'Available', label: '部分就绪', type: 'success' },
  { value: 'Stopped', label: '已停止', type: 'default' },
  { value: 'Creating', label: '创建中', type: 'primary' },
  { value: 'Updating', label: '更新中', type: 'primary' },
  { value: 'Paused', label: '更新暂停', type: 'default' },
  { value: 'Terminating', label: '终止中', type: 'primary' },
  { value: 'CreateTimeout', label: '创建超时', type: 'danger' },
  { value: 'UpdateTimeout', label: '更新超时', type: 'danger' },
  { value: 'Failed', label: '失败异常', type: 'danger' },
  { value: 'Unknown', label: '未知', type: 'default' },
] as const

/** Deployment 状态类型 */
export type DeploymentStatus = (typeof _deploymentStatuses)[number]['value']

/** Deployment 状态配置选项 */
export const DEPLOYMENT_STATUS_OPTIONS: Option[] = [{ value: undefined, label: '全部状态' }, ..._deploymentStatuses]

/** Deployment 更新策略原始数据（用于派生类型） */
const _deploymentUpdateStrategyTypes = [
  { value: 'RollingUpdate', label: '滚动更新' },
  { value: 'Recreate', label: '重建' },
] as const

/** Deployment 更新策略类型 */
export type DeploymentUpdateStrategyType = (typeof _deploymentUpdateStrategyTypes)[number]['value']

/** Deployment 更新策略配置选项 */
export const DEPLOYMENT_UPDATE_STRATEGY_OPTIONS: Option[] = [..._deploymentUpdateStrategyTypes]

/** Deployment 条件类型原始数据（用于派生类型） */
const _deploymentConditionTypes = [
  { value: 'Available', label: '可用' },
  { value: 'Progressing', label: '处理中' },
  { value: 'ReplicaFailure', label: '副本失败' },
] as const

/** Deployment 条件类型 */
export type DeploymentConditionType = (typeof _deploymentConditionTypes)[number]['value']
