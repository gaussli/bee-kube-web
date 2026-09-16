import { usePermission } from '@/composables/usePermission'

/**
 * 服务页面权限缓存组合式函数
 */
export function useServicePermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:network:service:create'),
    edit: hasPermission('kubernetes:network:service:edit'),
    view: hasPermission('kubernetes:network:service:view'),
    delete: hasPermission('kubernetes:network:service:delete'),
  }

  return { permissionMap }
}
