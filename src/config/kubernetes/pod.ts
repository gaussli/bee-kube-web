/**
 * Kubernetes Pod 常量配置
 * @module config/kubernetes/pod
 */

import type { Option } from './common'

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_PRIMARY, COLOR_SUCCESS, COLOR_WARNING } from '@/config/color'

/** Pod 状态映射 */
const _podStatuses = [
  { value: 'Running', label: '运行中', labelEn: 'Running', color: COLOR_SUCCESS },
  { value: 'Pending', label: '等待中', labelEn: 'Pending', color: COLOR_WARNING },
  { value: 'Succeeded', label: '已完成', labelEn: 'Succeeded', color: COLOR_SUCCESS },
  { value: 'Failed', label: '已失败', labelEn: 'Failed', color: COLOR_DANGER },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 },
] as const

/** Pod 状态类型 */
export type PodStatus = (typeof _podStatuses)[number]['value']

/** Pod 状态配置选项 */
export const POD_STATUS_OPTIONS: Option[] = [
  { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  ..._podStatuses,
]

/** 存储介质类型映射 */
const _storageMediums = [
  { value: '', label: '默认介质' },
  { value: 'Memory', label: '内存' },
  { value: 'HugePages', label: '大页内存' },
  { value: 'HugePages-', label: '大页内存前缀' },
] as const

/** 存储介质类型 */
export type StorageMedium = (typeof _storageMediums)[number]['value']

/** 节点标签匹配运算符映射 */
const _nodeExpressionOperators = [
  { value: 'In', label: '包含于' },
  { value: 'NotIn', label: '不包含于' },
  { value: 'Exists', label: '存在' },
  { value: 'DoesNotExist', label: '不存在' },
  { value: 'Gt', label: '大于' },
  { value: 'Lt', label: '小于' },
] as const

/** 节点标签匹配运算符 */
export type NodeExpressionOperator = (typeof _nodeExpressionOperators)[number]['value']

/** 污点容忍运算符映射 */
const _tolerationOperators = [
  { value: 'Exists', label: '存在' },
  { value: 'Equal', label: '等于' },
  { value: 'Lt', label: '小于' },
  { value: 'Gt', label: '大于' },
] as const

/** 污点容忍运算符 */
export type TolerationOperator = (typeof _tolerationOperators)[number]['value']

/** 污点效果映射 */
const _taintEffects = [
  { value: 'NoSchedule', label: '不可调度' },
  { value: 'PreferNoSchedule', label: '尽量不可调度' },
  { value: 'NoExecute', label: '驱逐' },
] as const

/** 污点效果 */
export type TaintEffect = (typeof _taintEffects)[number]['value']

/** 只读挂载递归模式映射 */
const _recursiveReadOnlyModes = [
  { value: 'Disabled', label: '禁用' },
  { value: 'IfPossible', label: '可能时启用' },
  { value: 'Enabled', label: '启用' },
] as const

/** 只读挂载递归模式 */
export type RecursiveReadOnlyMode = (typeof _recursiveReadOnlyModes)[number]['value']

/** 挂载传播模式映射 */
const _mountPropagationModes = [
  { value: 'None', label: '不传播' },
  { value: 'HostToContainer', label: '宿主机到容器' },
  { value: 'Bidirectional', label: '双向' },
] as const

/** 挂载传播模式 */
export type MountPropagationMode = (typeof _mountPropagationModes)[number]['value']

/** 连接协议映射 */
const _uriSchemes = [
  { value: 'HTTP', label: 'HTTP' },
  { value: 'HTTPS', label: 'HTTPS' },
] as const

/** 连接协议 */
export type URIScheme = (typeof _uriSchemes)[number]['value']

/** 终止消息填充方式映射 */
const _terminationMessagePolicies = [
  { value: 'File', label: '文件' },
  { value: 'FallbackToLogsOnError', label: '错误回退日志' },
] as const

/** 终止消息填充方式 */
export type TerminationMessagePolicy = (typeof _terminationMessagePolicies)[number]['value']

/** 镜像拉取策略映射 */
const _pullPolicies = [
  { value: 'Always', label: '总是拉取' },
  { value: 'Never', label: '从不拉取' },
  { value: 'IfNotPresent', label: '不存在时拉取' },
] as const

/** 镜像拉取策略 */
export type PullPolicy = (typeof _pullPolicies)[number]['value']

/** 容器/Pod 重启策略映射 */
const _restartPolicies = [
  { value: 'Always', label: '总是重启' },
  { value: 'OnFailure', label: '失败时重启' },
  { value: 'Never', label: '从不重启' },
] as const

/** 容器/Pod 重启策略 */
export type RestartPolicy = (typeof _restartPolicies)[number]['value']

/** DNS 策略映射 */
const _dnsPolicies = [
  { value: 'ClusterFirstWithHostNet', label: '集群优先(宿主网络)' },
  { value: 'ClusterFirst', label: '集群优先' },
  { value: 'Default', label: '默认' },
  { value: 'None', label: '无' },
] as const

/** DNS 策略 */
export type DNSPolicy = (typeof _dnsPolicies)[number]['value']
