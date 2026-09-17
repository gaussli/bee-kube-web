import { usePermission } from '@/composables/usePermission'

/**
 * 角色页面权限缓存组合式函数
 */
export function useRolePermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:security:role:create'),
    edit: hasPermission('kubernetes:security:role:edit'),
    view: hasPermission('kubernetes:security:role:view'),
    delete: hasPermission('kubernetes:security:role:delete'),
  }

  return { permissionMap }
}
