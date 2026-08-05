/**
 * Kubernetes 命名空间管理常量配置
 * @module config/kubernetes/namespace
 */

import { COLOR_PRIMARY, COLOR_SUCCESS } from '@/config/color'
import type { StatusOption } from '@/config/kubernetes/common'

/** 命名空间状态配置选项 */
export const NAMESPACE_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '所有状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  { value: 'Active', label: '活跃', labelEn: 'Active', color: COLOR_SUCCESS },
  { value: 'Terminating', label: '终止中', labelEn: 'Terminating', color: COLOR_PRIMARY },
]
