/**
 * Kubernetes Pod 常量配置
 * @module config/kubernetes/pod
 */

import type { Option } from './common'

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_GRAY_90, COLOR_PRIMARY, COLOR_SUCCESS, COLOR_WARNING } from '@/config/color'

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

/** HostPath 类型映射 */
const _hostPathTypes = [
  { value: '', label: '未指定', labelEn: '', color: COLOR_GRAY_90 },
  { value: 'DirectoryOrCreate', label: '目录或创建', labelEn: 'DirectoryOrCreate', color: COLOR_PRIMARY },
  { value: 'Directory', label: '目录', labelEn: 'Directory', color: COLOR_PRIMARY },
  { value: 'FileOrCreate', label: '文件或创建', labelEn: 'FileOrCreate', color: COLOR_PRIMARY },
  { value: 'File', label: '文件', labelEn: 'File', color: COLOR_PRIMARY },
  { value: 'Socket', label: '套接字', labelEn: 'Socket', color: COLOR_PRIMARY },
  { value: 'CharDevice', label: '字符设备', labelEn: 'CharDevice', color: COLOR_PRIMARY },
  { value: 'BlockDevice', label: '块设备', labelEn: 'BlockDevice', color: COLOR_PRIMARY },
] as const

/** HostPath 类型 */
export type HostPathType = (typeof _hostPathTypes)[number]['value']

/** 存储介质类型映射 */
const _storageMediums = [
  { value: '', label: '默认介质', labelEn: '', color: COLOR_PRIMARY },
  { value: 'Memory', label: '内存', labelEn: 'Memory', color: COLOR_PRIMARY },
  { value: 'HugePages', label: '大页内存', labelEn: 'HugePages', color: COLOR_PRIMARY },
  { value: 'HugePages-', label: '大页内存前缀', labelEn: 'HugePages-', color: COLOR_PRIMARY },
] as const

/** 存储介质类型 */
export type StorageMedium = (typeof _storageMediums)[number]['value']

/** 节点标签匹配运算符映射 */
const _nodeExpressionOperators = [
  { value: 'In', label: '包含于', labelEn: 'In', color: COLOR_PRIMARY },
  { value: 'NotIn', label: '不包含于', labelEn: 'NotIn', color: COLOR_PRIMARY },
  { value: 'Exists', label: '存在', labelEn: 'Exists', color: COLOR_PRIMARY },
  { value: 'DoesNotExist', label: '不存在', labelEn: 'DoesNotExist', color: COLOR_PRIMARY },
  { value: 'Gt', label: '大于', labelEn: 'Gt', color: COLOR_PRIMARY },
  { value: 'Lt', label: '小于', labelEn: 'Lt', color: COLOR_PRIMARY },
] as const

/** 节点标签匹配运算符 */
export type NodeExpressionOperator = (typeof _nodeExpressionOperators)[number]['value']

/** 污点容忍运算符映射 */
const _tolerationOperators = [
  { value: 'Exists', label: '存在', labelEn: 'Exists', color: COLOR_PRIMARY },
  { value: 'Equal', label: '等于', labelEn: 'Equal', color: COLOR_PRIMARY },
  { value: 'Lt', label: '小于', labelEn: 'Lt', color: COLOR_PRIMARY },
  { value: 'Gt', label: '大于', labelEn: 'Gt', color: COLOR_PRIMARY },
] as const

/** 污点容忍运算符 */
export type TolerationOperator = (typeof _tolerationOperators)[number]['value']

/** 污点效果映射 */
const _taintEffects = [
  { value: 'NoSchedule', label: '不可调度', labelEn: 'NoSchedule', color: COLOR_PRIMARY },
  { value: 'PreferNoSchedule', label: '尽量不可调度', labelEn: 'PreferNoSchedule', color: COLOR_PRIMARY },
  { value: 'NoExecute', label: '驱逐', labelEn: 'NoExecute', color: COLOR_PRIMARY },
] as const

/** 污点效果 */
export type TaintEffect = (typeof _taintEffects)[number]['value']

