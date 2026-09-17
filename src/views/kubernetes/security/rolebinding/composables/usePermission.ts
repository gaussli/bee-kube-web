import { usePermission } from '@/composables/usePermission'

/**
 * 角色绑定页面权限缓存组合式函数
 */
export function useRoleBindingPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:security:rolebinding:create'),
    edit: hasPermission('kubernetes:security:rolebinding:edit'),
    view: hasPermission('kubernetes:security:rolebinding:view'),
    delete: hasPermission('kubernetes:security:rolebinding:delete'),
  }

  return { permissionMap }
}
