/**
 * Kubernetes ClusterRole 安全资源常量配置
 * @module config/kubernetes/security/clusterrole
 */

import type { ResourcePageMeta } from '@/config/kubernetes'

/** ClusterRole 列表页面功能元数据 */
export const CLUSTERROLE_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-cluster-role',
  title: '集群角色',
  description:
    '集群角色（ClusterRole）是 Kubernetes 中作用于整个集群的 RBAC 权限集合，通过策略规则定义对集群级或跨命名空间资源的访问权限，可被 ClusterRoleBinding 绑定授予用户或服务账号。',
}
