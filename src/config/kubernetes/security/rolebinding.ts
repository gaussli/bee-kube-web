/**
 * Kubernetes RoleBinding 安全资源常量配置
 * @module config/kubernetes/security/rolebinding
 */

import type { ResourcePageMeta } from '@/config/kubernetes'

/** RoleBinding 列表页面功能元数据 */
export const ROLEBINDING_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-role-binding',
  title: '角色绑定',
  description:
    '角色绑定（RoleBinding）将 Role 中定义的权限授予一组主体（用户、用户组或服务账号），授权范围仅限于该绑定所在的命名空间。',
}