/** 只读挂载递归模式映射 */
const _recursiveReadOnlyModes = [
  { value: 'Disabled', label: '禁用', labelEn: 'Disabled', color: COLOR_PRIMARY },
  { value: 'IfPossible', label: '可能时启用', labelEn: 'IfPossible', color: COLOR_PRIMARY },
  { value: 'Enabled', label: '启用', labelEn: 'Enabled', color: COLOR_PRIMARY },
] as const

/** 只读挂载递归模式 */
export type RecursiveReadOnlyMode = (typeof _recursiveReadOnlyModes)[number]['value']

/** 挂载传播模式映射 */
const _mountPropagationModes = [
  { value: 'None', label: '不传播', labelEn: 'None', color: COLOR_PRIMARY },
  { value: 'HostToContainer', label: '宿主机到容器', labelEn: 'HostToContainer', color: COLOR_PRIMARY },
  { value: 'Bidirectional', label: '双向', labelEn: 'Bidirectional', color: COLOR_PRIMARY },
] as const

/** 挂载传播模式 */
export type MountPropagationMode = (typeof _mountPropagationModes)[number]['value']

/** 连接协议映射 */
const _uriSchemes = [
  { value: 'HTTP', label: 'HTTP', labelEn: 'HTTP', color: COLOR_PRIMARY },
  { value: 'HTTPS', label: 'HTTPS', labelEn: 'HTTPS', color: COLOR_PRIMARY },
] as const

/** 连接协议 */
export type URIScheme = (typeof _uriSchemes)[number]['value']

/** 端口协议映射 */
const _protocols = [
  { value: 'TCP', label: 'TCP', labelEn: 'TCP', color: COLOR_PRIMARY },
  { value: 'UDP', label: 'UDP', labelEn: 'UDP', color: COLOR_PRIMARY },
  { value: 'SCTP', label: 'SCTP', labelEn: 'SCTP', color: COLOR_PRIMARY },
] as const

/** 端口协议 */
export type Protocol = (typeof _protocols)[number]['value']

/** 终止消息填充方式映射 */
const _terminationMessagePolicies = [
  { value: 'File', label: '文件', labelEn: 'File', color: COLOR_PRIMARY },
  { value: 'FallbackToLogsOnError', label: '错误回退日志', labelEn: 'FallbackToLogsOnError', color: COLOR_PRIMARY },
] as const

/** 终止消息填充方式 */
export type TerminationMessagePolicy = (typeof _terminationMessagePolicies)[number]['value']

/** 镜像拉取策略映射 */
const _pullPolicies = [
  { value: 'Always', label: '总是拉取', labelEn: 'Always', color: COLOR_PRIMARY },
  { value: 'Never', label: '从不拉取', labelEn: 'Never', color: COLOR_PRIMARY },
  { value: 'IfNotPresent', label: '不存在时拉取', labelEn: 'IfNotPresent', color: COLOR_PRIMARY },
] as const

/** 镜像拉取策略 */
export type PullPolicy = (typeof _pullPolicies)[number]['value']

/** 容器/Pod 重启策略映射 */
const _restartPolicies = [
  { value: 'Always', label: '总是重启', labelEn: 'Always', color: COLOR_PRIMARY },
  { value: 'OnFailure', label: '失败时重启', labelEn: 'OnFailure', color: COLOR_PRIMARY },
  { value: 'Never', label: '从不重启', labelEn: 'Never', color: COLOR_PRIMARY },
] as const

/** 容器/Pod 重启策略 */
export type RestartPolicy = (typeof _restartPolicies)[number]['value']

/** DNS 策略映射 */
const _dnsPolicies = [
  {
    value: 'ClusterFirstWithHostNet',
    label: '集群优先(宿主网络)',
    labelEn: 'ClusterFirstWithHostNet',
    color: COLOR_PRIMARY,
  },
  { value: 'ClusterFirst', label: '集群优先', labelEn: 'ClusterFirst', color: COLOR_PRIMARY },
  { value: 'Default', label: '默认', labelEn: 'Default', color: COLOR_PRIMARY },
  { value: 'None', label: '无', labelEn: 'None', color: COLOR_PRIMARY },
] as const

/** DNS 策略 */
export type DNSPolicy = (typeof _dnsPolicies)[number]['value']
