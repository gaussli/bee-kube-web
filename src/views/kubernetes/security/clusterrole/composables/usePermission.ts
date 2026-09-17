import { usePermission } from '@/composables/usePermission'

/**
 * 集群角色页面权限缓存组合式函数
 */
export function useClusterRolePermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:security:clusterrole:create'),
    edit: hasPermission('kubernetes:security:clusterrole:edit'),
    view: hasPermission('kubernetes:security:clusterrole:view'),
    delete: hasPermission('kubernetes:security:clusterrole:delete'),
  }

  return { permissionMap }
}
