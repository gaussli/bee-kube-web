/**
 * Kubernetes 集群管理常量配置
 * @module config/kubernetes/cluster
 */

import type { ResourcePageMeta, Option } from '@/config/kubernetes/common'

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_PRIMARY, COLOR_SUCCESS } from '@/config/color'

/** Cluster 列表页面功能元数据 */
export const CLUSTER_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-cluster',
  title: '集群管理',
  description: '对多集群以及每个集群的基础资源、服务组件及相关应用资源等的统一管理。',
}

/** Cluster 状态原始数据（用于派生类型） */
const _clusterStatuses = [
  { value: 'Healthy', label: '健康', labelEn: 'Healthy', color: COLOR_SUCCESS },
  { value: 'Unhealthy', label: '异常', labelEn: 'Unhealthy', color: COLOR_DANGER },
  { value: 'Registering', label: '纳管中', labelEn: 'Registering', color: COLOR_PRIMARY },
  { value: 'Failed', label: '失败', labelEn: 'Failed', color: COLOR_DANGER },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 },
] as const

/** Cluster 状态类型 */
export type ClusterStatus = (typeof _clusterStatuses)[number]['value']

/** Cluster 状态配置选项 */
export const CLUSTER_STATUS_OPTIONS: Option[] = [
  { value: undefined, label: '所有状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  ..._clusterStatuses,
]
