import { COLOR_DANGER, COLOR_GRAY_70, COLOR_PRIMARY, COLOR_SUCCESS } from '@/config/color'

/**
 * 状态配置项
 * @module config/kubernetes
 */
export interface StatusOption {
  /** 状态匹配值 */
  value: string | number | undefined
  /** 状态中文标签 */
  label: string
  /** 状态英文标签 */
  labelEn: string
  /** 状态指示色 */
  color: string
}

export const CLUSTER_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '所有状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  { value: 0, label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 },
  { value: 1, label: '健康', labelEn: 'Healthy', color: COLOR_SUCCESS },
  { value: 2, label: '异常', labelEn: 'Unhealthy', color: COLOR_DANGER },
  { value: 3, label: '纳管中', labelEn: 'Registering', color: COLOR_PRIMARY },
  { value: 4, label: '失败', labelEn: 'Failed', color: COLOR_DANGER }
]

export const NODE_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '所有状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  { value: 'Ready', label: '就绪', labelEn: 'Ready', color: COLOR_SUCCESS },
  { value: 'NotReady', label: '未就绪', labelEn: 'NotReady', color: COLOR_DANGER },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 }
]

export const NAMESPACE_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '所有状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  { value: 'Active', label: '活跃', labelEn: 'Active', color: COLOR_SUCCESS },
  { value: 'Terminating', label: '终止中', labelEn: 'Terminating', color: COLOR_PRIMARY }
]

/** Deployment 状态配置选项 */
export const DEPLOYMENT_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  { value: 'Running', label: '运行中', labelEn: 'Running', color: COLOR_SUCCESS },
  { value: 'Available', label: '部分就绪', labelEn: 'Available', color: COLOR_SUCCESS },
  { value: 'Stopped', label: '已停止', labelEn: 'Stopped', color: COLOR_GRAY_70 },
  { value: 'Creating', label: '创建中', labelEn: 'Creating', color: COLOR_PRIMARY },
  { value: 'Updating', label: '更新中', labelEn: 'Updating', color: COLOR_PRIMARY },
  { value: 'Terminating', label: '终止中', labelEn: 'Terminating', color: COLOR_PRIMARY },
  { value: 'CreateTimeout', label: '创建超时', labelEn: 'CreateTimeout', color: COLOR_DANGER },
  { value: 'UpdateTimeout', label: '更新超时', labelEn: 'UpdateTimeout', color: COLOR_DANGER },
  { value: 'Failed', label: '失败异常', labelEn: 'Failed', color: COLOR_DANGER },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 }
]

/** StatefulSet 状态配置选项 */
export const STATEFULSET_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  { value: 'Running', label: '运行中', labelEn: 'Running', color: COLOR_SUCCESS },
  { value: 'Available', label: '部分就绪', labelEn: 'Available', color: COLOR_SUCCESS },
  { value: 'Stopped', label: '已停止', labelEn: 'Stopped', color: COLOR_GRAY_70 },
  { value: 'Creating', label: '创建中', labelEn: 'Creating', color: COLOR_PRIMARY },
  { value: 'Updating', label: '更新中', labelEn: 'Updating', color: COLOR_PRIMARY },
  { value: 'Terminating', label: '终止中', labelEn: 'Terminating', color: COLOR_PRIMARY },
  { value: 'CreateTimeout', label: '创建超时', labelEn: 'CreateTimeout', color: COLOR_DANGER },
  { value: 'UpdateTimeout', label: '更新超时', labelEn: 'UpdateTimeout', color: COLOR_DANGER },
  { value: 'Failed', label: '失败异常', labelEn: 'Failed', color: COLOR_DANGER },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 }
]

/** DaemonSet 状态配置选项 */
export const DAEMONSET_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  { value: 'Running', label: '运行中', labelEn: 'Running', color: COLOR_SUCCESS },
  { value: 'Available', label: '部分就绪', labelEn: 'Available', color: COLOR_SUCCESS },
  { value: 'Stopped', label: '已停止', labelEn: 'Stopped', color: COLOR_GRAY_70 },
  { value: 'Creating', label: '创建中', labelEn: 'Creating', color: COLOR_PRIMARY },
  { value: 'Updating', label: '更新中', labelEn: 'Updating', color: COLOR_PRIMARY },
  { value: 'Terminating', label: '终止中', labelEn: 'Terminating', color: COLOR_PRIMARY },
  { value: 'CreateTimeout', label: '创建超时', labelEn: 'CreateTimeout', color: COLOR_DANGER },
  { value: 'UpdateTimeout', label: '更新超时', labelEn: 'UpdateTimeout', color: COLOR_DANGER },
  { value: 'Failed', label: '失败异常', labelEn: 'Failed', color: COLOR_DANGER },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 }
]

/** Job 状态配置选项 */
export const JOB_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  { value: 'Active', label: '运行中', labelEn: 'Active', color: COLOR_SUCCESS },
  { value: 'Succeeded', label: '已完成', labelEn: 'Succeeded', color: COLOR_SUCCESS },
  { value: 'Failed', label: '已失败', labelEn: 'Failed', color: COLOR_DANGER }
]

/** 证书即将过期告警阈值（天） */
export const CERT_EXPIRE_WARNING_DAYS = 30
