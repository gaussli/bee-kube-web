import type { Option, ResourcePageMeta } from '../common'

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_SUCCESS } from '@/config/color'

/** Job 列表页面功能元数据 */
export const JOB_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-job',
  title: '任务',
  description: '任务（Job）用于运行一次性批量任务，任务完成后 Pod 会自动终止，适用于数据处理、备份、定时计算等场景。',
}

/** Job 状态原始数据（用于派生类型） */
const _jobStatuses = [
  { value: 'Active', label: '运行中', labelEn: 'Active', color: COLOR_SUCCESS },
  { value: 'Succeeded', label: '已完成', labelEn: 'Succeeded', color: COLOR_SUCCESS },
  { value: 'Failed', label: '已失败', labelEn: 'Failed', color: COLOR_DANGER },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 },
] as const

/** Job 状态类型 */
export type JobStatus = (typeof _jobStatuses)[number]['value']

/** Job 状态配置选项 */
export const JOB_STATUS_OPTIONS: Option[] = [
  { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  ..._jobStatuses,
]

/** Job 完成模式原始数据（用于派生类型） */
const _jobComplectionModes = [
  { value: 'NonIndexed', label: '非索引' },
  { value: 'Indexed', label: '索引' },
] as const

/** Job 完成模式 */
export type JobComplectionMode = (typeof _jobComplectionModes)[number]['value']

/** Job 完成模式配置选项 */
export const JOB_COMPLECTION_MODE_OPTIONS: Option[] = [..._jobComplectionModes]

/** Job 条件类型原始数据（用于派生类型） */
const _jobConditionTypes = [
  { value: 'Complete', label: '已完成' },
  { value: 'Failed', label: '已失败' },
  { value: 'Suspended', label: '已暂停' },
  { value: 'FailureTarget', label: '目标失败' },
  { value: 'SuccessCriteriaMet', label: '满足成功标准' },
] as const

/** Job 条件类型 */
export type JobConditionType = (typeof _jobConditionTypes)[number]['value']
