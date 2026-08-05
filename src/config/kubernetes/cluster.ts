/**
 * Kubernetes 集群管理常量配置
 * @module config/kubernetes/cluster
 */

import type { ResourcePageMeta, StatusOption } from '@/config/kubernetes/common'

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_PRIMARY, COLOR_SUCCESS } from '@/config/color'

/** 集群状态配置选项 */
export const CLUSTER_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '所有状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  { value: 0, label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 },
  { value: 1, label: '健康', labelEn: 'Healthy', color: COLOR_SUCCESS },
  { value: 2, label: '异常', labelEn: 'Unhealthy', color: COLOR_DANGER },
  { value: 3, label: '纳管中', labelEn: 'Registering', color: COLOR_PRIMARY },
  { value: 4, label: '失败', labelEn: 'Failed', color: COLOR_DANGER },
]

/** 集群管理页面元数据 */
export const CLUSTER_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-cluster',
  title: '集群管理',
  description: '对多集群以及每个集群的基础资源、服务组件及相关应用资源等的统一管理。',
}
