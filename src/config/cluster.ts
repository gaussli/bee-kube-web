import type { StatusConfig } from './types'

export const clusterStatusConfig: StatusConfig[] = [
  { value: 1, label: '正常', color: 'rgb(103, 194, 58)' },
  { value: 0, label: '异常', color: 'rgb(245, 108, 108)' }
]
