/**
 * Kubernetes NetworkPolicy 网络资源常量配置
 * @module config/kubernetes/network/networkpolicy
 */

import type { Option, ResourcePageMeta } from '@/config/kubernetes'

/** NetworkPolicy 列表页面功能元数据 */
export const NETWORKPOLICY_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-networkpolicy',
  title: '网络策略',
  description:
    '网络策略（NetworkPolicy）是 Kubernetes 中用于控制 Pod 之间网络通信的资源对象，通过定义入站和出站规则实现网络隔离。',
}

/** NetworkPolicy 类型原始数据（用于派生类型） */
const _policyTypes = [
  { value: 'Ingress', label: '入站' },
  { value: 'Egress', label: '出站' },
] as const

/** NetworkPolicy 类型 */
export type PolicyType = (typeof _policyTypes)[number]['value']

/** NetworkPolicy 类型配置选项 */
export const NETWORKPOLICY_TYPE_OPTIONS: Option[] = [..._policyTypes]
