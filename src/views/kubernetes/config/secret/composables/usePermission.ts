import { usePermission } from '@/composables/usePermission'

/**
 * 密钥页面权限缓存组合式函数
 */
export function useSecretPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:config:secret:create'),
    edit: hasPermission('kubernetes:config:secret:edit'),
    view: hasPermission('kubernetes:config:secret:view'),
    delete: hasPermission('kubernetes:config:secret:delete'),
  }

  return { permissionMap }
}
