/**
 * Kubernetes 节点管理常量配置
 * @module config/kubernetes/node
 */

import type { ResourcePageMeta, Option } from '@/config/kubernetes/common'

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_SUCCESS } from '@/config/color'

/** 节点列表页面功能元数据 */
export const NODE_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-node',
  title: '节点管理',
  description:
    '节点（Node）是 Kubernetes 集群中的工作机器，负责运行容器化应用（Pod）。通过节点管理可以查看集群中所有节点的运行状态、资源使用情况，并支持节点调度控制等运维操作。',
}

/** 节点状态原始数据（用于派生类型） */
const _nodeStatuses = [
  { value: 'Ready', label: '就绪', labelEn: 'Ready', color: COLOR_SUCCESS },
  { value: 'NotReady', label: '未就绪', labelEn: 'NotReady', color: COLOR_DANGER },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 },
] as const

/** 节点状态类型 */
export type NodeStatus = (typeof _nodeStatuses)[number]['value']

/** 节点状态配置选项 */
export const NODE_STATUS_OPTIONS: Option[] = [
  { value: undefined, label: '所有状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  ..._nodeStatuses,
]

/** 节点生命周期阶段原始数据（用于派生类型） */
const _nodePhases = [
  { value: 'Pending', label: '待配置' },
  { value: 'Running', label: '运行中' },
  { value: 'Terminated', label: '已终止' },
] as const

/** 节点生命周期阶段 */
export type NodePhase = (typeof _nodePhases)[number]['value']

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
