/**
 * Kubernetes ServiceAccount 安全资源常量配置
 * @module config/kubernetes/security/serviceaccount
 */

import type { ResourcePageMeta } from '@/config/kubernetes'

/** ServiceAccount 列表页面功能元数据 */
export const SERVICEACCOUNT_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-service-account',
  title: '服务账号',
  description:
    '服务账号（ServiceAccount）是 Kubernetes 中为 Pod 提供身份标识的资源对象，可绑定 Secrets 与 RBAC 权限，用于 Pod 访问 API Server 时的身份认证与授权。',
}
