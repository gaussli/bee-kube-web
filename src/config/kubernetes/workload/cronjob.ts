/**
 * Kubernetes CronJob 工作负载常量配置
 * @module config/kubernetes/workload/cronjob
 */

import type { ResourcePageMeta, StatusOption } from '@/config/kubernetes/common'

import { COLOR_GRAY_70, COLOR_SUCCESS, COLOR_WARNING } from '@/config/color'

/** CronJob 页面元数据 */
export const CRONJOB_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-cronjob',
  title: '定时任务',
  description: '定时任务（CronJob）用于定时运行任务，按照 Cron 表达式调度 Job 执行。',
}

/** CronJob 状态原始数据（不含"全部"选项，用于派生类型） */
const _cronjobStatuses = [
  { value: 'Active', label: '运行中', labelEn: 'Active', color: COLOR_SUCCESS },
  { value: 'Suspended', label: '已暂停', labelEn: 'Suspended', color: COLOR_WARNING },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 },
] as const

/** CronJob 状态类型 */
export type CronJobStatus = (typeof _cronjobStatuses)[number]['value']

/** CronJob 状态配置选项 */
export const CRONJOB_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  ..._cronjobStatuses,
]
