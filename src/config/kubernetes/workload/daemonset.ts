import type { Option, ResourcePageMeta } from '..'

/** DaemonSet 列表页面功能元数据 */
export const DAEMONSET_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-daemonset',
  title: '守护进程集',
  description:
    '守护进程集（DaemonSet）是 Kubernetes 中用于确保每个节点运行一个 Pod 副本的控制器，常用于日志采集、监控代理、存储驱动等节点级守护服务。',
}

/** DaemonSet 状态原始数据（用于派生类型） */
const _daemonsetStatuses: Option[] = [
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

/** DaemonSet 状态类型 */
export type DaemonSetStatus = (typeof _daemonsetStatuses)[number]['value']

/** DaemonSet 状态配置选项 */
export const DAEMONSET_STATUS_OPTIONS: Option[] = [{ value: undefined, label: '全部状态' }, ..._daemonsetStatuses]

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
