/**
 * Kubernetes Service 网络资源常量配置
 * @module config/kubernetes/network/service
 */

import type { ResourcePageMeta } from '@/config/kubernetes/common'

/** Service 页面元数据 */
export const SERVICE_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-service',
  title: '服务',
  description:
    '服务（Service）是 Kubernetes 中用于定义一组 Pod 访问策略的抽象，通过固定虚拟 IP 或域名将请求负载均衡到后端 Pod，屏蔽 Pod 动态调度带来的地址变化。',
}

/** Service 类型标签映射 */
export const SERVICE_TYPE_LABEL_MAP = {
  ClusterIP: '集群内访问',
  NodePort: '集群外访问',
  LoadBalancer: '负载均衡',
  ExternalName: '外部域名',
} as const

/** Service 类型 */
export type ServiceType = keyof typeof SERVICE_TYPE_LABEL_MAP
