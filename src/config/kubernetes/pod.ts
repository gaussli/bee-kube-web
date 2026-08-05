/**
 * Kubernetes Pod 常量配置
 * @module config/kubernetes/pod
 */

import { COLOR_DANGER, COLOR_GRAY_70, COLOR_SUCCESS, COLOR_WARNING } from '@/config/color'
import type { StatusOption } from './common'

/** Pod 状态配置选项 */
export const POD_STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS },
  { value: 'Running', label: '运行中', labelEn: 'Running', color: COLOR_SUCCESS },
  { value: 'Pending', label: '等待中', labelEn: 'Pending', color: COLOR_WARNING },
  { value: 'Succeeded', label: '已完成', labelEn: 'Succeeded', color: COLOR_SUCCESS },
  { value: 'Failed', label: '已失败', labelEn: 'Failed', color: COLOR_DANGER },
  { value: 'Unknown', label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 },
]
