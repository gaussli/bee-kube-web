import type { StatusConfig } from '@/components/BeeStatus/types'

export const ClusterStatusConfig: StatusConfig[] = [
  { value: 1, label: '健康', labelEn: 'Healthy', color: '#22c55e' },
  { value: 0, label: '异常', labelEn: 'Unhealthy', color: '#f87171' },
  { value: 0, label: '纳管中', labelEn: 'Registering', color: '#38bdf8' },
  { value: 0, label: '失败', labelEn: 'Failed', color: '#fb923c' }
]

export const NodeStatusConfig: StatusConfig[] = []
