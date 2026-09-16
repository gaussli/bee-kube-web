import { usePermission } from '@/composables/usePermission'

/**
 * 命名空间页面权限缓存组合式函数
 */
export function useNamespacePermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:namespace:create'),
    edit: hasPermission('kubernetes:namespace:edit'),
    view: hasPermission('kubernetes:namespace:view'),
    delete: hasPermission('kubernetes:namespace:delete'),
    resourceQuotaView: hasPermission('kubernetes:resourcequota:view'),
    limitRangeView: hasPermission('kubernetes:limitrange:view'),
  }

  return { permissionMap }
}
