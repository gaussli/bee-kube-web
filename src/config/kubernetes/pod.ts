/**
 * Kubernetes Pod 常量配置
 * @module config/kubernetes/pod
 */

import type { Option } from '.'

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_SUCCESS, COLOR_WARNING } from '@/config/color'

/** Pod 列表页面功能元数据 */
export const POD_PAGE_META = {
  icon: 'kubernetes-pod',
  title: 'Pod',
  description:
    'Pod 是 Kubernetes 中最小的可调度单元，表示集群中运行的一个或多个容器的集合，通常用于部署和管理应用程序。',
}

/** Pod 状态原始数据（用于派生类型） */
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

/** 节点标签匹配运算符映射 */
const _nodeExpressionOperators = [
  { value: 'In', label: '包含' },
  { value: 'NotIn', label: '不包含' },
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

/** EmptyDir 存储介质类型映射 */
const _emptyDirStorageMediums = [
  { value: '', label: '默认介质' },
  { value: 'Memory', label: '内存' },
  { value: 'HugePages', label: '大页内存' },
  { value: 'HugePages-', label: '大页内存前缀' },
] as const

/** EmptyDir 存储介质类型 */
export type EmptyDirStorageMedium = (typeof _emptyDirStorageMediums)[number]['value']

/** 只读挂载递归模式映射 */
const _recursiveReadOnlyModes = [
  { value: 'Disabled', label: '禁用' },
  { value: 'IfPossible', label: '可能时启用' },
  { value: 'Enabled', label: '启用' },
] as const

/** 只读挂载递归模式 */
export type RecursiveReadOnlyMode = (typeof _recursiveReadOnlyModes)[number]['value']

/** VolumeMount 挂载传播模式映射 */
const _mountPropagationModes = [
  { value: 'None', label: '不传播' },
  { value: 'HostToContainer', label: '宿主机到容器' },
  { value: 'Bidirectional', label: '双向' },
] as const

/** VolumeMount 挂载传播模式 */
export type MountPropagationMode = (typeof _mountPropagationModes)[number]['value']

/** 连接协议映射 */
const _uriSchemes = [
  { value: 'HTTP', label: 'HTTP' },
  { value: 'HTTPS', label: 'HTTPS' },
] as const

/** 连接协议 */
export type URIScheme = (typeof _uriSchemes)[number]['value']

/** Container 终止消息填充方式映射 */
const _terminationMessagePolicies = [
  { value: 'File', label: '文件' },
  { value: 'FallbackToLogsOnError', label: '错误回退日志' },
] as const

/** Container 终止消息填充方式 */
export type TerminationMessagePolicy = (typeof _terminationMessagePolicies)[number]['value']

/** Container 镜像拉取策略映射 */
const _pullPolicies = [
  { value: 'Always', label: '总是拉取' },
  { value: 'Never', label: '从不拉取' },
  { value: 'IfNotPresent', label: '不存在时拉取' },
] as const

/** Container 镜像拉取策略 */
export type PullPolicy = (typeof _pullPolicies)[number]['value']

/** Container / PodSpec 重启策略映射 */
const _restartPolicies = [
  { value: 'Always', label: '总是重启' },
  { value: 'OnFailure', label: '失败时重启' },
  { value: 'Never', label: '从不重启' },
] as const

/** Container / PodSpec 重启策略 */
export type RestartPolicy = (typeof _restartPolicies)[number]['value']

/** PodSpec DNS 策略映射 */
const _dnsPolicies = [
  { value: 'ClusterFirstWithHostNet', label: '集群优先(宿主网络)' },
  { value: 'ClusterFirst', label: '集群优先' },
  { value: 'Default', label: '默认' },
  { value: 'None', label: '无' },
] as const

/** PodSpec DNS 策略 */
export type DNSPolicy = (typeof _dnsPolicies)[number]['value']

/** Pod 生命周期阶段映射 */
const _podPhases = [
  { value: 'Pending', label: '等待中' },
  { value: 'Running', label: '运行中' },
  { value: 'Succeeded', label: '已完成' },
  { value: 'Failed', label: '已失败' },
  { value: 'Unknown', label: '未知' },
] as const

/** Pod 生命周期阶段 */
export type PodPhase = (typeof _podPhases)[number]['value']

/** Pod QoS 等级映射 */
const _podQosClasses = [
  { value: 'Guaranteed', label: 'Guaranteed' },
  { value: 'Burstable', label: 'Burstable' },
  { value: 'BestEffort', label: 'BestEffort' },
] as const

/** Pod QoS 等级 */
export type PodQOSClass = (typeof _podQosClasses)[number]['value']

/** Pod 条件类型映射 */
const _podConditionTypes = [
  { value: 'ContainersReady', label: '容器就绪' },
  { value: 'Initialized', label: '初始化完成' },
  { value: 'Ready', label: '就绪' },
  { value: 'PodScheduled', label: '已调度' },
  { value: 'DisruptionTarget', label: '中断目标' },
  { value: 'PodReadyToStartContainers', label: '可启动容器' },
  { value: 'PodResizePending', label: '待扩容' },
  { value: 'PodResizeInProgress', label: '扩容中' },
  { value: 'AllContainersRestarting', label: '全部容器重启中' },
] as const

/** Pod 条件类型 */
export type PodConditionType = (typeof _podConditionTypes)[number]['value']
