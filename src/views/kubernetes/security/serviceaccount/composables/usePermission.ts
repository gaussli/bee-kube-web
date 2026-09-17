import { usePermission } from '@/composables/usePermission'

/**
 * 服务账号页面权限缓存组合式函数
 */
export function useServiceAccountPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:security:serviceaccount:create'),
    edit: hasPermission('kubernetes:security:serviceaccount:edit'),
    view: hasPermission('kubernetes:security:serviceaccount:view'),
    delete: hasPermission('kubernetes:security:serviceaccount:delete'),
  }

  return { permissionMap }
}
