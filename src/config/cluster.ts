import type { StatusConfig } from '@/components/BeeStatus/types'

export const clusterStatusConfig: StatusConfig[] = [
  { value: 1, label: '正常', labelEn: 'Running', color: 'rgb(103, 194, 58)' },
  { value: 0, label: '异常', labelEn: 'Error', color: 'rgb(245, 108, 108)' }
]
