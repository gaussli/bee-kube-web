/**
 * Kubernetes ClusterRoleBinding 安全资源常量配置
 * @module config/kubernetes/security/clusterrolebinding
 */

import type { ResourcePageMeta } from '@/config/kubernetes'

/** ClusterRoleBinding 列表页面功能元数据 */
export const CLUSTERROLEBINDING_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-cluster-role-binding',
  title: '集群角色绑定',
  description:
    '集群角色绑定（ClusterRoleBinding）将 ClusterRole 中定义的权限授予一组主体（用户、用户组或服务账号），授权范围覆盖整个集群及所有命名空间。',
}
