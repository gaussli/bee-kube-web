import { COLOR_DANGER, COLOR_PRIMARY, COLOR_SUCCESS } from '@/config/color'

/**
 * 状态配置项
 * @module config/kubernetes
 */
export interface StatusConfig {
  /** 状态匹配值 */
  value: string | number | undefined
  /** 状态中文标签 */
  label: string
  /** 状态英文标签 */
  labelEn: string
  /** 状态指示色 */
  color: string
}

export const CLUSTER_STATUS_CONFIG: StatusConfig[] = [
  { value: undefined, label: '所有状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  { value: 1, label: '健康', labelEn: 'Healthy', color: COLOR_SUCCESS },
  { value: 2, label: '异常', labelEn: 'Unhealthy', color: COLOR_DANGER },
  { value: 3, label: '纳管中', labelEn: 'Registering', color: COLOR_PRIMARY },
  { value: 4, label: '失败', labelEn: 'Failed', color: COLOR_DANGER }
]

export const NODE_STATUS_CONFIG: StatusConfig[] = []

/** 证书即将过期告警阈值（天） */
export const CERT_EXPIRE_WARNING_DAYS = 30
