import { usePermission } from '@/composables/usePermission'

/**
 * 集群角色绑定页面权限缓存组合式函数
 */
export function useClusterRoleBindingPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:security:clusterrolebinding:create'),
    edit: hasPermission('kubernetes:security:clusterrolebinding:edit'),
    view: hasPermission('kubernetes:security:clusterrolebinding:view'),
    delete: hasPermission('kubernetes:security:clusterrolebinding:delete'),
  }

  return { permissionMap }
}
