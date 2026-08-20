/**
 * Kubernetes Ingress 网络资源常量配置
 * @module config/kubernetes/network/ingress
 */

import type { Option, ResourcePageMeta } from '@/config/kubernetes/common'

/** Ingress 列表页面功能元数据 */
export const INGRESS_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-ingress',
  title: '路由',
  description:
    '路由（Ingress）是 Kubernetes 中用于管理集群外部 HTTP/HTTPS 访问的资源对象，支持基于域名和路径的流量路由。',
}

/** Ingress 路径匹配类型原始数据（用于派生类型） */
const _pathTypes = [
  { value: 'Exact', label: '精确匹配' },
  { value: 'Prefix', label: '前缀匹配' },
  { value: 'ImplementationSpecific', label: '实现相关' },
] as const

/** Ingress 路径匹配类型 */
export type PathType = (typeof _pathTypes)[number]['value']

/** Ingress 路径匹配类型配置选项 */
export const INGRESS_PATH_TYPE_OPTIONS: Option[] = [..._pathTypes]
