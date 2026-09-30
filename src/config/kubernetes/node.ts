/**
 * Kubernetes 节点管理常量配置
 * @module config/kubernetes/node
 */

import type { ResourcePageMeta, Option } from '@/config/kubernetes'

/** 节点列表页面功能元数据 */
export const NODE_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-node',
  title: '节点管理',
  description:
    '节点（Node）是 Kubernetes 集群中的工作机器，负责运行容器化应用（Pod）。通过节点管理可以查看集群中所有节点的运行状态、资源使用情况，并支持节点调度控制等运维操作。',
}

/** 节点状态原始数据（用于派生类型） */
const _nodeStatuses: Option[] = [
  { value: 'Ready', label: '就绪', type: 'success' },
  { value: 'NotReady', label: '未就绪', type: 'danger' },
  { value: 'Unknown', label: '未知', type: 'default' },
] as const

/** 节点状态类型 */
export type NodeStatus = (typeof _nodeStatuses)[number]['value']

/** 节点状态配置选项 */
export const NODE_STATUS_OPTIONS: Option[] = [{ value: undefined, label: '所有状态' }, ..._nodeStatuses] as const

/** 节点地址类型原始数据（用于派生类型） */
const _nodeAddressTypes = [
  { value: 'Hostname', label: '主机名' },
  { value: 'InternalIP', label: '内网 IP' },
  { value: 'ExternalIP', label: '外网 IP' },
  { value: 'InternalDNS', label: '内网 DNS' },
  { value: 'ExternalDNS', label: '外网 DNS' },
] as const

/** 节点地址类型 */
export type NodeAddressType = (typeof _nodeAddressTypes)[number]['value']

/** 节点条件类型原始数据（用于派生类型） */
const _nodeConditionTypes = [
  { value: 'Ready', label: '就绪' },
  { value: 'MemoryPressure', label: '内存压力' },
  { value: 'DiskPressure', label: '磁盘压力' },
  { value: 'PIDPressure', label: 'PID 压力' },
  { value: 'NetworkUnavailable', label: '网络不可用' },
] as const

/** 节点条件类型 */
export type NodeConditionType = (typeof _nodeConditionTypes)[number]['value']

/**
 * 节点拓扑键配置
 */
export interface NodeTopologyKeyOption {
  /** 拓扑标签键 */
  key: string
  /** 展示名称 */
  label: string
  /** 输入提示文案 */
  tip: string
}

/** 已知节点拓扑键（K8s 稳定版拓扑标签，配置页始终展示，便于新增与修改） */
export const NODE_TOPOLOGY_KEYS: NodeTopologyKeyOption[] = [
  {
    key: 'topology.kubernetes.io/region',
    label: '区域（Region）',
    tip: '键为 topology.kubernetes.io/region，例如 cn-north-1；留空表示本次不提交该拓扑标签。',
  },
  {
    key: 'topology.kubernetes.io/zone',
    label: '可用区（Zone）',
    tip: '键为 topology.kubernetes.io/zone，例如 cn-north-1a；留空表示本次不提交该拓扑标签。',
  },
]

/** 拓扑标签键前缀：用于识别节点上已存在的其它拓扑标签（包含已废弃的 failure-domain 前缀） */
export const TOPOLOGY_KEY_PREFIXES: string[] = ['topology.kubernetes.io/', 'failure-domain.beta.kubernetes.io/']
