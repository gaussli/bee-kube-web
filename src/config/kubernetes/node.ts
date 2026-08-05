/**
 * Kubernetes 节点管理常量配置
 * @module config/kubernetes/node
 */

import type { ResourcePageMeta, StatusOption } from '@/config/kubernetes/common'

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_SUCCESS } from '@/config/color'

/** 节点页面元数据 */
export const NODE_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-node',
  title: '节点管理',
  description:
    '节点（Node）是 Kubernetes 集群中的工作机器，负责运行容器化应用（Pod）。通过节点管理可以查看集群中所有节点的运行状态、资源使用情况，并支持节点调度控制等运维操作。',
}

/** 节点状态原始数据（不含"全部"选项，用于派生类型） */
const _nodeStatuses = [
  { value: 'Ready', label: '就绪', labelEn: 'Ready', color: COLOR_SUCCESS },
  { value: 'NotReady', label: '未就绪', labelEn: 'NotReady', color: COLOR_DANGER },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 },
] as const

/** 节点状态类型 */
export type NodeStatus = (typeof _nodeStatuses)[number]['value']

/** 节点状态配置选项 */
export const NODE_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '所有状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  ..._nodeStatuses,
]

/** 节点条件类型映射 */
export const NODE_CONDITION_TYPE_MAP = {
  Ready: '就绪',
  MemoryPressure: '内存压力',
  DiskPressure: '磁盘压力',
  PIDPressure: '进程压力',
  NetworkUnavailable: '网络不可用',
} as const

/** 节点条件类型 */
export type NodeConditionType = keyof typeof NODE_CONDITION_TYPE_MAP
