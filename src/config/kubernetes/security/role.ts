/**
 * Kubernetes Role 安全资源常量配置
 * @module config/kubernetes/security/role
 */

import type { ResourcePageMeta } from '@/config/kubernetes'

/** Role 列表页面功能元数据 */
export const ROLE_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-role',
  title: '角色',
  description:
    '角色（Role）是 Kubernetes 中作用于单个命名空间的 RBAC 权限集合，通过策略规则定义该命名空间内资源的访问权限，可被 RoleBinding 绑定授予用户或服务账号。',
}
